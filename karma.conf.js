var isDebug = process.env.DEBUG || false;
var browsers = [(isDebug) ? 'Chrome' : 'PhantomJS'];

module.exports = function karmaConfig(config) {
    var configuration = {
        autoWatch: false,

        // Base path that will be used to resolve all patterns (e.g. files, exclude)
        basePath: '',

        /*
         * Start these browsers
         * Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
         */
        browsers: browsers,

        // Enable/disable colors in the output (reporters and logs)
        colors: true,

        coverageReporter: {
            type: 'in-memory',
        },

        // List of files to exclude
        exclude: [],

        /*
         * List of files / patterns to load in the browser
         * We are building the test environment in ./tests/unit/specs-bundle.js
         */
        files: [
            {
                pattern: './tests/client/unit/specs-bundle.js',
                watched: false,
            },
        ],

        /*
         * Frameworks to use
         * Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
         */
        frameworks: [
            'jasmine',
            'jasmine-matchers',
        ],

        /*
         * Level of logging
         * Possible values: 'config.LOG_DISABLE', 'config.LOG_ERROR', 'config.LOG_WARN', 'config.LOG_INFO',
         *                  'config.LOG_DEBUG'
         */
        logLevel: config.LOG_INFO,

        // Web server port
        port: 9876,

        /*
         * Preprocess matching files before serving them to the browser
         * Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
         */
        preprocessors: {
            './tests/client/unit/specs-bundle.js': [
                'coverage',
                'webpack',
                'sourcemap',
            ],
        },

        remapCoverageReporter: {
            'text-summary': null,
            json: './tests/client/unit/report/coverage.json',
            html: './tests/client/unit/report/',
        },

        /*
         * Test results reporter to use
         * Possible values: 'dots', 'progress'
         * Available reporters: https://npmjs.org/browse/keyword/karma-reporter
         */
        reporters: [
            'mocha',
            'coverage',
            'remap-coverage',
        ],

        /*
         * Continuous Integration mode
         * If true, Karma captures browsers, runs the tests and exits
         */
        singleRun: true,

        // Webpack Config at ./config/webpack.test.js
        webpack: require('./config/webpack.test')({ env: 'test' }),
        webpackMiddleware: {
            noInfo: true,
            quiet: true,
            stats: 'errors-only',
        },
    };

    // Apply the configuration
    config.set(configuration);
};
