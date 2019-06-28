const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { DEFAULT_HOST, DEMO_PATH, ROOT_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const devConfig = {
    entry: {
        'demo-site': `${DEMO_PATH}/app.js`,
    },
};

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
})(baseConfig, devConfig, {
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
    entry: {
        'lumx': `${DEMO_PATH}/scss/lumx.scss`,
    },
    module: {
        rules: getStyleLoader({ mode: 'dev' }),
    },
    plugins,
});
