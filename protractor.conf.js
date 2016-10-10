require('ts-node/register');

var helpers = require('./config/modules/helpers');
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var ConsoleReporter = require('jasmine-console-reporter');

var isDebug = process.env.DEBUG || false;

var useWebpack = false;

var host = 'localhost';
var port = (useWebpack) ? '8880' : '8881';

exports.config = {
    allScriptsTimeout: 110000,

    baseUrl: 'http://' + host + ':' + port + '/',

    capabilities: {
        browserName: 'chrome',
    },

    directConnect: true,

    exclude: [],

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 400000,
        includeStackTrace: false,
        isVerbose: false,
        showColors: false,
        showTiming: false,
        silent: true,
    },

    onPrepare: function onPrepare() {
        browser.ignoreSynchronization = true;
        browser.driver
               .manage()
               .window()
               .maximize();

        jasmine.getEnv().clearReporters();

        jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
            consolidate: true,
            consolidateAll: true,
            filePrefix: 'e2e-report-' + Date.now(),
            savePath: './tests/client/e2e/report/',
            screenshotsFolder: 'screenshots',
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true,
        }));
        jasmine.getEnv().addReporter(new ConsoleReporter({
            activity: !isDebug,
            cleanStack: 2,
            colors: 1,
            listStyle: 'indent',
            verbosity: 4,
        }));

        jasmine.getEnv().beforeEach(function beforeEachJasmineGetEnv() {
            jasmine.addMatchers(require('./config/modules/jasmine-matchers'));
        });
    },

    specs: [
        helpers.root('tests/client/e2e/specs/**/*.ts'),
    ],

    stackTrace: false,

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one
     * matching `rootEl`
     */
    useAllAngular2AppRoots: true,
};
