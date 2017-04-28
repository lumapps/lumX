const isCI = process.env.CI || require('is-ci') || false;

const isDebug = process.env.DEBUG || false;
const isLive = process.env.LIVE || false;

const enableRemapping = true;
const coverageReportDirectory = './tests/client/unit/report/';

const reporters = ['mocha'];
const coverageReporters = {
    html: coverageReportDirectory,
    json: `${coverageReportDirectory}coverage-remapped.json`,
};

if (!isDebug) {
    reporters.push('coverage');

    if (enableRemapping) {
        reporters.push('remap-coverage');
    }
}

if (!isLive) {
    coverageReporters.text = null;
    coverageReporters['text-summary'] = null;
}

module.exports = function karmaConfig(config) {
    const configuration = {
        autoWatch: isLive,

        // Base path that will be used to resolve all patterns (e.g. files, exclude).
        basePath: '',

        /*
         * Start these browsers.
         * Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher.
         */
        browsers: ['Chrome'],

        client: {
            captureConsole: false,
        },

        // Enable/disable colors in the output (reporters and logs).
        colors: !isCI,

        coverageReporter: {
            dir: coverageReportDirectory,
            reporters: [
                {
                    type: 'in-memory',
                },
            ],
        },

        // List of files to exclude.
        exclude: [],

        // Don't fail if there is no tests.
        failOnEmptyTestSuite: false,

        /*
         * List of files / patterns to load in the browser.
         * We are building the test environment in ./tests/unit/specs-bundle.js.
         */
        files: [
            {
                pattern: './tests/client/unit/specs-bundle.js',
                watched: false,
            },
            {
                included: false,
                nocache: false,
                pattern: './src/client/assets/**/*',
                served: true,
                watched: false,
            },
        ],

        /*
         * Frameworks to use.
         * Available frameworks: https://npmjs.org/browse/keyword/karma-adapter.
         */
        frameworks: [
            'mocha',
            'chai-datetime',
            'chai-string',
            'sinon-chai',
        ],

        /*
         * Level of logging.
         * Possible values: 'config.LOG_DISABLE', 'config.LOG_ERROR', 'config.LOG_WARN', 'config.LOG_INFO',
         *                  'config.LOG_DEBUG'.
         */
        logLevel: (isDebug) ? config.LOG_DEBUG : config.LOG_INFO,

        // Web server port.
        port: 9876,

        /*
         * Preprocess matching files before serving them to the browser.
         * Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor.
         */
        preprocessors: {
            './tests/client/unit/specs-bundle.js': [
                'coverage',
                'webpack',
                'sourcemap',
            ],
        },

        proxies: {
            '/assets/': '/base/src/client/assets/',
        },

        remapCoverageReporter: coverageReporters,

        // Report any test that is slower than 5 seconds.
        reportSlowerThan: 5000,

        /*
         * Test results reporter to use.
         * Possible values: 'dots', 'progress'.
         * Available reporters: https://npmjs.org/browse/keyword/karma-reporter.
         */
        reporters: reporters,

        /*
         * Continuous Integration mode.
         * If true, Karma captures browsers, runs the tests and exits.
         */
        singleRun: !isLive,

        // Webpack Config at ./config/webpack.test.js.
        webpack: require('./config/webpack.test')({
            env: 'test',
        }),
        webpackMiddleware: {
            colors: !isCI,
            noInfo: true,
            quiet: false,
            stats: {
                assets: false,
                cached: false,
                cachedAssets: false,
                children: false,
                chunkModules: false,
                chunkOrigins: false,
                chunks: false,
                colors: !isCI,
                context: './src/client/',
                depth: false,
                entrypoints: false,
                errorDetails: true,
                errors: true,
                exclude: [],
                hash: false,
                modules: false,
                performance: false,
                providedExports: false,
                publicPath: false,
                reasons: false,
                source: false,
                timings: true,
                usedExports: false,
                version: true,
                warnings: true,
                /*
                 * Filter warnings to be shown (since webpack 2.4.0).
                 * Can be a String, Regexp, a function getting the warning and returning a boolean  or an Array of a
                 * combination of the above. First match wins.
                 *
                 * "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false;
                 */
                warningsFilter: undefined,
            },
        },
    };

    // Apply the configuration.
    config.set(configuration);
};
