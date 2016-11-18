const commonConfig = require('./webpack.common.js');
const helpers = require('./modules/helpers');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Plugins
 */

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = helpers.ENVS.test;
const METADATA = helpers.getMetadata(ENV);

let devServerConfig = helpers.getDevServerConfig(METADATA);

/**
 * Webpack configuration
 *
 * @see {@link http://webpack.github.io/docs/configuration.html#cli|The Webpack documentation on configuration}
 */
module.exports = function webpackTestConfigExport() {
    const realCommonConfig = commonConfig(METADATA);

    return webpackMerge.smart(realCommonConfig, {
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
                 * @see {@link https://github.com/s-panferov/awesome-typescript-loader|Awesome Typescript Loader}
                 * @see {@link https://www.npmjs.com/package/angular2-router-loader|Angular2 Router Loader}
                 * @see {@link https://github.com/TheLarkInn/angular2-template-loader|Angular2 Template Loader}
                 */
                {
                    exclude: [
                        /\.e2e\.ts$/i,
                    ],
                    loaders: [
                        'awesome-typescript-loader?inlineSourceMap=true&sourceMap=false&removeComments=false',
                        'angular2-router-loader?aot=false',
                        'angular2-template-loader',
                    ],
                    test: /\.ts$/i,
                },


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
                    loader: 'istanbul-instrumenter-loader',
                    test: /\.(js|ts)$/i,
                },
            ],
        },
    });
};
