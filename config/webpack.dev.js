const commonConfig = require('./webpack.common.build');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins.
 */
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const WebpackNotifierPlugin = require('webpack-notifier');

/**
 * Webpack Constants.
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.dev;
const METADATA = helpers.getMetadata(ENV);


/**
 * Configure the list of Webpack plugins to use.
 */
const plugins = [
    /**
     * Plugin: LoaderOptionsPlugin.
     * Description: Configure Webpack loaders and context.
     *
     * @see {@link https://gist.github.com/sokra/27b24881210b56bbaff7|What's new in Webpack2}
     */
    new LoaderOptionsPlugin(helpers.getOptions({
        debug: helpers.ENABLE_DEBUG,
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
     * Plugin: WebpackNotifierPlugin.
     * Description: Send a notification when compilation ended (successfully or with error).
     *
     * @see {@link https://www.npmjs.com/package/webpack-notifier|Webpack Notifier Plugin}
     */
    new WebpackNotifierPlugin({
        alwaysNotify: true,
        excludeWarnings: false,
        skipFirstNotification: false,
        title: 'Webpack compilation',
    }),
];

if (METADATA.HMR && helpers.ENABLE_DASHBOARD) {
    const dashboard = new Dashboard();

    plugins.unshift(
        /**
         * Plugin: DashboardPlugin.
         * Description: View progress. 'It's like to work at NASA'.
         *
         * @see {@link https://github.com/FormidableLabs/webpack-dashboard|Dashboard Plugin}
         */
        new DashboardPlugin(dashboard.setData)
    );
}


/**
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 *
 * @return {Object} The webpack development configuration.
 */
module.exports = function webpackDevConfigExport() {
    return webpackMerge.smart(commonConfig(METADATA), {
        /**
         * Developer tool to enhance debugging.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#devtool|The Webpack documentation on devTool}
         * @see {@link https://github.com/webpack/docs/wiki/build-performance#sourcemaps|The Webpack documentation on sourcemap}
         */
        devtool: 'inline-source-map',

        /**
         * Options affecting the output of the compilation.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#output|The Webpack documentation on output}
         */
        output: {
            /**
             * The filename of non-entry chunks as relative path inside the 'output.path' directory.
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
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * @see {@link http://webpack.github.io/docs/configuration.html#output-sourcemapfilename|The Webpack documentation on sourcemap file name}
             */
            sourceMapFilename: '[file].map',
        },

        /*
         * Add additional plugins to the compiler.
         *
         * @see {@link http://webpack.github.io/docs/configuration.html#plugins|The webpack documentation on plugins}
         */
        plugins: plugins,
    });
};
