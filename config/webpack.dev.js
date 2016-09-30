const commonConfig = require('./webpack.common.build.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');
const webpackValidator = require('webpack-validator');

/**
 * Webpack Plugins
 */
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const JasmineWebpackPlugin = require('jasmine-webpack-plugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge.smart(commonConfig({ env: ENV }).metadata, {
    ENV: ENV,
    HMR: HMR,
    host: 'localhost',
    port: 8880,
});

/**
 * Other constants
 */
const ENABLE_DASHBOARD = false;
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
    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
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

    new JasmineWebpackPlugin(),

    /**
     * Plugin: NamedModulesPlugin (experimental)
     * Description: Uses file names as module name.
     *
     * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
     */
    new NamedModulesPlugin(),
];

let devServerConfig = {
    historyApiFallback: true,
    host: METADATA.host,
    outputPath: helpers.root('dist/client/'),
    port: METADATA.port,

    proxy: {
        '/_ah/*': {
            changeOrigin: true,
            target: 'http://' + APPENGINE_DEV_SERVER.host + ':' + APPENGINE_DEV_SERVER.port,
        },
        '/services/*': {
            changeOrigin: true,
            target: 'http://' + APPENGINE_DEV_SERVER.host + ':' + APPENGINE_DEV_SERVER.port,
        },
    },
};

if (HMR) {
    if (ENABLE_DASHBOARD) {
        const dashboard = new Dashboard();

        plugins.unshift(
            /**
             * Plugin: DashboardPlugin
             * Description: View progress.
             * `'It's like to work at NASA.'`
             *
             * See: https://github.com/FormidableLabs/webpack-dashboard
             */
            new DashboardPlugin(dashboard.setData)
        );
    }

    plugins.push(
        new OpenBrowserPlugin({
            url: 'http://' + METADATA.host + ':' + METADATA.port,
        }),

        new WebpackNotifierPlugin({
            alwaysNotify: true,
            excludeWarnings: false,
            title: 'Webpack compilation',
        })
    );

    devServerConfig.hot = true;
    devServerConfig.quiet = true;
    devServerConfig.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
    };
} else {
    devServerConfig.info = false;
    devServerConfig.noInfo = true;
    devServerConfig.quiet = false;
    devServerConfig.stats = {
        assets: false,
        children: false,
        chunks: false,
        colors: true,
        errorDetails: true,
        errors: true,
        hash: false,
        modules: false,
        publicPath: false,
        reasons: false,
        source: false,
        timings: false,
        version: false,
        warnings: true,
    };
}

/**
 * Webpack configuration
 *
 * @see http://webpack.github.io/docs/configuration.html#cli
 *
 * @param {{ env: string }} options The options to generate the config
 */
module.exports = function webpackDevConfigExport(options) {
    return webpackValidator(webpackMerge.smart(commonConfig(options), {
        /**
         * Switch loaders to debug mode.
         *
         * @see http://webpack.github.io/docs/configuration.html#debug
         */
        debug: true,

        /**
         * Webpack Development Server configuration
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client,
         * which reacts to those events.
         *
         * @see https://webpack.github.io/docs/webpack-dev-server.html
         */
        devServer: devServerConfig,

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

        /*
         * Options affecting the normal modules.
         *
         * @see http://webpack.github.io/docs/configuration.html#module
         */
        module: {
            /*
             * An array of automatically applied loaders.
             * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
             * This means they are not resolved relative to the configuration file.
             *
             * @see http://webpack.github.io/docs/configuration.html#module-loaders
             */
            loaders: [
                /*
                 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
                 *
                 * @see https://github.com/s-panferov/awesome-typescript-loader
                 */
                {
                    exclude: [
                        /\.(spec|specs|e2e)\.ts$/,
                        helpers.root('tests'),
                        helpers.root('dist'),
                    ],
                    loaders: [
                        '@angularclass/hmr-loader?pretty=true&prod=false',
                        'awesome-typescript',
                        'angular2-template',
                    ],
                    test: /\.ts$/,
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

            library: 'ac_[name]',
            libraryTarget: 'var',

            /**
             * The output directory as absolute path (required).
             *
             * @see http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root('dist/client'),

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].map',
        },

        plugins: plugins,
    }),
    commonConfig(options).validatorsOptions);
};
