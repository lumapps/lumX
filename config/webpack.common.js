const autoprefixer = require('autoprefixer');
const helpers = require('./modules/helpers');
const Joi = require('webpack2-validator').Joi;

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassLintPlugin = require('sasslint-webpack-plugin');

/*
 * Webpack Constants
 */
const METADATA = {
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    title: 'LumBoilerplate',
};

/*
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The webpack documentation on CLI}
 */
module.exports = function webpackCommonConfigExport() {
    return {
        /*
         * The entry point for the bundle
         * Our Angular.js app
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#entry|The webpack documentation on entries}
         */
        entry: {
            main: './src/client/main.ts',
            polyfills: './src/client/polyfills.ts',
            vendors: './src/client/vendors.ts',
        },

        /*
         * Configure HTML Loader
         *
         * @see https://github.com/webpack/html-loader
         */
        htmlLoader: {
            caseSensitive: true,
            customAttrAssign: [
                /\)?\]?=/,
            ],
            customAttrSurround: [
                [
                    /#/,
                    /(?:)/,
                ],
                [
                    /\*/,
                    /(?:)/,
                ],
                [
                    /\[?\(?/,
                    /(?:)/,
                ],
            ],
            minimize: false,
            removeAttributeQuotes: false,
        },

        /*
         * Static metadata for index.html.
         */
        metadata: METADATA,

        /*
         * Options affecting the normal modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#module|The webpack documentation on modules}
         */
        module: {
            /*
             * An array of automatically applied loaders.
             * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
             * This means they are not resolved relative to the configuration file.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#module-loaders|The webpack documentation on module loaders}
             */
            loaders: [
                /*
                 * Json loader support for *.json files.
                 *
                 * @see {@link https://github.com/webpack/json-loader|JSON Loader}
                 */
                {
                    exclude: [
                        helpers.root('src/client/index.html'),
                    ],
                    loader: 'json',
                    test: /\.json$/i,
                },

                /*
                 * File loader for assets.
                 *
                 * @see {@link https://github.com/webpack/file-loader|File loader}
                 */
                {
                    loader: 'file?name=assets/[name].[hash].[ext]',
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/i,
                },

                /*
                 * Load CSS.
                 */
                {
                    exclude: [
                        helpers.root('src/client/index.html'),
                        /node_modules/i,
                    ],
                    loaders: [
                        'to-string',
                        'css?sourceMap',
                        'postcss',
                        'resolve-url',
                    ],
                    test: /\.css$/i,
                },

                /*
                 * Load SCSS.
                 */
                {
                    include: helpers.root('src', 'client'),
                    loaders: [
                        'style',
                        'css?sourceMap',
                        'postcss',
                        'resolve-url',
                        'sass?sourceMap',
                    ],
                    test: /\.scss$/i,
                },

                /* HTML loader support for *.html
                 *
                 * @see https://github.com/webpack/html-loader
                 */
                {
                    exclude: [
                        helpers.root('src/client/index.html'),
                    ],
                    loader: 'html',
                    test: /\.html$/i,
                },
            ],

            /**
             * An array of applied post loaders.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders|The webpack documentation on post loaders}
             */
            postLoaders: [
                /*
                 * Automagically add needed polyfillers
                 *
                 * @see https://github.com/webpack/file-loader
                 */
                {
                    exclude: /\/(node_modules|bower_components|config)\//i,
                    loader: 'autopolyfiller-webpack',
                    query: {
                        browsers: ['last 2 versions', 'ie >= 9'],
                    },
                    test: /\.js$/i,
                },

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

            /*
             * An array of applied pre loaders.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders|The webpack documentation on pre loaders}
             */
            preLoaders: [
                /*
                 * Replace any reference to System JS
                 */
                {
                    include: [
                        helpers.root('src/client'),
                    ],
                    loader: 'string-replace',
                    query: {
                        flags: 'g',
                        replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
                        search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
                    },
                    test: /\.ts$/i,
                },

                /*
                 * Tslint loader support for *.ts files.
                 *
                 * @see {@link https://github.com/wbuchwalter/tslint-loader|TSLint Loader}
                 */
                {
                    exclude: [
                        helpers.root('node_modules'),
                    ],
                    loader: 'tslint',
                    test: /\.ts$/i,
                },

                /*
                 * Source map loader support for *.js files.
                 * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
                 *
                 * @see {@link https://github.com/webpack/source-map-loader|SourceMap Loader}
                 */
                {
                    exclude: [
                        // These packages have problems with their sourcemaps.
                        helpers.root('node_modules/rxjs'),
                        helpers.root('node_modules/@angular'),
                        helpers.root('node_modules/@ngrx'),
                        helpers.root('node_modules/@angular2-material'),
                    ],
                    loader: 'source-map',
                    test: /\.(js|css)$/i,
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
             * AssetsPlugin.
             */
            new AssetsPlugin({
                filename: 'webpack-assets.json',
                path: helpers.root('dist/client'),
                prettyPrint: true,
            }),

            /**
             * Plugin: ContextReplacementPlugin
             * Description: Provides context to Angular's use of System.import
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
             * See: https://github.com/angular/angular/issues/11580
             */
            new ContextReplacementPlugin(
                    // The (\\|\/) piece accounts for path separators in *nix and Windows
                    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/i,
                    helpers.root('src/client') // location of your src
                ),

            /*
             * CopyWebpackPlugin.
             * Copy files and directories in webpack.
             *
             * Copies project static assets.
             *
             * @see {@link https://www.npmjs.com/package/copy-webpack-plugin|Copy Webpack Plugin}
             */
            new CopyWebpackPlugin([{
                from: 'src/client/assets',
                to: 'assets',
            }], {
                ignore: [
                    '*.scss',
                    '*_specRunner*',
                ],
            }),

            /*
             * HtmlWebpackPlugin.
             * Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename which changes every
             * compilation.
             *
             * @see {@link https://github.com/ampedandwired/html-webpack-plugin|HTML Webpack Plugin}
             */
            new HtmlWebpackPlugin({
                chunksSortMode: 'dependency',
                template: 'src/client/index.html',
            }),

            /*
             * HtmlHeadConfigPlugin.
             * Generate html tags based on javascript maps.
             *
             * If a publicPath is set in the webpack output configuration, it will be automatically added to href
             * attributes, you can disable that by adding a "=href": false property.
             * You can also enable it to other attribute by settings "=attName": true.
             *
             * The configuration supplied is map between a location (key) and an element definition object (value).
             * The location (key) is then exported to the template under then htmlElements property in webpack
             * configuration.
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
             * @dependencies: HtmlWebpackPlugin
             */
            new HtmlElementsPlugin({
                headTags: require('../src/client/head-config.common'),
            }),

            /**
             * SASSLintPlugin.
             * Lint the SASS files.
             *
             * @see {@link https://github.com/alleyinteractive/sasslint-webpack-plugin|SASS Lint Webpack Plugin}
             */
            new sassLintPlugin({ // eslint-disable-line
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
         * Configure PostCSS.
         *
         * @see {@link https://github.com/postcss/autoprefixer#webpack|PostCSS}
         */
        postcss: [
            autoprefixer({
                browsers: [
                    'last 2 versions',
                ],
            }),
        ],

        /*
         * Cache generated modules and chunks to improve performance for multiple incremental builds.
         * This is enabled by default in watch mode.
         * You can pass false to disable it.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#cache|The webpack documentation on cache}
         */
        // cache: false,

        /*
         * Options affecting the resolving of modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#resolve|The webpack documentation on resolve}
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

            modules: [
                helpers.root(''),
                helpers.root('src/client'),
                helpers.root('src/client/app'),
                helpers.root('src/client/assets'),
                helpers.root('src/client/assets/styles'),
                'node_modules',
            ],
        },

        /*
         * Configure Sass.
         *
         * @see {@link https://github.com/jtangelder/sass-loader|SASS Loader}
         */
        sassLoader: {
            includePaths: [
                'src/client/assets/styles',
            ],
            indentType: 'space',
            indentWidth: 4,
            outputStyle: 'expanded',
        },

        target: 'web',

        /**
         * Static analysis linter for TypeScript advanced options configuration.
         * An extensible linter for the TypeScript language.
         *
         * @see {@link https://github.com/wbuchwalter/tslint-loader|TSLint Loader}
         */
        tslint: {
            // TSLint errors are displayed by default as warnings.
            // Set emitErrors to true to display them as errors.
            emitErrors: true,

            // TSLint does not interrupt the compilation by default.
            // If you want any file with tslint errors to fail set failOnHint to true.
            failOnHint: false,
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
};
