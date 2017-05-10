const commonConfig = require('./webpack.common.build.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins.
 */
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/**
 * Webpack Constants.
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.prod;
const METADATA = helpers.getMetadata(ENV);

/**
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 *
 * @return {Object} The webpack production configuration.
 */
module.exports = function webpackProdConfigExport() {
    const aotPlugins = [];
    if (helpers.ENABLE_AOT) {
        aotPlugins.push(
            new NormalModuleReplacementPlugin(
              /@angular(\\|\/)upgrade/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /@angular(\\|\/)compiler/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /@angular(\\|\/)platform-browser-dynamic/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /dom(\\|\/)debug(\\|\/)ng_probe/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /dom(\\|\/)debug(\\|\/)by/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /src(\\|\/)debug(\\|\/)debug_node/,
              helpers.root('config', 'empty.js')
            ),
            new NormalModuleReplacementPlugin(
              /src(\\|\/)debug(\\|\/)debug_renderer/,
              helpers.root('config', 'empty.js')
            )
        );
    }

    return webpackMerge.smart(commonConfig(METADATA), {
        /**
         * Developer tool to enhance debugging.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#devtool|The Webpack documentation on devTool}
         * @see {@link https://github.com/webpack/docs/wiki/build-performance#sourcemaps|The Webpack documentation on sourcemap}
         */
        devtool: 'source-map',

        /**
         * Options affecting the output of the compilation.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#output|The Webpack documentation on output}
         */
        output: {
            /** The filename of non-entry chunks as relative path inside the 'output.path' directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-chunkfilename|The Webpack documentation on chunk file name}
             */
            chunkFilename: '[id].[chunkhash].chunk.js',

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-filename|The Webpack documentation on output file name}
             */
            filename: '[name].[chunkhash].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-sourcemapfilename|The Webpack documentation on sourcemap file name}
             */
            sourceMapFilename: '[file].[chunkhash].bundle.map',
        },

        /**
         * Disable performance hints.
         *
         * @see {@link https://github.com/a-tarasyuk/rr-boilerplate/blob/master/webpack/dev.config.babel.js#L41}
         */
        performance: {
            hints: false,
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: [
            /**
             * Plugin: NormalModuleReplacementPlugin.
             * Description: Replace resources that matches resourceRegExp with newResource.
             *
             * @see {@link http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin|Normal Modul Replacement Plugin}
             */
            new NormalModuleReplacementPlugin(
                /angular2-hmr/i,
                helpers.root('config', 'empty.js')
            ),

            new NormalModuleReplacementPlugin(
                /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
                helpers.root('config', 'empty.js')
            ),

            /**
             * Webpack plugin to optimize a JavaScript file for faster initial load by wrapping eagerly-invoked
             * functions.
             *
             * @see: {@link https://github.com/vigneshshanmugam/optimize-js-plugin|OptimizeJS Webpack Plugin}
             */
            new OptimizeJsPlugin({
                sourceMap: false,
            }),

            /**
             * Plugin: UglifyJsPlugin.
             * Description: Minimize all JavaScript output of chunks.
             *
             * @see {@link https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin|Uglify Plugin}
             * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
             */
            /*
             * NOTE: To debug prod builds uncomment lines after "Debug production configuration" and comment lines after
             * "Plain production configuration".
             */
            new UglifyJsPlugin({
                // Debug production configuration.
                /* eslint-disable lumapps/comments-sentences */
                // beautify: true,
                // comments: true,
                // compress: false,
                // mangle: false,
                /* eslint-enable lumapps/comments-sentences */

                // Plain production configuration.
                beautify: false,
                /* eslint-disable camelcase */
                compress: {
                    comparisons: true,
                    conditionals: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    // We need this for lazy v8.
                    negate_iife: false,
                    screw_ie8: true,
                    sequences: true,
                    unused: true,
                    warnings: false,
                },
                mangle: {
                    screw_ie8: true,
                },
                output: {
                    comments: false,
                },
                /* eslint-enable camelcase */
            }),
        ].concat(aotPlugins),
    });
};
