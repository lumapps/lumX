require('ts-node/register');

const helpers = require('./config/modules/helpers');

// eslint-disable-next-line no-unused-vars
const isCI = process.env.CI || require('is-ci') || false;
// eslint-disable-next-line no-unused-vars
const isDebug = process.env.DEBUG || false;

const useWebpack = false;

const host = 'localhost';
const port = (useWebpack) ? '8880' : '8881';

exports.config = {
    allScriptsTimeout: 110000,

    baseUrl: `http://${host}:${port}/`,

    capabilities: {
        browserName: 'chrome',
    },

    directConnect: true,

    exclude: [],

    framework: 'mocha',

    mochaOpts: {
        reporter: 'spec',
        slow: 5000,
    },

    onPrepare: function onPrepare() {
        browser.ignoreSynchronization = true;
        browser.driver
            .manage()
            .window()
            .maximize();
    },

    specs: [
        helpers.root('tests', 'client', 'e2e', 'specs', '**', '*.ts'),
    ],

    stackTrace: false,

    /**
     * Angular 2 configuration.
     *
     * 'useAllAngular2AppRoots': tells Protractor to wait for any angular2 apps on the page instead of just the one
     * matching `rootEl`.
     */
    useAllAngular2AppRoots: true,
};
