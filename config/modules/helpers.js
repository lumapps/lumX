const _ = require('lodash');
const merge = require('merge');
const path = require('path');

/////////////////////////////

/*
 * Useful constants.
 */
const APPENGINE_DEV_SERVER = {
    host: 'localhost',
    port: 8888,
};

const ENABLE_DASHBOARD = false;
const ENABLE_AOT = process.env.AOT;
const ENABLE_DEBUG = process.env.DEBUG;
const IS_LIVE = process.env.LIVE;
const MINIMIZE = process.env.MINIMIZE;
const SILENT = process.env.SILENT;
const TESTS_TYPE = process.env.TESTS;

const ENVS = {
    dev: 'development',
    development: 'development',
    prod: 'production',
    production: 'production',
    test: 'test',
    tests: 'test',
};

const TESTS_TYPES = {
    e2e: 'e2e',
    unit: 'unit',
};

/////////////////////////////

/**
 * Check if the running NPM process has the given flag.
 *
 * @param  {string}  flag The flag to check in the running NPM process.
 * @return {boolean} If the running NPM process has the given flag or not.
 */
function hasProcessFlag(flag) {
    return process.argv.join('').indexOf(flag) > -1;
}

/**
 * Check if we are running the Webpack Dev Server.
 *
 * @return {boolean} If we are running the Webpack Dev Server or not.
 */
function isWebpackDevServer() {
    return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1])); // eslint-disable-line
}

/////////////////////////////

/**
 * The root path of the project.
 *
 * @type {string}
 */
const ROOT = path.resolve(__dirname, '../..');

/**
 * Get the full path from the root of the project.
 *
 * @param  {string} ...paths The part of the path we want to join.
 * @return {string} The joined path from the root of the project.
 */
const rootFunction = path.join.bind(path, ROOT);

/////////////////////////////

/**
 * Get the default metadata.
 *
 * @param  {string} env The runtime environment.
 *                      Possible values are 'development', 'production' or 'test'.
 * @return {Object} The default metadata.
 */
function getMetadata(env) {
    env = (env === undefined || env === null || typeof env !== 'string' || env.length === 0) ? ENVS.dev : env;

    const hmr = (env === ENVS.dev) ? hasProcessFlag('hot') : false;

    return {
        HMR: hmr,
        env: env,
        host: process.env.HOST || 'localhost',
        isDevServer: isWebpackDevServer(),
        port: process.env.PORT || 8880,
    };
}

/////////////////////////////

const COMMON_DEBUG_INFO = {
    assets: false,
    cached: false,
    children: false,
    chunkModules: false,
    chunkOrigins: false,
    chunks: false,
    context: '/src/client/',
    errorDetails: true,
    hash: false,
    modules: false,
    reasons: false,
    source: false,
    timings: true,
    version: true,
    /*
     * Filter warnings to be shown (since webpack 2.4.0).
     * Can be a String, Regexp, a function getting the warning and returning a boolean  or an Array of a
     * combination of the above. First match wins.
     *
     * "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false;
     */
    warningsFilter: (message) => message.indexOf('DeprecationWarning:') === -1,
};

const DEV_SERVER_CONFIG = {
    historyApiFallback: true,
    host: 'localhost',
    noInfo: true,
    port: 8880,

    proxy: {
        '/_ah/*': {
            changeOrigin: true,
            target: `http://${APPENGINE_DEV_SERVER.host}:${APPENGINE_DEV_SERVER.port}`,
        },
        '/services/*': {
            changeOrigin: true,
            target: `http://${APPENGINE_DEV_SERVER.host}:${APPENGINE_DEV_SERVER.port}`,
        },
    },

    quiet: true,
    stats: merge.recursive(true, COMMON_DEBUG_INFO, {
        cachedAssets: false,
        colors: true,
        depth: false,
        entrypoints: false,
        errors: true,
        exclude: [],
        performance: true,
        providedExports: false,
        publicPath: false,
        usedExports: false,
        warnings: true,
    }),
};

/**
 * Get the development server configuration.
 *
 * @param  {Object} metadata The metadata.
 * @return {Object} The development server configuration.
 */
function getDevServerConfig(metadata) {
    metadata = (metadata === undefined || typeof metadata !== 'object') ? getMetadata() : metadata;

    const devServerConfig = Object.assign({}, DEV_SERVER_CONFIG);
    devServerConfig.host = metadata.host || devServerConfig.host;
    devServerConfig.port = metadata.port || devServerConfig.port;

    if (metadata.HMR) {
        devServerConfig.hot = true;
        devServerConfig.watchOptions = {
            aggregateTimeout: 300,
            poll: 1000,
        };
    }

    return devServerConfig;
}

/////////////////////////////

const LOADERS_OPTIONS = {
    common: {
        '@angularclass/hmr': {
            pretty: true,
            prod: false,
        },
        'awesome-typescript': {
            configFileName: 'tsconfig.json',
            silent: SILENT,
            useCache: true,
            usePrecompiledFiles: true,
        },
        'css': {
            importLoaders: 1,
        },
        'file': {
            name: 'assets/[name].[hash].[ext]',
        },
        'html': {
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
            removeAttributeQuotes: false,
        },
        'istanbul-instrumenter': {
            esModules: true,
        },
        'ng-router': {
            aot: ENABLE_AOT,
            genDir: 'compiled',
            loader: 'async-import',
        },
        'postcss': {
            config: {
                path: './config/postcss.config.js',
            },
            plugins: [
                require('autoprefixer')({
                    browsers: [
                        'last 2 versions',
                    ],
                }),
            ],
        },
        'sass': {
            includePaths: [
                rootFunction('src', 'client', 'app'),
                rootFunction('src', 'client', 'app', 'core', 'styles'),
                rootFunction('node_modules'),
            ],
            indentType: 'space',
            indentWidth: 4,
            outputStyle: 'expanded',
        },
        'string-replace': {
            flags: 'g',
            replace: 'var sourceMappingUrl = "";',
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
        },
        'tslint': {
            emitErrors: false,
            failOnHint: false,
            tsConfigFile: 'tsconfig.json',
            typeCheck: true,
        },
    },
    dev: {
        tslint: {
            fix: true,
        },
    },
    prod: {
        postcss: {
            plugins: [
                require('cssnano')(),
            ],
        },
    },
    test: {},
};

/**
 * Get the options of the loader according to the target (dev/prod/test.
 *
 * @param  {string} loaderName The loader name
 *                             Note that you can (you should) omit the '-loader' part from the name of the loader.
 * @param  {string} env        The environment we want the loader for.
 *                             Possible values are: 'development', 'production', 'test'.
 * @return {Object} The options of the requested loader.
 */
function getLoaderOptions(loaderName, env) {
    loaderName = (_.endsWith(loaderName, '-loader')) ? loaderName.replace('-loader', '') : loaderName;

    return merge.recursive(
        true,
        _.get(LOADERS_OPTIONS, `common.${loaderName}`, {}),
        _.get(LOADERS_OPTIONS, `${env}.${loaderName}`, {}),
        {
            debug: ENABLE_DEBUG,
            minimize: ((env === ENVS.prod) || MINIMIZE) && !ENABLE_DEBUG,
            sourceMap: (loaderName !== 'awesome-typescript'),
        }
    );
}

/**
 * Get the loader object to use in webpack rules configuration.
 *
 * @param  {string} loaderName The loader name.
 *                             Note that you can (you should) omit the '-loader' part from the name of the loader.
 * @param  {string} env        The environment we want the loader for.
 *                             Possible values are: 'development', 'production', 'test'.
 * @return {Object} The loader object to be used in a Webpack rule configuration.
 */
function getLoader(loaderName, env) {
    loaderName = (_.endsWith(loaderName, '-loader')) ? loaderName.replace('-loader', '') : loaderName;

    return {
        loader: `${loaderName}-loader`,
        options: getLoaderOptions(loaderName, env),
    };
}

/////////////////////////////

exports.ENABLE_AOT = ENABLE_AOT;
exports.ENABLE_DASHBOARD = ENABLE_DASHBOARD;
exports.ENABLE_DEBUG = ENABLE_DEBUG;
exports.ENVS = ENVS;
exports.IS_LIVE = IS_LIVE;
exports.MINIMIZE = MINIMIZE;
exports.SILENT = SILENT;

exports.COMMON_DEBUG_INFO = COMMON_DEBUG_INFO;
exports.TESTS_TYPE = TESTS_TYPE;
exports.TESTS_TYPES = TESTS_TYPES;

exports.getLoader = getLoader;
exports.getLoaderOptions = getLoaderOptions;

exports.getDevServerConfig = getDevServerConfig;
exports.getMetadata = getMetadata;
exports.root = rootFunction;
