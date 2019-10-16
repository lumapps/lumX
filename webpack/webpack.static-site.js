const IS_CI = require('is-ci');
const glob = require('glob');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { DEMO_PATH, STATIC_SITE_PATH, NODE_MODULES_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const filename = '[name]';
const distTechPath = `${STATIC_SITE_PATH}`;

const entry = Object.assign(baseConfig.entry, {
    app: `${DEMO_PATH}/app.js`,
    components: [...glob.sync(`${DEMO_PATH}/components/**/*.js`)],
    foundations: [...glob.sync(`${DEMO_PATH}/foundations/**/*.js`)],
    layout: [...glob.sync(`${DEMO_PATH}/layout/**/*.js`)],
});
entry.lumx = [...entry.lumx, `${DEMO_PATH}/scss/lumx.scss`];

const plugins = [
    ...baseConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),
    new HtmlWebpackPlugin({
        inject: false,
        template: `${DEMO_PATH}/index.html`,
    }),
    new CopyWebpackPlugin([
        {
            from: NODE_MODULES_PATH,
            to: `${STATIC_SITE_PATH}/node_modules`,
        },
        {
            from: `${DEMO_PATH}/components`,
            to: `${STATIC_SITE_PATH}/demo/components`,
        },
        {
            from: `${DEMO_PATH}/foundations`,
            to: `${STATIC_SITE_PATH}/demo/foundations`,
        },
    ]),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'LumX - Demo',
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'replace',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, {
    bail: true,
    devtool: '',
    mode: 'production',
    name: 'lumx-umd',

    entry,

    module: {
        rules: getStyleLoader({ mode: 'prod' }),
    },

    output: {
        ...baseConfig.output,
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        library: {
            root: 'LumX',
            amd: 'official-lumx',
            commonjs: 'official-lumx',
        },
        libraryTarget: 'umd',
        path: distTechPath,
        sourceMapFilename: undefined,
        umdNamedDefine: true,
    },

    plugins,
});
