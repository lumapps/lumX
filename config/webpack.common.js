const autoprefixer = require('autoprefixer');
const helpers = require('./modules/helpers');
const Joi = require('webpack-validator').Joi;

/*
 * Webpack Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassLintPlugin = require('sasslint-webpack-plugin');

/*
 * Webpack Constants
 */
const METADATA = {
    title: 'LumBoilerplate',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
};

/*
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {
    /*
     * Static metadata for index.html
     *
     * @see (custom attribute)
     */
    metadata: METADATA,

    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * @see http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * @see http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
        'polyfills': './src/client/polyfills.ts',
        'vendor': './src/client/vendors.ts',
        'main': './src/client/main.ts',
    },

    /*
     * Options affecting the resolving of modules.
     *
     * @see http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
        /*
         * An array of extensions that should be used to resolve modules.
         *
         * @see http://webpack.github.io/docs/configuration.html#resolve-extensions
         */
        extensions: [
            '',
            '.ts',
            '.js',
            '.json',
        ],

        // Make sure root is src/client
        root: [
            helpers.root('src/client'),
            helpers.root('src/client/app'),
            helpers.root('src/client/assets'),
            helpers.root('src/client/assets/styles'),
        ],

        // Remove other default values
        modulesDirectories: [
            'node_modules',
        ],
    },

    /*
     * Options affecting the normal modules.
     *
     * @see http://webpack.github.io/docs/configuration.html#module
     */
    module: {
        /*
         * An array of applied pre loaders.
         *
         * @see http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
         */
        preLoaders: [
            /*
             * Tslint loader support for *.ts files
             *
             * @see https://github.com/wbuchwalter/tslint-loader
             */
            {
                test: /\.ts$/,
                loader: 'tslint',
                exclude: [
                    helpers.root('node_modules'),
                ],
            },

            /*
             * Source map loader support for *.js files
             * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
             *
             * @see https://github.com/webpack/source-map-loader
             */
            {
                test: /\.(js|css)$/,
                loader: 'source-map',
                exclude: [
                    // These packages have problems with their sourcemaps
                    helpers.root('node_modules/rxjs'),
                    helpers.root('node_modules/@angular'),
                    helpers.root('node_modules/@ngrx'),
                    helpers.root('node_modules/@angular2-material'),
                ],
            },
        ],

        /*
         * An array of automatically applied loaders.
         * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
         * This means they are not resolved relative to the configuration file.
         *
         * @see http://webpack.github.io/docs/configuration.html#module-loaders
         */
        loaders: [
            /*
             * Json loader support for *.json files.
             *
             * @see https://github.com/webpack/json-loader
             */
            {
                test: /\.json$/,
                loader: 'json',
                exclude: [
                    helpers.root('src/client/index.html'),
                ],
            },

            /* HTML loader support for *.html
             *
             * @see https://github.com/webpack/raw-loader
             */
            {
                test: /\.html$/,
                loader: 'html',
                exclude: [
                    helpers.root('src/client/index.html'),
                ],
            },

            /*
             * File loader for assets
             *
             * @see https://github.com/webpack/file-loader
             */
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },

            /*
             * Load CSS
             */
            {
                test: /\.css$/,
                // loader: ExtractTextPlugin.extract(
                //     'style',
                //     'css?sourceMap!postcss'
                // ),
                loaders: [
                    'to-string',
                    'css?sourceMap',
                    'postcss',
                    'resolve-url',
                ],
                exclude: [
                    helpers.root('src/client/index.html'),
                    /node_modules/,
                ],
            },

            /*
             * Load SCSS
             */
            {
                test: /\.scss$/,
                // loader: ExtractTextPlugin.extract(
                //     'style',
                //     'css?sourceMap!postcss!resolve-url!sass?sourceMap'
                // ),
                loaders: [
                    'to-string',
                    'css?sourceMap',
                    'postcss',
                    'resolve-url',
                    'sass?sourceMap',
                ],
                exclude: /node_modules/,
            },
        ],

        /**
         * An array of applied post loaders.
         *
         * @see http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
         */
        postLoaders: [
            /*
             * Automagically add needed polyfillers
             *
             * @see https://github.com/webpack/file-loader
             */
            {
                test: /\.js$/,
                exclude: /\/(node_modules|bower_components|config)\//,
                loader: 'autopolyfiller-webpack',
                query: {
                    browsers: ['last 2 versions', 'ie >= 9']
                }
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
         * Plugin: CopyWebpackPlugin
         * Description: Copy files and directories in webpack.
         *
         * Copies project static assets.
         *
         * @see https://www.npmjs.com/package/copy-webpack-plugin
         */
        new CopyWebpackPlugin([
            {
                from: 'src/client/assets',
                to: 'assets',
        }]),

        /*
         * Plugin: HtmlWebpackPlugin
         * Description: Simplifies creation of HTML files to serve your webpack bundles.
         * This is especially useful for webpack bundles that include a hash in the filename
         * which changes every compilation.
         *
         * @see https://github.com/ampedandwired/html-webpack-plugin
         */
        new HtmlWebpackPlugin({
            template: 'src/client/index.html',
            chunksSortMode: 'dependency',
        }),

        /*
         * Plugin: HtmlHeadConfigPlugin
         * Description: Generate html tags based on javascript maps.
         *
         * If a publicPath is set in the webpack output configuration, it will be automatically added to
         * href attributes, you can disable that by adding a "=href": false property.
         * You can also enable it to other attribute by settings "=attName": true.
         *
         * The configuration supplied is map between a location (key) and an element definition object (value)
         * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
         *
         * Example:
         *  Adding this plugin configuration
         *  new HtmlElementsPlugin({
         *    headTags: { ... }
         *  })
         *
         *  Means we can use it in the template like this:
         *  <%= webpackConfig.htmlElements.headTags %>
         *
         * Dependencies: HtmlWebpackPlugin
         */
        new HtmlElementsPlugin({
            headTags: require('../src/client/head-config.common'),
        }),

        /*
         * Plugin: ExtractTextWebpackPlugin
         * Description: Create a bundle file for inlined CSS files
         *
         * @see https://github.com/webpack/extract-text-webpack-plugin
         */
        new ExtractTextPlugin('assets/styles.[contenthash].css', {
            allChunks: true,
        }),

        /**
         * Plugin: SASSLintPlugin
         * Description: Lint the SASS files
         *
         * @see https://github.com/alleyinteractive/sasslint-webpack-plugin
         */
        new sassLintPlugin({
            failOnError: false,
            failOnWarning: false,
            glob: './src/client/**/*.s?(a|c)ss',
            ignoreFiles: [],
            quiet: false,
            testing: false,
        }),

        new TsConfigPathsPlugin(),
    ],

    /*
     * Configure HTML Loader
     *
     * @see https://github.com/webpack/html-loader
     */
    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
        customAttrAssign: [ /\)?\]?=/ ]
    },

    /*
     * Configure PostCSS
     *
     * @see https://github.com/postcss/autoprefixer#webpack
     */
    postcss: [
        autoprefixer({
            browsers: [
                'last 2 versions',
            ],
        }),
    ],

    /*
     * Configure Sass
     *
     * @see https://github.com/jtangelder/sass-loader
     */
    sassLoader: {
        includePaths: [
            'src/client/assets/styles',
        ],
        indentType: 'space',
        indentWidth: 4,
        outputStyle: 'expanded',
    },

    /**
     * Static analysis linter for TypeScript advanced options configuration
     * Description: An extensible linter for the TypeScript language.
     *
     * @see https://github.com/wbuchwalter/tslint-loader
     */
    tslint: {
        // TSLint errors are displayed by default as warnings
        // Set emitErrors to true to display them as errors
        emitErrors: true,

        // TSLint does not interrupt the compilation by default
        // If you want any file with tslint errors to fail
        // set failOnHint to true
        failOnHint: false,
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
        setImmediate: false,
    },

    validatorsOptions: {
        quiet: true,
        rules: {
            'no-root-files-node-modules-nameclash': false,
        },
        schemaExtension: Joi.object({
            htmlLoader: Joi.object(),
            postcss: Joi.any(),
            sassLoader: Joi.object(),
            tslint: Joi.object(),
            validatorsOptions: Joi.object(),
        }),
    },
};
