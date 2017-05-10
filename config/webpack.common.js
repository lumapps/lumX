const _ = require('lodash');
const helpers = require('./modules/helpers');

/*
 * Webpack Plugins.
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NGCWebpack = require('ngc-webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;


/*
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The webpack documentation on CLI}
 *
 * @param {Object} metadata The metadata to generate the config.
 */
module.exports = function webpackCommonConfigExport(metadata) {
    // Customize TypeScript compilation rule.
    let tsConfigFile = 'tsconfig.json';
    const tsExcludes = [
        helpers.root('dist'),
        /\.(e2e|page|spec|specs)\.ts$/i,
        helpers.root('tests'),
    ];
    const tsLoaders = [
        helpers.getLoader('ng-router', metadata.env),
        helpers.getLoader('awesome-typescript', metadata.env),
        helpers.getLoader('angular2-template', metadata.env),
    ];

    switch (metadata.env) {
        case helpers.ENVS.dev:
            tsLoaders.unshift(helpers.getLoader('@angularclass/hmr', metadata.env));
            break;

        case helpers.ENVS.prod:
            tsConfigFile = 'tsconfig.prod.json';
            break;

        case helpers.ENVS.test:
            tsExcludes.splice(1, 2);

            switch (helpers.TESTS_TYPE) {
                case helpers.TESTS_TYPES.unit:
                    tsConfigFile = 'tsconfig.unit.json';

                    tsExcludes.push(
                        /\.(e2e|page)\.ts$/i,
                        helpers.root('tests', 'client', 'e2e')
                    );
                    break;

                case helpers.TESTS_TYPES.e2e:
                    tsConfigFile = 'tsconfig.e2e.json';
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }
    _.set(tsLoaders, '[1].options.configFileName', tsConfigFile);

    // Customize TypeScript lint rule.
    let lintInclude;
    let lintTest = /\.ts$/i;
    switch (metadata.env) {
        case helpers.ENVS.dev:
            break;

        case helpers.ENVS.prod:
            break;

        case helpers.ENVS.test:
            if (helpers.TESTS_TYPE === helpers.TESTS_TYPES.unit) {
                lintInclude = helpers.root('src', 'client', 'app');
                lintTest = /\.(spec|specs)\.ts$/i;
            } else {
                lintInclude = helpers.root('tests', 'client', 'e2e');
                lintTest = /\.(e2e|page|spec|specs)\.ts$/i;
            }
            switch (helpers.TESTS_TYPE) {
                case helpers.TESTS_TYPES.unit:
                    lintInclude = helpers.root('src', 'client', 'app');
                    lintTest = /\.(spec|specs)\.ts$/i;
                    break;

                case helpers.TESTS_TYPES.e2e:
                    lintInclude = helpers.root('tests', 'client', 'e2e');
                    lintTest = /\.(e2e|page|spec|specs)\.ts$/i;
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }
    const tsLintLoader = helpers.getLoader('tslint', metadata.env);
    _.set(tsLintLoader, 'options.tsConfigFile', tsConfigFile);

    return {
        /**
         * Webpack Development Server configuration.
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client, which reacts to those events.
         *
         * @see {@link https://webpack.github.io/docs/webpack-dev-server.html|The Webpack documentation on dev server}
         */
        devServer: helpers.getDevServerConfig(metadata),

        /*
         * The entry point for the bundle.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#entry|The webpack documentation on entries}
         */
        entry: (metadata.env === helpers.ENVS.test) ? undefined : {
            main: (helpers.ENABLE_AOT) ? './src/client/main.aot.ts' : './src/client/main.ts',
            polyfills: './src/client/polyfills.ts',
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
                 * Generate and load source map for JS files.
                 * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
                 *
                 * @see {@link https://github.com/webpack/source-map-loader|Source-Map Loader}
                 */
                {
                    enforce: 'pre',
                    exclude: [
                        // These packages have problems with their sourcemaps, so ignore them.
                        helpers.root('node_modules', 'rxjs'),
                        helpers.root('node_modules', '@angular'),
                        helpers.root('node_modules', '@ngrx'),
                    ],
                    test: /\.(js|css)$/i,
                    use: [
                        helpers.getLoader('source-map', metadata.env),
                    ],
                },

                /*
                 * Lint Typescript files.
                 *
                 * @see {@link https://github.com/wbuchwalter/tslint-loader|TS-Lint Loader}
                 */
                {
                    enforce: 'pre',
                    exclude: [
                        helpers.root('compiled'),
                        helpers.root('dist'),
                        helpers.root('node_modules'),
                    ],
                    include: lintInclude,
                    test: lintTest,
                    use: [
                        tsLintLoader,
                    ],
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
                    test: /\.json$/i,
                    use: [
                        helpers.getLoader('json', metadata.env),
                    ],
                },

                /*
                 * Load assets.
                 *
                 * @see {@link https://github.com/webpack/file-loader|File Loader}
                 */
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/i,
                    use: [
                        helpers.getLoader('file', metadata.env),
                    ],
                },

                /* Load HTML files and templates.
                 *
                 * @see {@link https://github.com/webpack/html-loader|HTML Loader}
                 */
                {
                    exclude: [
                        helpers.root('src', 'client', 'index.html'),
                    ],
                    test: /\.html$/i,
                    use: [
                        helpers.getLoader('html', metadata.env),
                    ],
                },

                /*
                 * Load CSS after having resolved URL and post-processed them through PostCSS.
                 *
                 * @see {@link https://www.npmjs.com/package/to-string-loader|To-String Loader}
                 * @see {@link https://github.com/webpack/css-loader|CSS Loader}
                 * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                 * @see {@link https://www.npmjs.com/package/resolve-url-loader|Resolve-URL Loader}
                 */
                {
                    exclude: [
                        helpers.root('src', 'client', 'index.html'),
                        helpers.root('src', 'client', 'app', 'core', 'styles'),
                    ],
                    test: /\.css$/i,
                    use: [
                        helpers.getLoader('to-string', metadata.env),
                        helpers.getLoader('css', metadata.env),
                        helpers.getLoader('postcss', metadata.env),
                        helpers.getLoader('resolve-url', metadata.env),
                    ],
                },

                /*
                 * Load CSS after having resolved URL and post-processed them through PostCSS.
                 *
                 * @see {@link https://www.npmjs.com/package/to-string-loader|To-String Loader}
                 * @see {@link https://github.com/webpack/css-loader|CSS Loader}
                 * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                 * @see {@link https://www.npmjs.com/package/resolve-url-loader|Resolve-URL Loader}
                 */
                {
                    include: helpers.root('src', 'client', 'app', 'core', 'styles'),
                    test: /\.css$/i,
                    use: [
                        helpers.getLoader('style', metadata.env),
                        helpers.getLoader('css', metadata.env),
                        helpers.getLoader('postcss', metadata.env),
                        helpers.getLoader('resolve-url', metadata.env),
                    ],
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
                    test: /\.scss$/i,
                    use: [
                        helpers.getLoader('raw', metadata.env),
                        helpers.getLoader('postcss', metadata.env),
                        helpers.getLoader('resolve-url', metadata.env),
                        helpers.getLoader('sass', metadata.env),
                    ],
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
                    test: /\.scss$/i,
                    use: [
                        helpers.getLoader('style', metadata.env),
                        helpers.getLoader('css', metadata.env),
                        helpers.getLoader('postcss', metadata.env),
                        helpers.getLoader('resolve-url', metadata.env),
                        helpers.getLoader('sass', metadata.env),
                    ],
                },

                /*
                 * Compile and load Typescript files.
                 * Also, generate the right lazy loaded route configuration.
                 * Finally, inline external templates and styles in components.
                 *
                 * @see {@link https://github.com/AngularClass/angular2-hmr-loader|Angular2 HMR Loader}
                 * @see {@link https://github.com/s-panferov/awesome-typescript-loader|Awesome Typescript Loader}
                 * @see {@link https://www.npmjs.com/package/ng-router-loader|NG Router Loader}
                 * @see {@link https://github.com/TheLarkInn/angular2-template-loader|Angular2 Template Loader}
                 */
                {
                    exclude: tsExcludes,
                    test: /\.ts$/i,
                    use: tsLoaders,
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
         * Configure the output.
         */
        output: {
            /**
             * The output directory as absolute path (required).
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-path|The Webpack documentation on output path}
             */
            path: helpers.root('dist', 'client'),

            /**
             * Make the file path relative to the root.
             */
            publicPath: '/',
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: [
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
                // The (\\|\/) piece accounts for path separators in *nix and Windows.
                /angular(\\|\/)core(\\|\/)@angular/i,
                helpers.root('src', 'client'),
                /* eslint-disable object-curly-newline */
                {
                    // Your Angular Async Route paths relative to this root directory.
                }
                /* eslint-enable object-curly-newline */
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
                    from: 'src/client/meta',
                },
            ], {
                ignore: [
                    '*.scss',
                ],
            }),

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

            // eslint-disable-next-line lumapps/comments-sentences
            /*
             * Plugin: HtmlHeadConfigPlugin.
             * Description: Generate html tags based on javascript maps.
             *
             * If a publicPath is set in the webpack output configuration, it will be automatically added to href
             * attributes, you can disable that by adding a "=href": false property.
             * You can also enable it to other attribute by settings "=attName": true.
             *
             * The configuration supplied is map between a location (key) and an element definition object (value).
             * The location (key) is then exported to the template under then htmlElements property in webpack config.
             *
             * Example:
             *     // Adding this plugin configuration.
             *     new HtmlElementsPlugin({
             *         headTags: { ... },
             *     });
             *
             *  Means we can use it in the template like this:
             *      "<%= webpackConfig.htmlElements.headTags %>"
             *
             * @dependencies: HtmlWebpackPlugin
             */
            new HtmlElementsPlugin({
                headTags: require('../src/client/head-config.common'),
            }),

            /*
             * Plugin: HtmlWebpackPlugin.
             * Description: Simplifies creation of HTML files to serve your webpack bundles and configure html tags based on
             * javascript maps.
             * This is especially useful for webpack bundles that include a hash in the filename which changes every
             * compilation.
             *
             * @see {@link https://github.com/ampedandwired/html-webpack-plugin|HTML Webpack Plugin}
             */
            new HtmlWebpackPlugin({
                chunksSortMode: 'dependency',
                inject: 'head',
                metadata: metadata,
                template: 'src/client/index.html',
                title: 'LumBoilerplate',
            }),

            new NGCWebpack.NgcWebpackPlugin({
                disabled: !helpers.ENABLE_AOT,
                resourceOverride: helpers.root('config', 'modules', 'resource-override.js'),
                tsConfig: helpers.root('tsconfig.prod.json'),
            }),

            // Fix Angular.
            new NormalModuleReplacementPlugin(
              /facade(\\|\/)async/,
              helpers.root('node_modules', '@angular', 'core', 'src', 'facade', 'async.js')
            ),
            new NormalModuleReplacementPlugin(
              /facade(\\|\/)collection/,
              helpers.root('node_modules', '@angular', 'core', 'src', 'facade', 'collection.js')
            ),
            new NormalModuleReplacementPlugin(
              /facade(\\|\/)errors/,
              helpers.root('node_modules', '@angular', 'core', 'src', 'facade', 'errors.js')
            ),
            new NormalModuleReplacementPlugin(
              /facade(\\|\/)lang/,
              helpers.root('node_modules', '@angular', 'core', 'src', 'facade', 'lang.js')
            ),
            new NormalModuleReplacementPlugin(
              /facade(\\|\/)math/,
              helpers.root('node_modules', '@angular', 'core', 'src', 'facade', 'math.js')
            ),

            /*
             * Plugin: TsConfigPathsPlugin.
             * Description: Add the support of 'tsconfig.json' 'path' property.
             *
             * @see {@link https://github.com/s-panferov/awesome-typescript-loader|Awesome Typescript Loader}
             */
            new TsConfigPathsPlugin({
                configFileName: tsConfigFile,
            }),
        ],

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
                helpers.root('node_modules'),
            ],
        },

        stats: helpers.COMMON_DEBUG_INFO,
    };
};
