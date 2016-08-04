const commonConfig = require('./webpack.common.build.js'); // The settings that are common to prod and dev
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge'); // Rsed to merge webpack configs
const webpackValidator = require('webpack-validator')

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const JasmineWebpackPlugin = require('jasmine-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig.metadata, {
    host: 'localhost',
    port: 8880,
    ENV: ENV,
    HMR: HMR,
});

const APPENGINE_DEV_SERVER = {
    host: 'localhost',
    port: 8888,
};

/**
 * Plugin: DefinePlugin
 * Description: Define free variables.
 * Useful for having development builds with debug logging or adding global constants.
 *
 * /!\ WARNING: when adding more properties, make sure you include them in custom-typings.d.ts
 *
 * Environment helpers
 *
 * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
 */
let plugins = [
    new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
            'ENV': JSON.stringify(METADATA.ENV),
            'NODE_ENV': JSON.stringify(METADATA.ENV),
            'HMR': METADATA.HMR,
        },
    }),

    new JasmineWebpackPlugin(),
];
if (HMR) {
    plugins.push(
        new OpenBrowserPlugin({
            url: 'http://' + METADATA.host + ':' + METADATA.port,
        }),
        new WebpackNotifierPlugin({
            title: 'Webpack compilation',
            excludeWarnings: false,
            alwaysNotify: true,
        })
    );
}

/**
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackValidator(webpackMerge(commonConfig, {
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
    debug: true,

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
        path: helpers.root('dist/client'),

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

        library: 'ac_[name]',
        libraryTarget: 'var',
    },

    plugins: plugins,

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * @see https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
        port: METADATA.port,
        host: METADATA.host,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        noInfo: true,
        info: false,
        outputPath: helpers.root('src/client/dist/'),

        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: false
        },

        proxy: {
            '/_ah/*': {
                target: 'http://' + APPENGINE_DEV_SERVER.host + ':' + APPENGINE_DEV_SERVER.port,
                changeOrigin: true,
            },
            '/services/*': {
                target: 'http://' + APPENGINE_DEV_SERVER.host + ':' + APPENGINE_DEV_SERVER.port,
                changeOrigin: true,
            },
        },
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
}), commonConfig.validatorsOptions);
