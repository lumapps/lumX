/*
 * Support for older Internet Explorer Version (from IE9).
 */
/* import 'ie-shim'; */

/*
 * Import all ES6 polyfills.
 */
/* import 'core-js/es6'; */

/*
 * Or, better solution:
 * added parts of ES6 which are necessary for your project or your browser support requirements.
 */
// import 'core-js/es6/array';
// import 'core-js/es6/date';
// import 'core-js/es6/function';
// import 'core-js/es6/map';
// import 'core-js/es6/math';
// import 'core-js/es6/number';
// import 'core-js/es6/object';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/reflect';
// import 'core-js/es6/regexp';
// import 'core-js/es6/set';
// import 'core-js/es6/string';
// import 'core-js/es6/symbol';
// import 'core-js/es6/typed';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/weak-set';

/*
 * There is an issue with the ES6 Promise polyfill.
 *
 * @see https://github.com/AngularClass/angular2-webpack-starter/issues/709
 */
/* import 'core-js/es6/promise'; */

/*
 * Import ES7 Reflect polyfill.
 */
import 'core-js/es7/reflect';

/*
 * Import Zone JS polyfills.
 */
import 'zone.js/dist/zone';


if (ENV === 'production') {
    // Production.
} else {
    // Development.
    Error.stackTraceLimit = Infinity;

    // tslint:disable-next-line:no-require-imports no-var-requires
    require('zone.js/dist/long-stack-trace-zone');
}
