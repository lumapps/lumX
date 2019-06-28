const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const { shouldPrintComment } = require('babel-plugin-smart-webpack-import');

const { NODE_MODULES_PATH, STYLES_PATH } = require('./constants');

/**
 * Setup Babel transpiler.
 *
 * @param  {Array}  [plugins] The plugins to use.
 * @param  {Array}  [presets] The presets to use.
 * @param  {Object} [options] The options to use.
 * @return {Object} The Babel configuration object.
 */
function babelSetup({ plugins = [], presets = [], options = {} } = {}) {
    return {
        ...options,
        plugins: [
            ...plugins,
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-syntax-dynamic-import',
        ],
        presets: [
            ...presets,
            [
                '@babel/preset-env',
                {
                    // eslint-disable-next-line no-magic-numbers
                    corejs: '3',
                    loose: true,
                    targets: ['last 2 versions', 'ie >= 11'],
                    useBuiltIns: 'usage',
                },
            ],
        ],
        shouldPrintComment,
    };
}

/**
 * Get the appropriate loader for the SCSS styles depending wether we are in dev mode or building the production bundle.
 *
 * @param  {string}        [mode='dev'] The mode of the build.
 *                                      Possible values are: 'dev' or 'prod'.
 * @return {Array<Object>} The loaders for the SCSS and CSS styles.
 */
function getStyleLoader({ mode = 'dev' }) {
    return [
        {
            exclude: /node_modules/u,
            test: /\.scss$/u,
            use: [
                mode === 'dev'
                    ? {
                          loader: 'style-loader',
                          options: {
                              hmr: true,
                              sourceMap: true,
                          },
                      }
                    : {
                          loader: ExtractCssChunks.loader,
                          options: {
                              hot: false,
                              reloadAll: false,
                          },
                      },
                {
                    loader: 'css-loader',
                    options: {
                        // eslint-disable-next-line no-magic-numbers
                        importLoaders: 2,
                        sourceMap: false,
                    },
				},
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: `${STYLES_PATH}/postcss.config.js`,
                        },
                        sourceMap: false,
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [`${NODE_MODULES_PATH}/bourbon/app/assets/stylesheets/`, `${NODE_MODULES_PATH}/@mdi/font/scss/`, `${NODE_MODULES_PATH}/sass-mq`],
                        sourceMap: false,
                    },
                },
            ],
        },
        {
            exclude: /node_modules/u,
            test: /\.css$/u,
            use: [
                mode === 'dev'
                    ? {
                          loader: 'style-loader',
                          options: {
                              hmr: true,
                              sourceMap: true,
                          },
                      }
                    : {
                          loader: ExtractCssChunks.loader,
                          options: {
                              hot: false,
                              reloadAll: false,
                          },
                      },
                {
                    loader: 'css-loader',
                    options: {
                        // eslint-disable-next-line no-magic-numbers
                        importLoaders: 2,
                        sourceMap: false,
                    },
				},
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: `${STYLES_PATH}/postcss.config.js`,
                        },
                        sourceMap: false,
                    },
                },
            ],
        },
    ];
}

module.exports = {
    babelSetup,
    getStyleLoader,
};
