const IS_CI = require('is-ci');
const glob = require('glob');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { COMPONENTS_PATH, CORE_PATH } = require('./constants');

const { babelSetup } = require('./utils');

const plugins = [new WebpackBar(), new FriendlyErrorsWebpackPlugin()];

const baseConfig = {
    cache: true,

    devtool: 'cheap-module-source-map',

    entry: {
        lumx: [
            ...glob.sync(`${CORE_PATH}/**/*.js`),
            ...glob.sync(`${COMPONENTS_PATH}/**/*.js`),
            ...glob.sync(`${COMPONENTS_PATH}/checkbox/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/chip/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/data-table/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/dialog/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/dropdown/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/icon/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/list/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/progress/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/radio-button/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/select/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/side-navigation/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/switch/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/table/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/tabs/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/text-field/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/thumbnail/views/*.html`),
            ...glob.sync(`${COMPONENTS_PATH}/toolbar/views/*.html`),
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
                exclude: [/demo\/components/u],
                test: /\/checkbox\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.checkbox&relativeTo=components/checkbox/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/chip\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.chip&relativeTo=components/chip/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/data-table\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.data-table&relativeTo=components/data-table/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/dialog\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.dialog&relativeTo=components/dialog/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/dropdown\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.dropdown&relativeTo=components/dropdown/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/icon\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.icon&relativeTo=components/icon/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/list\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.list&relativeTo=components/list/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/progress\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.progress&relativeTo=components/progress/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/radio-button\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.radio-button&relativeTo=components/radio-button/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/select\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.select&relativeTo=components/select/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/side-navigation\/.*\.html$/,
                loader:
                    'angular-templatecache-loader-2?module=lumx.side-navigation&relativeTo=components/side-navigation/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/switch\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.switch&relativeTo=components/switch/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/table\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.table&relativeTo=components/table/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/tabs\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.tabs&relativeTo=components/tabs/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/text-field\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.text-field&relativeTo=components/text-field/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/thumbnail\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.thumbnail&relativeTo=components/thumbnail/views/',
            },
            {
                exclude: [/demo\/components/u],
                test: /\/toolbar\/.*\.html$/,
                loader: 'angular-templatecache-loader-2?module=lumx.toolbar&relativeTo=components/toolbar/views/',
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
