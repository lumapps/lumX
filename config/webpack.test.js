const commonConfig = require('./webpack.common.js'); // The settings that are common to prod and dev
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge'); // Rsed to merge webpack configs
const webpackValidator = require('webpack-validator')

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
const METADATA = webpackMerge(commonConfig.metadata, {
    host: 'localhost',
    port: 8880,
    ENV: ENV,
    HMR: HMR,
});

/**
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackValidator(webpackMerge.smart(commonConfig, {
    /**
     * Merged metadata from webpack.common.js for index.html
     *
     * @see (custom attribute)
     */
    metadata: METADATA,

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
     * Options affecting the output of the compilation.
     *
     * @see http://webpack.github.io/docs/configuration.html#output
     */
    output: {
        /**
         * The output directory as absolute path (required).
         *
         * @see http://webpack.github.io/docs/configuration.html#output-path
         */
        path: helpers.root('src/client/dist'),

        /**
         * Specifies the name of each output file on disk.
         * IMPORTANT: You must not specify an absolute path here!
         *
         * @see http://webpack.github.io/docs/configuration.html#output-filename
         */
        filename: '[name].bundle.js',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
         */
        sourceMapFilename: '[name].map',

        /** The filename of non-entry chunks as relative path
         * inside the output.path directory.
         *
         * @see http://webpack.github.io/docs/configuration.html#output-chunkfilename
         */
        chunkFilename: '[id].chunk.js',
    },


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
                test: /\.ts$/,
                loader: 'awesome-typescript',
                query: {
                    compilerOptions: {
                        // Remove TypeScript helpers to be injected
                        // below by DefinePlugin
                        removeComments: true,
                    },

                    sourceMap: false,
                    inlineSourceMap: true,
                },
                exclude: [
                    /\.e2e\.ts$/,
                    helpers.root('tests'),
                    helpers.root('dist'),
                ],
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
                test: /\.(js|ts)$/,
                loader: 'istanbul-instrumenter',
                include: helpers.root('src/client/app'),
                exclude: [
                    /\.(spec|specs|e2e)\.(js|ts)$/,
                    helpers.root('tests'),
                    helpers.root('dist'),
                ],
            },
        ],
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
                'ENV': JSON.stringify(METADATA.ENV),
                'NODE_ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
            },
        }),
    ],

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
}), commonConfig.validatorsOptions);
