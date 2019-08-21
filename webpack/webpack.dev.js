const IS_CI = require('is-ci');
const glob = require('glob');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { DEFAULT_HOST, DEFAULT_PORT, DEMO_PATH, ROOT_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const entry = Object.assign(baseConfig.entry, {
    app: `${DEMO_PATH}/app.js`,
    modules: [...glob.sync(`${DEMO_PATH}/includes/modules/**/*.js`)],
});
entry.lumx = [...entry.lumx, `${DEMO_PATH}/scss/lumx.scss`];

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
    entry: 'replace',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, {
    entry,

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
        port: DEFAULT_PORT,
        quiet: true,
    },

    module: {
        rules: getStyleLoader({ mode: 'dev' }),
    },

    plugins,
});
