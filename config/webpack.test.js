const commonConfig = require('./webpack.common.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins.
 */


/**
 * Webpack Constants.
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.test;
const METADATA = helpers.getMetadata(ENV);

const devServerConfig = helpers.getDevServerConfig(METADATA);
const isLive = process.env.LIVE;

/**
 * Webpack configuration.
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 *
 * @return {Object} The webpack test configuration.
 */
module.exports = function webpackTestConfigExport() {
    console.info('');
    console.info('Starting Webpack bundle compilation.');
    console.info('This could take some time, please wait...');
    if (isLive) {
        console.info('');
    }

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
                /**
                 * Instruments testing files with Istanbul for subsequent code coverage reporting.
                 *
                 * @see {@link https://github.com/deepsweet/istanbul-instrumenter-loader|Istanbul Instrumenter Loader}
                 */
                {
                    enforce: 'post',
                    exclude: [
                        /\.(spec|specs|e2e|module|routing)\.(js|ts)$/i,
                        /node_modules/,
                    ],
                    include: helpers.root('src', 'client', 'app'),
                    test: /\.(js|ts)$/i,
                    use: [
                        {
                            loader: 'istanbul-instrumenter-loader',
                            options: {
                                esModules: true,
                            },
                        },
                    ],
                },
            ],
        },

        /**
         * Disable performance hints.
         *
         * @see {@link https://github.com/a-tarasyuk/rr-boilerplate/blob/master/webpack/dev.config.babel.js#L41}
         */
        performance: {
            hints: false,
        },
    });
};
