const IS_CI = require('is-ci');
const glob = require('glob');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { CORE_PATH, DEMO_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const filename = '[name]';
const distTechPath = `${DEMO_PATH}`;

const entry = Object.assign(baseConfig.entry, {
    components: [...glob.sync(`${DEMO_PATH}/components/**/*.js`)],
    foundations: [...glob.sync(`${DEMO_PATH}/foundations/**/*.js`)],
    layout: [...glob.sync(`${DEMO_PATH}/layout/**/*.js`)],
});
entry.lumx = [`${CORE_PATH}/scss/_lumx.scss`, ...entry.lumx];

const plugins = [
    ...baseConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),
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
