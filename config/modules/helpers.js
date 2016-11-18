const autoprefixer = require('autoprefixer');
const merge = require('merge');
const path = require('path');

/*
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * Useful constants
 */
const APPENGINE_DEV_SERVER = {
    host: 'localhost',
    port: 8888,
};

const ENVS = {
    dev: 'development',
    development: 'development',
    prod: 'production',
    production: 'production',
    test: 'test',
    tests: 'test',
};


// Helper functions
var ROOT = path.resolve(__dirname, '../..');

function hasProcessFlag(flag) {
    return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
    return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1])); // eslint-disable-line
}

function rootFunction(args) {
    args = Array.prototype.slice.call(arguments, 0);

    return path.join.apply(path, [ROOT].concat(args));
}

/**
 * Get the default metadata
 *
 * @param  {string} env     The runtime environment: 'development', 'production' or 'test'
 * @return {Object}         The default metadata.
 */
function getMetadata(env) {
    env = (env === undefined || typeof env !== 'string' || env.length === 0) ? ENVS.dev : env;

    const HMR = (env === ENVS.dev) ? hasProcessFlag('hot') : false;

    /*
     * Webpack Constants
     */
    return {
        HMR: HMR,
        env: env,
        host: process.env.HOST || 'localhost',
        isDevServer: isWebpackDevServer(),
        port: process.env.PORT || 8880,
    };
}

const DEV_SERVER_CONFIG = {
    historyApiFallback: true,
    host: 'localhost',
    noInfo: true,
    port: 8880,

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

    quiet: false,
    stats: {
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
    },
};

/**
 * Get the development server configuration
 *
 * @param  {Object} metadata The metadata
 * @return {Object}          The development server configuration.
 */
function getDevServerConfig(metadata) {
    metadata = (metadata === undefined || typeof metadata !== 'object') ? getMetadata() : metadata;

    var devServerConfig = Object.assign({}, DEV_SERVER_CONFIG);
    devServerConfig.host = metadata.host || devServerConfig.host;
    devServerConfig.port = metadata.port || devServerConfig.port;

    return devServerConfig;
}

/**
 * Generate an HTML Webpack Plugin with correct metadata
 *
 * @param  {Object}            metadata The metadata
 * @param  {string}            title    The title
 * @return {HtmlWebpackPlugin}          The html webpack plugin.
 */
function getHtmlWebpackPlugin(metadata, title) {
    metadata = (metadata === undefined || typeof metadata !== 'object') ? getMetadata() : metadata;
    title = (title === undefined || typeof title !== 'string' || title.length === 0) ? 'LumX²' : title;

    /*
     * HtmlWebpackPlugin.
     * Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename which changes every
     * compilation.
     *
     * @see {@link https://github.com/ampedandwired/html-webpack-plugin|HTML Webpack Plugin}
     */
    return new HtmlWebpackPlugin({
        chunksSortMode: 'dependency',
        inject: 'head',
        metadata: metadata,
        template: 'src/client/index.html',
        title: title,
    });
}

const DEFAULT_OPTIONS = {
    options: {
        context: rootFunction(''),

        /*
         * Configure the HTML Loader.
         *
         * @see {@link https://github.com/webpack/html-loader|HTML Loader}
         */
        htmlLoader: {
            caseSensitive: true,
            customAttrAssign: [
                /\)?]?=/,
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

        output: {
            path: rootFunction('dist', 'client'),
        },

        /*
         * Configure The Post-CSS Loader.
         *
         * @see {@link https://github.com/postcss/postcss-loader|Post-CSS Loader}
         * @see {@link https://github.com/postcss/autoprefixer#webpack|AutoPrefixer for Webpack}
         */
        postcss: [
            autoprefixer({
                browsers: [
                    'last 2 versions',
                ],
            }),
        ],

        /*
         * Configure Sass.
         *
         * @see {@link https://github.com/jtangelder/sass-loader|SASS Loader}
         */
        sassLoader: {
            includePaths: [
                rootFunction('src', 'client', 'app'),
                rootFunction('src', 'client', 'app', 'core', 'styles'),
                rootFunction('node_modules'),
            ],
            indentType: 'space',
            indentWidth: 4,
            outputStyle: 'expanded',
        },

        /**
         * Static analysis linter for TypeScript advanced options configuration.
         * An extensible linter for the TypeScript language.
         *
         * @see {@link https://github.com/wbuchwalter/tslint-loader|TSLint Loader}
         */
        tslint: {
            // TSLint errors are displayed by default as warnings.
            // Set emitErrors to true to display them as errors.
            emitErrors: false,

            // TSLint does not interrupt the compilation by default.
            // If you want any file with tslint errors to fail set failOnHint to true.
            failOnHint: false,
        },
    },
};

/**
 * Get the webpack loaders options
 *
 * @param  {Object} metadata The metadata
 * @param  {Object} options  Options to add to the default options
 * @return {Object} The development server configuration.
 */
function getOptions(options) {
    var defaultOptions = merge.recursive(true, DEFAULT_OPTIONS, options);

    return defaultOptions;
}

exports.ENVS = ENVS;
exports.getDevServerConfig = getDevServerConfig;
exports.getHtmlWebpackPlugin = getHtmlWebpackPlugin;
exports.getMetadata = getMetadata;
exports.getOptions = getOptions;
exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = rootFunction;
