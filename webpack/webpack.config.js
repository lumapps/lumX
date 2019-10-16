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
            ...glob.sync(`${MODULES_PATH}/checkbox/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/chip/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/data-table/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/date-picker/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/dialog/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/dropdown/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/icon/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/list/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/popover/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/progress/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/radio-button/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/select/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/side-navigation/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/switch/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/table/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/tabs/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/text-field/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/thumbnail/views/*.html`),
            ...glob.sync(`${MODULES_PATH}/toolbar/views/*.html`),
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
                include: [/modules/u],
                test: /\/checkbox\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.checkbox&relativeTo=modules/checkbox/views/',
            },
            {
                include: [/modules/u],
                test: /\/chip\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.chip&relativeTo=modules/chip/views/',
            },
            {
                include: [/modules/u],
                test: /\/data-table\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.data-table&relativeTo=modules/data-table/views/',
            },
            {
                include: [/modules/u],
                test: /\/date-picker\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.date-picker&relativeTo=modules/date-picker/views/',
            },
            {
                include: [/modules/u],
                test: /\/dialog\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.dialog&relativeTo=modules/dialog/views/',
            },
            {
                include: [/modules/u],
                test: /\/dropdown\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.dropdown&relativeTo=modules/dropdown/views/',
            },
            {
                include: [/modules/u],
                test: /\/icon\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.icon&relativeTo=modules/icon/views/',
            },
            {
                include: [/modules/u],
                test: /\/list\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.list&relativeTo=modules/list/views/',
            },
            {
                include: [/modules/u],
                test: /\/popover\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.popover&relativeTo=modules/popover/views/',
            },
            {
                include: [/modules/u],
                test: /\/progress\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.progress&relativeTo=modules/progress/views/',
            },
            {
                include: [/modules/u],
                test: /\/radio-button\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.radio-button&relativeTo=modules/radio-button/views/',
            },
            {
                include: [/modules/u],
                test: /\/select\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.select&relativeTo=modules/select/views/',
            },
            {
                include: [/modules/u],
                test: /\/side-navigation\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.side-navigation&relativeTo=modules/side-navigation/views/',
            },
            {
                include: [/modules/u],
                test: /\/switch\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.switch&relativeTo=modules/switch/views/',
            },
            {
                include: [/modules/u],
                test: /\/table\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.table&relativeTo=modules/table/views/',
            },
            {
                include: [/modules/u],
                test: /\/tabs\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.tabs&relativeTo=modules/tabs/views/',
            },
            {
                include: [/modules/u],
                test: /\/text-field\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.text-field&relativeTo=modules/text-field/views/',
            },
            {
                include: [/modules/u],
                test: /\/thumbnail\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.thumbnail&relativeTo=modules/thumbnail/views/',
            },
            {
                include: [/modules/u],
                test: /\/toolbar\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.toolbar&relativeTo=modules/toolbar/views/',
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
