const commonConfig = require('./webpack.common.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const HMR = false;
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
    ENV: ENV,
    HMR: HMR,
    host: 'localhost',
    port: 8880,
});

/**
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 *
 * @param {{ env: string }} options The options to generate the config
 */
module.exports = function webpackTestConfigExport(options) {
    const realCommonConfig = commonConfig(options);
    realCommonConfig.entry = {};
    realCommonConfig.plugins = [];

    return webpackMerge.smart(realCommonConfig, {
        /**
         * Developer tool to enhance debugging
         *
         * @see http://webpack.github.io/docs/configuration.html#devtool
         * @see https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'inline-source-map',

        /**
         * Merged metadata from webpack.common.js for index.html
         *
         * @see (custom attribute)
         */
        metadata: METADATA,


        /**
         * Options affecting the normal modules.
         *
         * @see http://webpack.github.io/docs/configuration.html#module
         */
        module: {
            /**
             * An array of automatically applied loaders.
             *
             * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
             * This means they are not resolved relative to the configuration file.
             *
             * @see http://webpack.github.io/docs/configuration.html#module-loaders
             */
            loaders: [
                /**
                 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
                 *
                 * @see https://github.com/s-panferov/awesome-typescript-loader
                 */
                {
                    exclude: [
                        /\.e2e\.ts$/i,
                    ],
                    loaders: [
                        'awesome-typescript?inlineSourceMap=true&sourceMap=false',
                        'angular2-template',
                    ],
                    test: /\.ts$/i,
                },
            ],

            /**
             * An array of applied post loaders.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders|The webpack documentation on post loaders}
             */
            postLoaders: [
                /**
                 * Instruments JS files with Istanbul for subsequent code coverage reporting.
                 * Instrument only testing sources.
                 *
                 * @see https://github.com/deepsweet/istanbul-instrumenter-loader
                 */
                {
                    exclude: [
                        /\.(spec|specs|e2e)\.(js|ts)$/i,
                        /node_modules/,
                    ],
                    include: helpers.root('src/client/app'),
                    loader: 'istanbul-instrumenter',
                    test: /\.(js|ts)$/i,
                },
            ],
        },

        /*
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * @see https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            clearImmediate: false,
            crypto: 'empty',
            global: 'window',
            module: false,
            process: true,
            setImmediate: false,
        },

        plugins: [
            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    ENV: JSON.stringify(METADATA.ENV),
                    HMR: METADATA.HMR,
                    NODE_ENV: JSON.stringify(METADATA.ENV),
                },
            }),
        ],
    });
};
