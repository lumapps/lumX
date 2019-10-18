const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { CONFIGS, DIST_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const minify = Boolean(process.env.MINIFY);

const filename = `[name]${minify ? '.min' : ''}`;
const distTechPath = `${DIST_PATH}`;

const { entry } = baseConfig;
entry.lumx = [...entry.lumx];

const minimizer = [];
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
            title: `LumX - ${minify ? 'Minified package' : 'Package'}`,
        }),
    );
}

if (minify) {
    plugins.push(new HtmlMinifierPlugin(CONFIGS.htmlMinifier));
    plugins.push(
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: CONFIGS.cssNano,
            cssProcessorPluginOptions: {},
        }),
    );
    minimizer.push(
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: CONFIGS.terser,
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'replace',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, {
    bail: true,
    devtool: minify ? 'source-map' : '',
    mode: 'production',
    name: `lumx-umd${minify ? '-minified' : ''}`,

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
        sourceMapFilename: minify ? `${filename}.js.map` : undefined,
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: minify,
        minimizer,
    },
});
