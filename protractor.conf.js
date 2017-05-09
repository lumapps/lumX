const helpers = require('./config/modules/helpers');

const tsConfigFileName = './tsconfig.e2e.json';
const tsConfig = require(tsConfigFileName);

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

    beforeLaunch: () => {
        require('ts-node').register({
            project: tsConfigFileName,
        });
        require('tsconfig-paths').register({
            baseUrl: tsConfig.compilerOptions.baseUrl,
            paths: tsConfig.compilerOptions.paths,
        });
    },

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                'show-fps-counter=true',
            ],
        },
    },

    directConnect: true,

    exclude: [],

    framework: 'mocha',

    mochaOpts: {
        compilers: 'ts:ts-node/register',
        reporter: 'spec',
        require: ['tsconfig-paths/register'],
        slow: 5000,
        timeout: 50000,
    },

    onPrepare: () => {
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
    },

    specs: [
        helpers.root('src', 'client', 'app', '**', '*.e2e.ts'),
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
