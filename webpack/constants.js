const path = require('path');

/**
 * Gives an absolute path by resolving the provided relative path.
 *
 * @param  {string} pathName The relative path.
 * @return {string} The resolved absolute path.
 */
function getAbsolutePath(pathName) {
    return path.resolve(__dirname, pathName);
}

// Path relative constants.
const ROOT_PATH = getAbsolutePath('../');

const DEMO_PATH = `${ROOT_PATH}/demo`;
const DIST_PATH = `${ROOT_PATH}/dist`;
const NODE_MODULES_PATH = `${ROOT_PATH}/node_modules`;

const MODULES_PATH = `${ROOT_PATH}/modules`;
const CORE_PATH = `${ROOT_PATH}/core`;
const STYLES_PATH = `${CORE_PATH}/scss`;

// Dev-server relative constants
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 4000;

// Plugins configurations
const CONFIGS = {
    /**
     * CSS Nanon options.
     *
     * @type {Object}
     * @see [CSS Nano documentation]{@link https://cssnano.co/guides}
     */
    cssNano: {
        preset: [
            'default',
            {
                cssDeclarationSorter: true,
            },
        ],
    },

    /**
     * HTML Minifier options.
     *
     * @type {Object}
     * @see [HTMLMinifier documentation]{@link https://www.npmjs.com/package/html-minifier#options-quick-reference}
     */
    htmlMinifier: {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        customAttrCollapse: /ng-class/,
        customEventAttributes: [/^(on|ng)[a-z]{3,}$/],
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        processScripts: ['text/ng-template'],
        quoteCharacter: '"',
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
    },

    /**
     * Terser options.
     *
     * @type {Object}
     * @see [Terser documentation]{@link https://github.com/terser-js/terser}
     */
    // eslint-disable-next-line max-len
    /* eslint-disable key-spacing, line-comment-position, no-inline-comments, camelcase, no-multi-spaces, no-magic-numbers, max-len */
    terser: {
        /*
         * For more information about compressor options:
         * @see [UglifyJS3 Compressor document]{@link https://github.com/mishoo/UglifyJS2#compressor-options}
         */
        compress: {
            arrows: true, // Optimize the arrow functions form.
            arguments: true, // Replace `arguments[index]`` with function parameter name (when possible).
            booleans: true, // Optimize boolean expressions.
            booleans_as_integers: false, // Turns booleans into 0 and 1 and use `==` or `!=` for comparisons.
            collapse_vars: false, // Collapse single-use var and const definitions.
            comparisons: true, // Optimize comparisons.
            computed_props: true, // Optimize the constant computed properties.
            conditionals: true, // Optimize if-s and conditional expressions.
            dead_code: true, // Discard unreachable code.
            defaults: true, // Disable most of default enables compress options.
            directives: true, // Remove redundant or non-standard directives.
            drop_console: false, // Discard “console” statements.
            drop_debugger: true, // Discard “debugger” statements.
            ecma: 8,
            evaluate: true, // Evaluate constant expressions.
            expression: false, // Preserve completion values from terminal statements without `return`.
            global_defs: {}, // Global definitions.
            hoist_funs: true, // Hoist function declarations.
            hoist_props: true, // Hoist properties from constant declarations.
            hoist_vars: false, // Hoist variable declarations.
            if_return: true, // Optimize if-s followed by return/continue.
            inline: true, // Embed simple functions.
            join_vars: true, // Join var declarations.
            keep_classnames: false, // Prevent the compressor from discarding classes names.
            keep_fargs: true, // Prevent the compressor from discaring unused function arguments.
            keep_fnames: false, // Prevent the compressor from discarding function names.
            keep_infinity: true, // Prevent 'Infinity' to be compressed to '1/0' leading to performances issues on Chrome.
            loops: true, // Optimize loops.
            module: false, // Use this to compress an ES6 Module (stric mode is implied and `toplevel` is enabled).
            negate_iife: true, // Negate IIFE where return value is discared to avoid parens adding.
            passes: 1, // The number of time to run the compressor.
            properties: true, // Optimize property access: a["foo"] → a.foo.
            pure_funcs: null, // List of functions assumed to not having any side effects.
            pure_getters: false, // Assume that object property access doesn't have any side effects.
            reduce_funcs: false, // Inline single use functions.
            reduce_vars: true, // Improve optimization on vars assigned with and used as constant values.
            sequences: true, // Join consecutive statemets with the “comma operator”.
            side_effects: true, // Drop side-effect-free statements.
            switches: true, // Deduplicate an remove unreachable switch branches.
            toplevel: false, // Drop unreferenced toplevel scope declarations.
            top_retain: null, // Retains these specifics toplevel scope declarations.
            typeofs: true, // Optimize 'typeof' to void comparaison.
            unsafe: false, // Some unsafe optimizations.
            unsafe_arrows: false, // Some unsafe arrow functions optimizations.
            unsafe_comps: false, // Some unsafe comparison optimizations.
            unsafe_Function: false, // Some unsafe functions optimizations.
            unsafe_math: false, // Some unsafe math optimizations.
            unsafe_methods: false, // Some unsafe methods optimizations.
            unsafe_proto: false, // Some unsafe prototype optimizations.
            unsafe_regexp: false, // Some unsafe RegExp optimizations.
            unsafe_undefined: false, // Substitue `void 0` if there is a variable named `undefined` in scope.
            unused: true, // Drop unused variables/functions.
            warnings: false, // Warn about potentially dangerous optimizations/code.
        },
        ecma: 8,
        ie8: false,
        keep_classnames: false,
        keep_fnames: false,
        mangle: {
            eval: false, // Mangle the name in eval or with context.
            keep_classnames: false, // Do not mangle the classes names.
            keep_fnames: false, // Do not mangle the function names.
            module: false, // Indicates if we are mangling ES6 Modules and implies `toplevel`.
            properties: false, // Do not mangle properties.
            toplevel: false, // Mangle top level names.
            safari10: false, // Work around a Safari 10 bug with mangling.
        },
        module: false,
        nameCache: null,
        output: {
            ascii_only: false, // Escape Unicode characters in strings and regexps.
            beautify: false, // Indicates if you want to beautify the output of the minifier.
            braces: false, // Always insert braces in `if`, `for`, `do`, `while` or `with` statements.
            comments: false, // Indicates if you want to keep comments (boolean, 'all', 'some', RegExp or function).
            ecma: 5,
            indent_level: 0,
            indent_start: 0,
            inline_script: true, // Escape HTML comments and the slash in occurrences of </script> in strings.
            keep_quoted_props: false, // Prevents stripping quotes from property names in object literals.
            max_line_len: false,
            preamble: null, // A string that will be prepended to the output (e.g. licensing).
            quote_keys: false, // Quote all keys in literal objects.
            quote_style: 0,
            safari10: false, // Work around some Safari 10 bugs.
            shebang: true, // Preservers `#!` in preamble.
            webkit: false, // Workarounds some WebKit bugs (PhantomJS users should enable this option).
            width: 120, // Only used when beautification is enabled.
            wrap_iife: false,
        },
        parse: {
            bare_returns: false, // Support top level `return` statements.
            ecma: 8,
            html5_comments: true,
            shebang: true,
        },
        safari10: false,
        sourceMap: false,
        toplevel: false,
        warning: false,
    },
    /* eslint-enable key-spacing, line-comment-position, no-inline-comments, camelcase, no-multi-spaces, , no-magic-numbers, max-len */
};

module.exports = {
    MODULES_PATH,
    CONFIGS,
    CORE_PATH,
    DEFAULT_HOST,
    DEFAULT_PORT,
    DEMO_PATH,
    DIST_PATH,
    NODE_MODULES_PATH,
    ROOT_PATH,
    STYLES_PATH,
};
