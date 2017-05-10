const commonConfig = require('./webpack.common');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/*
 * Webpack Plugins.
 */
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const SassLintPlugin = require('sasslint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

/*
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The webpack documentation on CLI}
 *
 * @param {Object} metadata The metadata to generate the config
 */
module.exports = function webpackCommonBuildConfigExport(metadata) {
    return webpackMerge.smart(commonConfig(metadata), {
        /**
         * Options affecting the normal modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#module|The Webpack documentation on modules}
         */
        module: {
            /**
             * An array of rules containing (pre|post)loaders.
             *
             * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
             * This means they are not resolved relative to the configuration file.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#module-loaders|The Webpack documentation on loaders}
             * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
             */
            rules: [
                /*
                 * Fix an Angular performance issue by removing inline sourcemaps.
                 *
                 * @see {@link https://www.npmjs.com/package/string-replace-loader|String-Replace Loader}
                 */
                {
                    enforce: 'post',
                    test: /\.js$/i,
                    use: [
                        helpers.getLoader('string-replace', metadata.env),
                    ],
                },
            ],
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: [
            /*
             * Plugin: CommonsChunkPlugin.
             * Description: Shares common code between the pages. It identifies common modules and put them into a
             *              commons chunk.
             *
             * @see {@link https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin|The webpack Common Chunck Plugin page}
             * @see {@link https://github.com/webpack/docs/wiki/optimization#multi-page-app|The webpack documentation on optimization}
             */
            new CommonsChunkPlugin({
                chunks: ['polyfills'],
                name: 'polyfills',
            }),

            // This enables tree shaking of the vendor modules.
            new CommonsChunkPlugin({
                chunks: ['main'],
                minChunks: (mod) => (/node_modules/).test(mod.resource),
                name: 'vendor',
            }),

            // Specify the correct order the scripts will be injected in.
            new CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse(),
            }),

            /*
             * Plugin: ForkCheckerPlugin.
             * Description: Do type checking in a separate process, so webpack don't need to wait.
             *
             * @see {@link https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse|Awesome Typescript Loader forkchecker}
             */
            new CheckerPlugin(),

            /**
             * Plugin: SASSLintPlugin.
             * Description: Lint the SASS files.
             *
             * @see {@link https://github.com/alleyinteractive/sasslint-webpack-plugin|SASS Lint Webpack Plugin}
             */
            new SassLintPlugin({
                context: [
                    './src/client',
                ],
                failOnError: true,
                failOnWarning: false,
                glob: './src/client/**/*.s?(a|c)ss',
                /*
                 * NOTE: we need to use the ignoreFiles array here and have the same files as in the .sass-lint.yml
                 * because the plugin doesn't parse the config file for ignored files... *lame*!
                 */
                ignoreFiles: [],
                quiet: false,
                testing: false,
            }),

            /*
             * Plugin: ScriptExtHtmlWebpackPlugin.
             * Description: Enhances html-webpack-plugin functionality with different deployment options for your
             *              scripts.
             *
             * @see {@link https://github.com/numical/script-ext-html-webpack-plugin|Script Ext HTML Webpack Plugin}
             */
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer',
            }),
        ],
    });
};
