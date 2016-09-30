const commonConfig = require('./webpack.common.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');
const webpackValidator = require('webpack-validator');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    return webpackValidator(webpackMerge.smart(commonConfig(options), {
        /**
         * Switch loaders to debug mode.
         *
         * @see http://webpack.github.io/docs/configuration.html#debug
         */
        debug: false,

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
                        /\.e2e\.ts$/,
                        helpers.root('tests'),
                        helpers.root('dist'),
                    ],
                    loaders: [
                        'awesome-typescript?removeComments=true&inlineSourceMap=true&sourceMap=false',
                        'angular2-template',
                    ],
                    test: /\.ts$/,
                },
            ],

            /**
             * An array of applied post loaders.
             *
             * @see http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
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
                        /\.(spec|specs|e2e)\.(js|ts)$/,
                        helpers.root('tests'),
                        helpers.root('dist'),
                    ],
                    include: helpers.root('src/client/app'),
                    loader: 'istanbul-instrumenter',
                    test: /\.(js|ts)$/,
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

        /**
         * Options affecting the output of the compilation.
         *
         * @see http://webpack.github.io/docs/configuration.html#output
         */
        output: {
            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * @see http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].chunk.js',

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * @see http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].bundle.js',

            /**
             * The output directory as absolute path (required).
             *
             * @see http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root('src/client/dist'),

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].map',
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

            new ExtractTextPlugin('[name].css'),
        ],
    }),
    commonConfig(options).validatorsOptions);
};
