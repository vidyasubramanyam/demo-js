const {ConfigParser} = require('@wdio/config');
const {ensureFileSync, readFileSync, removeSync, writeFileSync} = require('fs-extra');
const {parseSync, transformFromAstSync} = require('@babel/core');
const { Parser } = require("acorn");
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
    onPrepare: (config, capabilities) => {
        const configParser = new ConfigParser();

        const specs = config.specs;
        const exclude = config.exclude;
        const currentSpecs = configParser.getSpecs(specs, exclude);
        config.originalSpecs = config.specs;
        config.specs=[];

        console.log('==========================================================\n');
        console.log(' Start parsing specs\n');
        console.log('=============================\n');
        console.log(' Config specs = ', specs);
        console.log(' CurrentSpecs = ', currentSpecs);

        currentSpecs.forEach(spec => {
            const file = readFileSync(spec, 'utf8');
            const singleDescribe = file.match(/(describe\()/g).length === 1;
            console.log(` Parse spec-file: ${spec}`);
            console.log(` Holds a single describe: ${singleDescribe}`);
            if (singleDescribe) {
                // cut file into single it's?
                const amountOfTests = file.match(/(it\()/g).length;
                console.log(` Amount of tests: ${amountOfTests}`);
                const ast = parseSync(file);
                // console.log('ast = ', JSON.stringify(ast, null, 2));
                const describeIndex = findDescribeIndex(ast);
                console.log('describeIndex = ', describeIndex)
                const itIndexes = findItIndex(ast.program.body[describeIndex]);
                console.log('itIndexes = ', itIndexes);

                foo(ast, describeIndex, itIndexes, spec);
                itIndexes.forEach(currentItIndex => config.specs.push(`${spec}.${currentItIndex}.js`))

                // itIndexes.forEach((currentItIndex) => {
                //     console.log('currentItIndex = ', currentItIndex)
                //     const describe = ast.program.body[describeIndex];
                //     let describeArgs = describe.expression.arguments[1].body.body
                //     // const it = describeArgs[currentItIndex];
                //     // console.log('it = ',JSON.stringify(it, null, 2))
                //     // console.log('describeArgs = ',describeArgs)
                //     // console.log('it = ',it)
                //
                //     // console.log('describeArgs.length = ', describeArgs.length)
                //     const removedIts = describeArgs.filter((arg, index) => {
                //         return index === currentItIndex || !itIndexes.includes(index);
                //     });
                //
                //     describe.expression.arguments[1].body.body = removedIts
                //
                //     console.log('describeArgs = ', describe.expression.arguments[1].body.body)
                //
                //     // // need to remove the other it's so if it is [1,2,3] and we are a currentItIndex 2 we need to remove 1 and 3
                //     // const describe = ast.program.body[describeIndex];
                //     //
                //     // console.log('describe = ', describe)
                //     // const newAst = {
                //     //     ...ast,
                //     //     program: {
                //     //         ...ast.program,
                //     //         body: ast.program.filter((_node, index) => !itIndexes.includes(index) || index === currentItIndex),
                //     //     },
                //     // };
                //     // const newCode = transformFromAstSync(newAst).code;
                //     // console.log(newCode);
                //     // console.log('----');
                // });
            } else {
                console.log(` WARNING, THIS SPEC FILE: ${spec}
 CONTAINS MULTIPLE DESCRIBES AND CAN NOT BE SPLIT!`
                );
            }
            console.log('=============================\n');

            // console.log('singleDescribe = ', singleDescribe)
            // console.log('file = ', file);
        });
        console.log('\n==========================================================');
    },

    onComplete: (exitCode, config)=>{
        config.specs.forEach(spec=> {
            console.log('spec = ', spec)
            removeSync(spec)
        })
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

// Always the second in the body
const findItIndex = (body) =>
    body.expression.arguments[1].body.body.reduce((array, node, index) => isCallToIt(node) ? [...array, index] : array, []);


const foo = (ast, describeIndex, itIndexes, spec)=> {
    itIndexes.forEach((currentItIndex) => {
        // https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
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
        // console.log(newCode);
        console.log('----');
    });
}
