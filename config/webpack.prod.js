const commonConfig = require('./webpack.common.build.js');
const cssNano = require('cssnano');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.prod;
const METADATA = helpers.getMetadata(ENV);

const ENABLE_AOT = false;
const ENABLE_DEBUG = false;


/**
 * Webpack configuration
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 */
module.exports = function webpackProdConfigExport() {
    return webpackMerge.smart(commonConfig(METADATA), {
        /**
         * Developer tool to enhance debugging.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#devtool|The Webpack documentation on devTool}
         * @see {@link https://github.com/webpack/docs/wiki/build-performance#sourcemaps|The Webpack documentation on sourcemap}
         */
        devtool: 'source-map',

        /*
         * Options affecting the normal modules.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#module|The Webpack documentation on modules}
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
                 * Compile and load Typescript files.
                 * Also, generate the right lazy loaded route configuration
                 * Finally, inline external templates and styles in components
                 *
                 * @see {@link https://github.com/s-panferov/awesome-typescript-loader|Awesome Typescript Loader}
                 * @see {@link https://www.npmjs.com/package/angular2-router-loader|Angular2 Router Loader}
                 * @see {@link https://github.com/TheLarkInn/angular2-template-loader|Angular2 Template Loader}
                 */
                {
                    exclude: [
                        /\.(spec|specs|e2e)\.ts$/i,
                        helpers.root('tests'),
                        helpers.root('dist'),
                    ],
                    loaders: [
                        'awesome-typescript-loader',
                        'angular2-router-loader?aot=' + ENABLE_AOT,
                        'angular2-template-loader',
                    ],
                    test: /\.ts$/i,
                },
            ],
        },

        /**
         * Options affecting the output of the compilation.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#output|The Webpack documentation on output}
         */
        output: {
            /** The filename of non-entry chunks as relative path.
             * inside the output.path directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-chunkfilename|The Webpack documentation on chunk file name}
             */
            chunkFilename: '[id].[chunkhash].chunk.js',

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-filename|The Webpack documentation on output file name}
             */
            filename: '[name].[chunkhash].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-sourcemapfilename|The Webpack documentation on sourcemap file name}
             */
            sourceMapFilename: '[name].[chunkhash].bundle.map',
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: [
            /**
             * Plugin: WebpackMd5Hash.
             * Description: Plugin to replace a standard webpack chunkhash with md5.
             *
             * @see {@link https://www.npmjs.com/package/webpack-md5-hash|Webpack MD5 Hash Plugin}
             */
            new WebpackMd5Hash(),

            /**
             * Plugin: HtmlWebpackPlugin.
             * Description: Configure html tags based on javascript maps.
             *
             * @see {@link https://github.com/ampedandwired/html-webpack-plugin|HTML Webpack Plugin}
             */
            helpers.getHtmlWebpackPlugin(METADATA),

            /**
             * Plugin LoaderOptionsPlugin.
             * Description: Configure Webpack loaders and context.
             *
             * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
             */
            new LoaderOptionsPlugin(helpers.getOptions({
                debug: ENABLE_DEBUG,
                minimize: !ENABLE_DEBUG,

                options: {
                    /*
                     * Configure the HTML Loader
                     *
                     * @see {@link @see https://github.com/webpack/html-loader|HTML Loader}
                     */
                    htmlLoader: {
                        minimize: true,
                    },

                    /*
                     * Configure the Post-CSS Loader
                     *
                     * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
                     * @see {@link https://github.com/ben-eb/cssnano|CSS-Nano for Post-CSS}
                     */
                    postcss: [
                        cssNano(),
                    ],

                    /**
                     * Static analysis linter for TypeScript advanced options configuration.
                     * An extensible linter for the TypeScript language.
                     *
                     * @see {@link https://github.com/wbuchwalter/tslint-loader|TSLint Loader}
                     */
                    tslint: {
                        failOnHint: true,
                    },
                },
            })),

            /**
             * Plugin: NormalModuleReplacementPlugin.
             * Description: Replace resources that matches resourceRegExp with newResource.
             *
             * @see {@link http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin|Normal Modul Replacement Plugin}
             */
            new NormalModuleReplacementPlugin(
                /angular2-hmr/i,
                helpers.root('config', 'modules', 'angular2-hmr-prod.js')
            ),

            /**
             * Plugin: UglifyJsPlugin.
             * Description: Minimize all JavaScript output of chunks.
             *
             * @see {@link https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin|Uglify Plugin}
             * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
             */
            // NOTE: To debug prod builds uncomment lines after "Debug production configuration" and comment lines after
            // "Plain production configuration"
            new UglifyJsPlugin({
                // Debug production configuration
                // beautify: true,
                // comments: true,
                // compress: false,
                // mangle: false,

                // Plain production configuration
                beautify: false,
                comments: false,
                /* eslint-disable camelcase */
                compress: {
                    screw_ie8: true,
                    warnings: false,
                },
                mangle: {
                    keep_fnames: true,
                    screw_ie8: true,
                },
                /* eslint-enable camelcase */
            }),
        ],
    });
};
