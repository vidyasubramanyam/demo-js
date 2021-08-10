const {config} = require('./wdio.shared.sauce.conf');

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
//
// For configuring a simulator please check
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
config.capabilities =
    [1,1,1,1,1,1,1,1,1,1].map((config)=> ({
        // The defaults you need to have in your config
        deviceName: 'iPhone 12 Simulator',
        platformName: 'iOS',
        platformVersion: '14.5',
        deviceOrientation: 'PORTRAIT',
        // You can provide the Appium Version, please check the platform configurator for all possible versions
        appiumVersion: '1.20.1',
        // The path to the app that has been uploaded to the Sauce Storage,
        // see https://wiki.saucelabs.com/display/DOCS/Application+Storage for more information
        app: 'storage:filename=iOS.Simulator.SauceLabs.Mobile.Sample.app.zip',
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        noReset: true,
        newCommandTimeout: 240,
        // Always default the language to a language you prefer so you know the app language is always as expected
        language: 'en',
        locale: 'en',
        // build: 'Foo',
        build: 'iOS Normal checkout flow',
    }))
;

exports.config = config;
