const {ConfigParser} = require('@wdio/config');
const {ensureFileSync, readFileSync, removeSync, writeFileSync} = require('fs-extra');
const {parseSync, transformFromAstSync} = require('@babel/core');
const {cloneDeep} = require('lodash');

exports.config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/**/*.js',
        // './test/specs/login.spec.js'
    ],
    // ============
    // Capabilities
    // ============
    maxInstances: 100,
    // capabilities can be found in the `wdio.local.chrome.conf.js` or `wdio.sauce.conf.js`
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'silent',
    bail: 0,
    baseUrl: 'https://www.saucedemo.com/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
        helpers: [require.resolve('@babel/register')],
    },
    services: [],
    onPrepare: (config) => {
        const configParser = new ConfigParser();

        // Get the specs
        const specs = config.specs;
        const exclude = config.exclude;
        const currentSpecs = configParser.getSpecs(specs, exclude);

        // Make a copy of the original spec and empty the current one
        config.originalSpecs = config.specs;
        config.specs=[];

        // Now iterate over each spec and split it into single it's per file
        currentSpecs.forEach(spec => {
            const file = readFileSync(spec, 'utf8');
            // @TODO: this is crappy, but enough for an initial POC
            const singleDescribe = file.match(/(describe\()/g).length === 1;

            if (singleDescribe) {
                const ast = parseSync(file);
                const describeIndex = findDescribeIndex(ast);
                const itIndexes = findItIndex(ast.program.body[describeIndex]);

                // Now do the magic
                createSingleItFiles(ast, describeIndex, itIndexes, spec);
                // Push the new specs into the config
                itIndexes.forEach(currentItIndex => config.specs.push(`${spec}.${currentItIndex}.js`));
            } else {
                console.log(` WARNING, THIS SPEC FILE: ${spec}
 CONTAINS MULTIPLE DESCRIBES AND CAN NOT BE SPLIT!`
                );
                config.specs.push(spec);
            }
        });
    },

    onComplete: (exitCode, config)=>{
        // When done remove the files and clean up the config.specs
        config.specs.forEach(spec=> removeSync(spec));
        config.specs = config.originalSpecs;
        delete config.originalSpecs;
    }
};

/**
 * For the describes
 */
const isCallToDescribe = (node) =>
    node.type === 'ExpressionStatement'
    && node.expression.type === 'CallExpression'
    && node.expression.callee.type === 'Identifier'
    && node.expression.callee.name.toLowerCase() === 'describe';
const findDescribeIndex = (ast) =>
    ast.program.body.reduce((array, node, index) => isCallToDescribe(node) ? [...array, index] : array, []);

/**
 * For the it's
 */
const isCallToIt = (node) =>
    node.type === 'ExpressionStatement'
    && node.expression.type === 'CallExpression'
    && node.expression.callee.type === 'Identifier'
    && node.expression.callee.name.toLowerCase() === 'it';
const findItIndex = (body) =>
    body.expression.arguments[1].body.body.reduce((array, node, index) => isCallToIt(node) ? [...array, index] : array, []);


const createSingleItFiles = (ast, describeIndex, itIndexes, spec)=> {
    itIndexes.forEach((currentItIndex) => {
        const newAst = cloneDeep(ast);
        // Get the describe
        const describe = newAst.program.body[describeIndex];
        // First one is always the StringLiteral, second one the (Arrow)FunctionExpression
        const describeArgs = describe.expression.arguments[1].body.body;
        // Filter out the before/after-All/Each and the matching it so we get
        // one it with the current before/after-All/Each
        describe.expression.arguments[1].body.body = describeArgs.filter((arg, index) => {
            return index === currentItIndex || !itIndexes.includes(index);
        });

        const newCode = transformFromAstSync(newAst).code;
        ensureFileSync(`${spec}.${currentItIndex}.js`);
        writeFileSync(`${spec}.${currentItIndex}.js`, newCode);
    });
}
