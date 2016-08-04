const helpers = require('./modules/helpers');

const commonConfig = require('./webpack.common.js'); // The settings that are common to prod and dev
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // Rsed to merge webpack configs

/*
 * Webpack Plugins
 */
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

/*
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackMerge.smart(commonConfig, {
    /*
     * Options affecting the normal modules.
     *
     * @see http://webpack.github.io/docs/configuration.html#module
     */
    module: {
        /*
         * An array of automatically applied loaders.
         * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
         * This means they are not resolved relative to the configuration file.
         *
         * @see http://webpack.github.io/docs/configuration.html#module-loaders
         */
        loaders: [
            /*
             * Typescript loader support for .ts and Angular 2 async routes via .async.ts
             *
             * @see https://github.com/s-panferov/awesome-typescript-loader
             */
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript',
                    'angular2-template',
                ],
                exclude: [
                    /\.(spec|specs|e2e)\.ts$/,
                    helpers.root('tests'),
                    helpers.root('dist'),
                ],
            },
        ],
    },

    /*
     * Add additional plugins to the compiler.
     *
     * @see http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
        /*
         * Plugin: ForkCheckerPlugin
         * Description: Do type checking in a separate process, so webpack don't need to wait.
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
         */
        new ForkCheckerPlugin(),

        /*
         * Plugin: OccurenceOrderPlugin
         * Description: Varies the distribution of the ids to get the smallest id length
         * for often used ids.
         *
         * @see https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
         * @see https://github.com/webpack/docs/wiki/optimization#minimize
         */
        new webpack.optimize.OccurenceOrderPlugin(true),

        /*
         * Plugin: CommonsChunkPlugin
         * Description: Shares common code between the pages.
         * It identifies common modules and put them into a commons chunk.
         *
         * @see https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
         * @see https://github.com/webpack/docs/wiki/optimization#multi-page-app
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'polyfills',
                'vendor',
            ].reverse(),
        }),
    ],
});
