const commonConfig = require('./webpack.common.build.js'); // The settings that are common to prod and dev
const cssNano = require('cssnano');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge'); // Used to merge webpack configs
const webpackValidator = require('webpack-validator')

/**
 * Webpack Plugins
 */
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8088;
const METADATA = webpackMerge(commonConfig.metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: false,
});

module.exports = webpackValidator(webpackMerge(commonConfig, {
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
    devtool: 'source-map',

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
        filename: '[name].[chunkhash].bundle.js',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
         */
        sourceMapFilename: '[name].[chunkhash].bundle.map',

        /**
         * The filename of non-entry chunks as relative path
         * inside the output.path directory.
         *
         * @see http://webpack.github.io/docs/configuration.html#output-chunkfilename
         */
        chunkFilename: '[id].[chunkhash].chunk.js',
    },

    /**
     * Add additional plugins to the compiler.
     *
     * @see http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
        /**
         * Plugin: WebpackMd5Hash
         * Description: Plugin to replace a standard webpack chunkhash with md5.
         *
         * @see https://www.npmjs.com/package/webpack-md5-hash
         */
        new WebpackMd5Hash(),

        /**
         * Plugin: DedupePlugin
         * Description: Prevents the inclusion of duplicate code into your bundle
         * and instead applies a copy of the function at runtime.
         *
         * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
         * @see https://github.com/webpack/docs/wiki/optimization#deduplication
         */
        new DedupePlugin(),

        /**
         * Plugin: DefinePlugin
         * Description: Define free variables.
         * Useful for having development builds with debug logging or adding global constants.
         *
         * Environment helpers
         *
         * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
         */
        // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
        new DefinePlugin({
            'ENV': JSON.stringify(METADATA.ENV),
            'HMR': METADATA.HMR,
            'process.env': {
                'ENV': JSON.stringify(METADATA.ENV),
                'NODE_ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
            },
        }),

        /**
         * Plugin: UglifyJsPlugin
         * Description: Minimize all JavaScript output of chunks.
         * Loaders are switched into minimizing mode.
         *
         * @see https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
         */
        // NOTE: To debug prod builds uncomment lines after "Debug production configuration" and comment lines after
        // "Plain production configuration"
        new UglifyJsPlugin({
            // Debug production configuration
            // beautify: true,
            // mangle: false,
            // dead_code: false,
            // unused: false,
            // deadCode: false,
            // compress: {
            //   screw_ie8: true,
            //   keep_fnames: true,
            //   drop_debugger: false,
            //   dead_code: false,
            //   unused: false
            // },
            // comments: true,

            // Plain production configuration
            beautify: false,
            mangle: {
                screw_ie8: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),

        /**
         * Plugin: NormalModuleReplacementPlugin
         * Description: Replace resources that matches resourceRegExp with newResource
         *
         * @see http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
         */

        new NormalModuleReplacementPlugin(
            /angular2-hmr/,
            helpers.root('config/modules/angular2-hmr-prod.js')
        ),

        /**
         * Plugin: IgnorePlugin
         * Description: Don’t generate modules for requests matching the provided RegExp.
         *
         * @see http://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
         */
        // new IgnorePlugin(/angular2-hmr/),

        /**
         * Plugin: CompressionPlugin
         * Description: Prepares compressed versions of assets to serve
         * them with Content-Encoding
         *
         * @see https://github.com/webpack/compression-webpack-plugin
         */
        // install compression-webpack-plugin
        // new CompressionPlugin({
        //   regExp: /\.css$|\.html$|\.js$|\.map$/,
        //   threshold: 2 * 1024
        // }),
    ],

    /**
     * Html loader advanced options
     *
     * @see https://github.com/webpack/html-loader#advanced-options
     */
    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [
            [/#/, /(?:)/, ],
            [/\*/, /(?:)/, ],
            [/\[?\(?/, /(?:)/, ],
        ],
        customAttrAssign: [
            /\)?\]?=/,
        ],
    },

    /*
     * Configure PostCSS
     *
     * @see https://github.com/postcss/autoprefixer#webpack
     */
    postcss: [
        cssNano(),
    ],

    /**
     * Static analysis linter for TypeScript advanced options configuration
     * Description: An extensible linter for the TypeScript language.
     *
     * @see https://github.com/wbuchwalter/tslint-loader
     */
    tslint: {
        failOnHint: true,
    },

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * @see https://webpack.github.io/docs/configuration.html#node
     */
    node: {
        crypto: 'empty',
        clearImmediate: false,
        global: 'window',
        module: false,
        process: false,
        setImmediate: false,
    },
}), commonConfig.validatorsOptions);
