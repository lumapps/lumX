const IS_CI = require('is-ci');
const glob = require('glob');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { CORE_PATH, MODULES_PATH } = require('./constants');

const { babelSetup } = require('./utils');

const plugins = [new WebpackBar(), new FriendlyErrorsWebpackPlugin()];

const baseConfig = {
    cache: true,

    devtool: 'cheap-module-source-map',

    entry: {
        lumx: [
            ...glob.sync(`${CORE_PATH}/js/**/*.js`),
            ...glob.sync(`${MODULES_PATH}/**/*.js`),
            ...glob.sync(`${MODULES_PATH}/dropdown/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/file-input/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/text-field/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/search-filter/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/select/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/tabs/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/date-picker/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/checkbox/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/radio-button/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/stepper/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/switch/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/fab/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/icon/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/data-table/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/progress/views/*.html`),
        ],
    },

    externals: [
        '@uirouter/angularjs',
        'angularjs',
        {
            jquery: {
                commonjs: 'jquery',
                amd: 'jquery',
                root: '$',
            },
        },
    ],

    mode: 'development',

    module: {
        rules: [
            {
                exclude: [/node_modules/u, /\.(test|spec)\.js/u, /testing/u],
                test: /\.js$/u,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({
                            plugins: [['angularjs-annotate', { explicitOnly: true }]],
                        }),
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif|woff(2)?|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name]-[hash:8].[ext]',
                },
            },
            {
                test: /\/dropdown\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.dropdown&relativeTo=modules/dropdown/views/',
            },
            {
                test: /\/file-input\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.file-input&relativeTo=modules/file-input/views/',
            },
            {
                test: /\/text-field\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.text-field&relativeTo=modules/text-field/views/',
            },
            {
                test: /\/search-filter\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.search-filter&relativeTo=modules/search-filter/views/',
            },
            {
                test: /\/select\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.select&relativeTo=modules/select/views/',
            },
            {
                test: /\/tabs\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.tabs&relativeTo=modules/tabs/views/',
            },
            {
                test: /\/date-picker\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.date-picker&relativeTo=modules/date-picker/views/',
            },
            {
                test: /\/checkbox\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.checkbox&relativeTo=modules/checkbox/views/',
            },
            {
                test: /\/radio-button\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.radio-button&relativeTo=modules/radio-button/views/',
            },
            {
                test: /\/stepper\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.stepper&relativeTo=modules/stepper/views/',
            },
            {
                test: /\/switch\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.switch&relativeTo=modules/switch/views/',
            },
            {
                test: /\/fab\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.fab&relativeTo=modules/fab/views/',
            },
            {
                test: /\/icon\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.icon&relativeTo=modules/icon/views/',
            },
            {
                test: /\/data-table\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.data-table&relativeTo=modules/data-table/views/',
            },
            {
                test: /\/progress\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.progress&relativeTo=modules/progress/views/',
            },
            {
                exclude: [/index.html/, /\/views\/.*\.html/],
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },

    node: {
        fs: 'empty',
    },

    output: {
        chunkFilename: '[name].js',
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
    },

    performance: {
        hints: false,
    },

    plugins,

    profile: false,

    resolve: {
        extensions: ['.js', 'json'],
        modules: ['node_modules'],
    },

    stats: {
        builtAt: true,
        colors: !IS_CI,
        errorDetails: true,
        errors: true,
        performance: true,
        timings: true,
        warnings: true,

        assets: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        chunks: false,
        depth: false,
        entrypoints: false,
        env: false,
        hash: false,
        moduleTrace: false,
        modules: false,
        providedExports: false,
        publicPath: false,
        reasons: false,
        source: false,
        usedExports: false,
        version: false,
    },

    target: 'web',
};

module.exports = baseConfig;
