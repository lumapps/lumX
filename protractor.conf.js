require('ts-node/register');

var helpers = require('./config/modules/helpers');
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var SpecReporter = require('jasmine-spec-reporter');

var isHidden = process.env.HIDDEN || false;

exports.config = {
    allScriptsTimeout: 110000,

    baseUrl: 'http://localhost:8880/',

    capabilities: {
        browserName: 'chrome',
    },

    directConnect: !isHidden,

    exclude: [],

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 400000,
        includeStackTrace: false,
        isVerbose: false,
        showColors: true,
        showTiming: true,
    },

    onPrepare: function onPrepare() {
        browser.ignoreSynchronization = true;
        browser.driver
               .manage()
               .window()
               .maximize();

        jasmine.getEnv().addReporter(
            new Jasmine2HtmlReporter({
                consolidate: true,
                consolidateAll: true,
                filePrefix: 'e2e-report-' + Date.now(),
                savePath: './tests/client/e2e/report/',
                screenshotsFolder: 'screenshots',
                takeScreenshots: true,
                takeScreenshotsOnlyOnFailures: true,
            })
        );
        jasmine.getEnv().addReporter(
            new SpecReporter({
                displayFailedSpec: true,
                displayFailuresSummary: true,
                displayPendingSpec: false,
                displayPendingSummary: true,
                displaySpecDuration: false,
                displayStacktrace: 'specs',
                displaySuccessfulSpec: true,
                displaySuiteNumber: false,
            })
        );

        jasmine.getEnv().beforeEach(function beforeEachJasmineGetEnv() {
            jasmine.addMatchers(require('./config/modules/jasmine-matchers'));
        });
    },

    specs: [
        helpers.root('tests/client/e2e/specs/**/*.ts'),
    ],

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one
     * matching `rootEl`
     */
    useAllAngular2AppRoots: true,
};

exports.config.jasmineNodeOpts.print = function jasminePrint() {
    // Nothing to do here
};
if (isHidden) {
    exports.config.capabilities.browserName = 'phantomjs';
    exports.config.capabilities['phantomjs.binary.path'] = require('phantomjs').path;
    exports.config.capabilities['phantomjs.cli.args'] = [
        '--webdriver-loglevel=DEBUG',
        '--webdriver-logfile=./tests/client/e2e/phantomjsdriver.log',
    ];
}
