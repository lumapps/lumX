const IS_CI = require('is-ci');
var glob = require('glob');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { CORE_PATH, MODULES_PATH } = require('./constants');

const { babelSetup } = require('./utils');

const plugins = [new WebpackBar(), new FriendlyErrorsWebpackPlugin()];

const baseConfig = {
    cache: true,

    devtool: 'cheap-module-source-map',

    entry: {
        'lumx': [
			`${CORE_PATH}/scss/_lumx.scss`,
			...glob.sync(`${CORE_PATH}/js/**/*.js`),
			...glob.sync(`${MODULES_PATH}/js/**/*.js`),
			...glob.sync(`${MODULES_PATH}/dropdown/views/*.html`),
			...glob.sync(`${MODULES_PATH}/file-input/views/*.html`),
			...glob.sync(`${MODULES_PATH}/text-field/views/*.html`),
			...glob.sync(`${MODULES_PATH}/search-filter/views/*.html`),
			...glob.sync(`${MODULES_PATH}/select/views/*.html`),
			...glob.sync(`${MODULES_PATH}/tabs/views/*.html`),
			...glob.sync(`${MODULES_PATH}/date-picker/views/*.html`),
			...glob.sync(`${MODULES_PATH}/button/views/*.html`),
			...glob.sync(`${MODULES_PATH}/checkbox/views/*.html`),
			...glob.sync(`${MODULES_PATH}/radio-button/views/*.html`),
			...glob.sync(`${MODULES_PATH}/stepper/views/*.html`),
			...glob.sync(`${MODULES_PATH}/switch/views/*.html`),
			...glob.sync(`${MODULES_PATH}/fab/views/*.html`),
			...glob.sync(`${MODULES_PATH}/icon/views/*.html`),
			...glob.sync(`${MODULES_PATH}/data-table/views/*.html`),
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
                        options: babelSetup({ plugins: [['angularjs-annotate', { explicitOnly: true }]] }),
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
			{ test: /\/dropdown\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.dropdown" },
			{ test: /\/file-input\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.file-input" },
			{ test: /\/text-field\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.text-field" },
			{ test: /\/search-filter\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.search-filter" },
			{ test: /\/select\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.select" },
			{ test: /\/tabs\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.tabs" },
			{ test: /\/date-picker\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.date-picker" },
			{ test: /\/button\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.button" },
			{ test: /\/checkbox\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.checkbox" },
			{ test: /\/radio-button\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.radio-button" },
			{ test: /\/stepper\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.stepper" },
			{ test: /\/switch\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.switch" },
			{ test: /\/fab\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.fab" },
			{ test: /\/icon\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.icon" },
			{ test: /\/data-table\/.*\.html$/, loader: "angular-templatecache-loader?module=lumx.data-table" },
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
