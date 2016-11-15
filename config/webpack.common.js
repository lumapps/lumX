const helpers = require('./modules/helpers');

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const SassLintPlugin = require('sasslint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

/*
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The webpack documentation on CLI}
 *
 * @param {Object} metadata The metadata to generate the config.
 */
module.exports = function webpackCommonConfigExport(metadata) {
    let plugins = [
        /**
         * Plugin: DefinePlugin.
         * Description: Define free variables. Useful for having development builds with debug logging or adding global
         *              constants.
         *
         * @see {@link https://webpack.github.io/docs/list-of-plugins.html#defineplugin|Define Plugin}
         */
        new DefinePlugin({
            'ENV': JSON.stringify(metadata.env),
            'HMR': metadata.HMR,
            'process.env': {
                ENV: JSON.stringify(metadata.env),
                HMR: metadata.HMR,
                NODE_ENV: JSON.stringify(metadata.env),
            },
        }),

        /*
         * Plugin: HtmlHeadConfigPlugin.
         * Description: Generate html tags based on javascript maps.
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
         *      headTags: { ... }
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
         * Plugin: HtmlWebpackPlugin.
         * Description: Configure html tags based on javascript maps.
         *
         * @see {@link https://github.com/ampedandwired/html-webpack-plugin|HTML Webpack Plugin}
         */
        helpers.getHtmlWebpackPlugin(metadata),

        /**
         * Plugin LoaderOptionsPlugin.
         * Description: Configure Webpack loaders and context.
         *
         * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
         */
        new LoaderOptionsPlugin(helpers.getOptions()),
    ];

    if (metadata.env !== helpers.ENVS.test) {
        plugins.push(
            /*
             * Plugin: AssetsPlugin.
             * Description: Emits a JSON file with assets paths.
             *
             * @see {@link https://github.com/kossnocorp/assets-webpack-plugin|Assets Webpack Plugin}
             */
            new AssetsPlugin({
                filename: 'webpack-assets.json',
                path: helpers.root('dist', 'client'),
                prettyPrint: true,
            }),

            /**
             * Plugin: ContextReplacementPlugin.
             * Description: Provides context to Angular's use of System.import.
             *
             * @see {@link https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin|Context Replacement Plugin}
             * @see {@link https://github.com/angular/angular/issues/11580|Why using this?}
             */
            new ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/i,
                helpers.root('src', 'client')
            ),

            /*
             * Plugin: CopyWebpackPlugin.
             * Description: Copy files and directories in webpack.
             *
             * @see {@link https://www.npmjs.com/package/copy-webpack-plugin|Copy Webpack Plugin}
             */
            new CopyWebpackPlugin([
                {
                    from: 'src/client/assets',
                    to: 'assets',
                }, {
                    from: 'src/client/app/demo/images',
                    to: 'assets',
                }, {
                    from: 'src/client/meta',
                },
            ], {
                ignore: [
                    '*.scss',
                ],
            }),

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
                // NOTE: we need to use the ignoreFiles array here and have the same files as in the .sass-lint.yml
                // because the plugin doesn't parse the config file for ignored files... *lame*
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

            /*
             * Plugin: TsConfigPathsPlugin.
             * Description: Add the support of 'tsconfig.json' 'path' property.
             *
             * @see {@link https://github.com/s-panferov/awesome-typescript-loader|Awesome Typescript Loader}
             */
            new TsConfigPathsPlugin()
        );
    }

    return {
        /*
         * The entry point for the bundle.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#entry|The webpack documentation on entries}
         */
        entry: (metadata.env === helpers.ENVS.test) ? {} : {
            main: './src/client/main.ts',
            polyfills: './src/client/polyfills.ts',
            vendors: './src/client/vendors.ts',
        },

        /*
         * Options affecting the normal modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#module|The webpack documentation on modules}
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
                 * Lint Typescript files.
                 *
                 * @see {@link https://github.com/wbuchwalter/tslint-loader|TS-Lint Loader}
                 */
                {
                    enforce: 'pre',
                    exclude: [
                        helpers.root('node_modules'),
                    ],
                    loader: 'tslint-loader',
                    test: /\.ts$/i,
                },

                /*
                 * Generate and load source map for JS files.
                 * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
                 *
                 * @see {@link https://github.com/webpack/source-map-loader|Source-Map Loader}
                 */
                {
                    enforce: 'pre',
                    exclude: [
                        // These packages have problems with their sourcemaps, so ignore them
                        helpers.root('node_modules', 'rxjs'),
                        helpers.root('node_modules', '@angular'),
                        helpers.root('node_modules', '@ngrx'),
                    ],
                    loader: 'source-map-loader',
                    test: /\.(js|css)$/i,
                },


                /*
                 * Load JSON files.
                 *
                 * @see {@link https://github.com/webpack/json-loader|JSON Loader}
                 */
                {
                    exclude: [
                        helpers.root('src', 'client', 'index.html'),
                    ],
                    loader: 'json-loader',
                    test: /\.json$/i,
                },

                /*
                 * Load assets.
                 *
                 * @see {@link https://github.com/webpack/file-loader|File Loader}
                 */
                {
                    loader: 'file-loader?name=assets/[name].[hash].[ext]',
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/i,
                },

                /*
                 * Load CSS after having resolved URL and post-processed them through PostCSS
                 *
                 * @see {@link https://www.npmjs.com/package/to-string-loader|To-String Loader}
                 * @see {@link https://github.com/webpack/css-loader|CSS Loader}
                 * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                 * @see {@link https://www.npmjs.com/package/resolve-url-loader|Resolve-URL Loader}
                 */
                {
                    exclude: [
                        helpers.root('src', 'client', 'index.html'),
                    ],
                    loaders: [
                        'to-string-loader',
                        'css-loader?sourceMap',
                        'postcss-loader',
                        'resolve-url-loader',
                    ],
                    test: /\.css$/i,
                },

                /*
                 * Load components SCSS after having compile them to CSS, resolve their URL and post-processed them
                 * through PostCSS.
                 *
                 * @see {@link https://github.com/webpack/raw-loader|Raw Loader}
                 * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                 * @see {@link https://www.npmjs.com/package/resolve-url-loader|Resolve-URL Loader}
                 * @see {@link https://github.com/jtangelder/sass-loader|SASS Loader}
                 */
                {
                    exclude: helpers.root('src', 'client', 'app', 'core', 'styles'),
                    include: helpers.root('src', 'client'),
                    loaders: [
                        'raw-loader',
                        'postcss-loader',
                        'resolve-url-loader',
                        'sass-loader?sourceMap',
                    ],
                    test: /\.scss$/i,
                },

                /*
                 * Load global app SCSS after having compile them to CSS, resolve their URL and post-processed them
                 * through PostCSS.
                 *
                 * @see {@link https://github.com/webpack/style-loader|Style Loader}
                 * @see {@link https://github.com/webpack/css-loader|CSS Loader}
                 * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                 * @see {@link https://www.npmjs.com/package/resolve-url-loader|Resolve-URL Loader}
                 * @see {@link https://github.com/jtangelder/sass-loader|SASS Loader}
                 */
                {
                    include: helpers.root('src', 'client', 'app', 'core', 'styles'),
                    loaders: [
                        'style-loader',
                        'css-loader?sourceMap',
                        'postcss-loader',
                        'resolve-url-loader',
                        'sass-loader?sourceMap',
                    ],
                    test: /\.scss$/i,
                },

                /* Load HTML files and templates.
                 *
                 * @see {@link https://github.com/webpack/html-loader|HTML Loader}
                 */
                {
                    exclude: [
                        helpers.root('src', 'client', 'index.html'),
                    ],
                    loader: 'html-loader',
                    test: /\.html$/i,
                },
            ],
        },

        /*
         * Node configuration.
         * Include polyfills or mocks for various node stuff.
         *
         * @see https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            clearImmediate: false,
            crypto: 'empty',
            global: true,
            module: false,
            process: metadata.env !== helpers.ENVS.prod,
            setImmediate: false,
        },

        /*
         * Configure the output
         */
        output: {
            /**
             * The output directory as absolute path (required).
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-path|The Webpack documentation on output path}
             */
            path: helpers.root('dist', 'client'),

            /**
             * Make the file path relative to the root
             */
            publicPath: '/',
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: plugins,

        /*
         * Options affecting the resolving of modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#resolve|The webpack documentation on resolve}
         */
        resolve: {
            /*
             * An array of extensions that should be used to resolve modules.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#resolve-extensions|The Webpack documentation on resolve extensions}
             */
            extensions: [
                '.ts',
                '.js',
                '.json',
            ],

            /*
             * An array of path in which look for import and requires.
             *
             * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
             */
            modules: [
                helpers.root(''),
                helpers.root('src', 'client'),
                helpers.root('src', 'client', 'app'),
                helpers.root('src', 'client', 'assets'),
                'node_modules',
            ],
        },
    };
};
