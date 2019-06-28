const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const { CONFIGS, DIST_PATH, MODULES_PATH, STYLES_PATH } = require('./constants');

const baseConfig = require('./webpack.config');

const minify = Boolean(process.env.MINIFY);
const generatePackage = Boolean(process.env.GENERATE_PACKAGE);

const filename = `[name]${minify ? '.min' : ''}`;
const distTechPath = `${DIST_PATH}`;

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

if (generatePackage) {
    plugins.push(
        new CopyWebpackPlugin([
            {
                context: `${STYLES_PATH}/`,
                from: `${STYLES_PATH}/*.scss`,
                to: `${DIST_PATH}/scss`,
            },
            {
                context: `${STYLES_PATH}/`,
                from: `${STYLES_PATH}/**/*.scss`,
                to: `${DIST_PATH}/scss`,
            },
            {
                context: `${MODULES_PATH}/`,
                from: `${MODULES_PATH}/**/*.scss`,
                to: `${DIST_PATH}/scss/modules`,
                flatten: true,
			},
        ]),
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
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, {
    bail: true,
    devtool: minify ? 'source-map' : '',
    mode: 'production',
    name: `lumx-umd${minify ? '-minified' : ''}`,

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
