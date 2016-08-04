require('ts-node/register');

var helpers = require('./config/modules/helpers');
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var SpecReporter = require('jasmine-spec-reporter');

var config = require('./tests/client/e2e/e2e.conf');

var isDebug = process.env.DEBUG || false;

exports.config = {
    baseUrl: 'http://localhost:8880/',

    specs: [
        helpers.root('tests/client/e2e/specs/**/*.ts'),
    ],
    exclude: [],

    framework: 'jasmine2',

    allScriptsTimeout: 110000,

    jasmineNodeOpts: {
        defaultTimeoutInterval: 400000,
        includeStackTrace: true,
        isVerbose: true,
        showColors: true,
        showTiming: true,
    },

    directConnect: isDebug,

    capabilities: {
        'browserName': 'chrome',
    },

    onPrepare: function() {
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();

        jasmine.getEnv().addReporter(
            new Jasmine2HtmlReporter({
                filePrefix: 'e2e-report-' + Date.now(),
                savePath: './tests/client/e2e/report/',
                screenshotsFolder: 'screenshots',
                takeScreenshots: true,
                takeScreenshotsOnlyOnFailures: true,
                consolidate: true,
                consolidateAll: true,
            })
        );
        jasmine.getEnv().addReporter(
            new SpecReporter({
                displayStacktrace: 'specs', // display stacktrace for each failed. Values: all|specs|summary|none
                displayFailuresSummary: true, // display summary of all failures after execution
                displayPendingSummary: true, // display summary of all pending specs after execution
                displaySuccessfulSpec: true, // display each successful spec
                displayFailedSpec: true, // display each failed spec
                displayPendingSpec: false, // display each pending spec
                displaySpecDuration: false, // display each spec duration
                displaySuiteNumber: false, // display each suite number (hierarchical)
            })
        );

        jasmine.getEnv().beforeEach(function() {
            jasmine.addMatchers(require('./config/modules/jasmine-matchers'));
        });
    },

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one
     * matching `rootEl`
     */
    useAllAngular2AppRoots: true,
};

exports.config.jasmineNodeOpts.print = function() {};
if (!isDebug) {
    exports.config.capabilities.browserName = 'phantomjs';
    exports.config.capabilities['phantomjs.binary.path'] = require('phantomjs').path;
    exports.config.capabilities['phantomjs.cli.args'] = [
        '--webdriver-loglevel=DEBUG',
        '--webdriver-logfile=./tests/client/e2e/phantomjsdriver.log',
    ];
}
