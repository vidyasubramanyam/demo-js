const {config} = require('./wdio.shared.conf');
const defaultBrowserSauceOptions = {
    build: `WebdriverIO-V6 build-${new Date().getTime()}`,
    screenResolution: '1600x1200',
    seleniumVersion: '3.141.59',
};
const chromeOptions = {
    'goog:chromeOptions': {
        'w3c': true,
    },
};

// =========================
// Sauce RDC specific config
// =========================
config.user = process.env.SAUCE_USERNAME;
config.key = process.env.SAUCE_ACCESS_KEY;
// If you run your tests on Sauce Labs you can specify the region you want to run your tests
// in via the `region` property. Available short handles for regions are `us` (default) and `eu`.
// These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
// If you don't provide the region, it defaults to `us`.
config.region = 'us';

// ============
// Capabilities
// ============
config.capabilities = [
    /**
     * Desktop browsers
     */
    {
        browserName: 'googlechrome',
        platformName: 'Windows 10',
        browserVersion: 'latest',
        'sauce:options': {
            ...defaultBrowserSauceOptions,
        },
        ...chromeOptions,
    },
    {
        browserName: 'safari',
        platformName: 'iOS',
        deviceName: 'iPhone 11 Simulator',
        deviceOrientation: 'portrait',
        platformVersion: '14.0',
        name: 'testing-iphone'
    },
    {
        browserName: 'chrome',
        platformName: 'android',
        deviceName: 'Google Pixel 3 GoogleAPI Emulator',
        deviceOrientation: 'portrait',
        platformVersion: '11.0',
        name: 'testing-pixel'
    }
];

config.services = config.services.concat('sauce');

exports.config = config;
