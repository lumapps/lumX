const IS_CI = require('is-ci');
var glob = require('glob');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { CORE_PATH, DEFAULT_HOST, DEMO_PATH, MODULES_PATH, ROOT_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const plugins = [
    ...baseConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: '[name].css',
        filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
        inject: false,
        template: `${DEMO_PATH}/index.html`,
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'LumX - Development',
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, {
    entry: {
        'lumx': [
			`${CORE_PATH}/scss/_lumx.scss`,
			`${CORE_PATH}/js/lumx.js`,
			...glob.sync(`${CORE_PATH}/js/**/*.js`).filter(p => p !== `${CORE_PATH}/js/lumx.js`),
			...glob.sync(`${MODULES_PATH}/js/**/*.js`),
		],
        'demo-site': `${DEMO_PATH}/app.js`,
        'lumx-theme': `${DEMO_PATH}/scss/lumx.scss`,
	},

    devServer: {
        compress: true,
		contentBase: [DEMO_PATH, ROOT_PATH],
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: DEFAULT_HOST,
        hot: true,
        open: true,
        overlay: true,
        // eslint-disable-next-line no-magic-numbers
        port: 4001,
        quiet: true,
	},

    module: {
        rules: getStyleLoader({ mode: 'dev' }),
	},

    plugins,
});
