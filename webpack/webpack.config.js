const IS_CI = require('is-ci');
var glob = require('glob');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { babelSetup } = require('./utils');
const { CORE_PATH, MODULES_PATH } = require('./constants');

const plugins = [new WebpackBar(), new FriendlyErrorsWebpackPlugin()];

const baseConfig = {
    cache: true,

    devtool: 'cheap-module-source-map',

    entry: {
        'lumx': [
			`${CORE_PATH}/scss/_lumx.scss`,
			`${CORE_PATH}/js/lumx.js`,
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
            {
                exclude: /index.html/,
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
