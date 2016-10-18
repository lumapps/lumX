const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');

/*
 * Webpack Plugins
 */
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

/*
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The webpack documentation on CLI}
 *
 * @param {{ env: string }} options The options to generate the config
 */
module.exports = function webpackCommonBuildConfigExport(options) {
    return webpackMerge.smart(commonConfig(options), {
        module: {
            postLoaders: [
                /*
                 * Fix an Angular2 performance issue
                 */
                {
                    loader: 'string-replace',
                    query: {
                        flags: 'g',
                        replace: 'var sourceMappingUrl = "";',
                        search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
                    },
                    test: /\.js$/i,
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
             * CommonsChunkPlugin.
             * Shares common code between the pages.
             * It identifies common modules and put them into a commons chunk.
             *
             * @see {@link https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin|The webpack Common Chunck Plugin page}
             * @see {@link https://github.com/webpack/docs/wiki/optimization#multi-page-app|The webpack documentation on optimization}
             */
            new CommonsChunkPlugin({
                name: [
                    'polyfills',
                    'vendors',
                ].reverse(),
            }),

            /*
             * ForkCheckerPlugin.
             * Do type checking in a separate process, so webpack don't need to wait.
             *
             * @see {@link https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse|Awesome Typescript Loader forkchecker}
             */
            new ForkCheckerPlugin(),
        ],
    });
};
