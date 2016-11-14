const commonConfig = require('./webpack.common.build');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins
 */
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.dev;
const METADATA = helpers.getMetadata(ENV);
const ENABLE_DEBUG = false;

/**
 * Other constants
 */
const ENABLE_DASHBOARD = false;

let plugins = [
    /**
     * Plugin: LoaderOptionsPlugin.
     * Description: Configure Webpack loaders and context.
     *
     * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
     */
    new LoaderOptionsPlugin(helpers.getOptions({
        debug: ENABLE_DEBUG,
        minimize: false,
    })),

    /**
     * Plugin: NamedModulesPlugin (experimental).
     * Description: Uses file names as module name.
     *
     * @see {@link https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb|Named Modules Plugin}
     */
    new NamedModulesPlugin(),

    /**
     * Plugin: WebpackBrowserPlugin.
     * Description: Open the default browser on successful compilation.
     *
     * @see {@link https://www.npmjs.com/package/webpack-browser-plugin|Webpack Browser Plugin}
     */
    new WebpackBrowserPlugin({
        port: METADATA.port,
        url: 'http://' + METADATA.host,
    }),

    /**
     * Plugin: WebpackNotifierPlugin.
     * Description: Send a notification when compilation ended (successfully or with error).
     *
     * @see {@link https://www.npmjs.com/package/webpack-notifier|Webpack Notifier Plugin}
     */
    new WebpackNotifierPlugin({
        alwaysNotify: true,
        excludeWarnings: false,
        title: 'Webpack compilation',
    }),
];

let devServerConfig = helpers.getDevServerConfig(METADATA);

if (METADATA.HMR) {
    if (ENABLE_DASHBOARD) {
        const dashboard = new Dashboard();

        plugins.unshift(
            /**
             * Plugin: DashboardPlugin.
             * Description: View progress. 'It's like to work at NASA.'
             *
             * @see {@link https://github.com/FormidableLabs/webpack-dashboard|Dashboard Plugin}
             */
            new DashboardPlugin(dashboard.setData)
        );
    }

    devServerConfig.hot = true;
    devServerConfig.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
    };
}


/**
 * Webpack configuration
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 */
module.exports = function webpackDevConfigExport() {
    return webpackMerge.smart(commonConfig(METADATA), {
        /**
         * Webpack Development Server configuration.
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client, which reacts to those events.
         *
         * @see {@link https://webpack.github.io/docs/webpack-dev-server.html|The Webpack documentation on dev server}
         */
        devServer: devServerConfig,

        /**
         * Developer tool to enhance debugging.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#devtool|The Webpack documentation on devTool}
         * @see {@link https://github.com/webpack/docs/wiki/build-performance#sourcemaps|The Webpack documentation on sourcemap}
         */
        devtool: 'inline-source-map',

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
                 * @see {@link https://github.com/AngularClass/angular2-hmr-loader|Angular2 HMR Loader}
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
                        '@angularclass/hmr-loader?pretty=true&prod=false',
                        'awesome-typescript-loader',
                        'angular2-router-loader?aot=false',
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
            chunkFilename: '[id].chunk.js',

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-filename|The Webpack documentation on output file name}
             */
            filename: '[name].bundle.js',

            library: 'ac_[name]',
            libraryTarget: 'var',

            /**
             * The output directory as absolute path (required).
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-path|The Webpack documentation on output path}
             */
            path: helpers.root('dist', 'client'),

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-sourcemapfilename|The Webpack documentation on sourcemap file name}
             */
            sourceMapFilename: '[name].map',
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: plugins,
    });
};
