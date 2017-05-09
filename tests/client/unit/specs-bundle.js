/*
 * When testing with webpack and ES6, we have to do some extra things to get testing to work right. Because we are gonna
 * write tests in ES6 too, we have to compile those as well. That's handled in 'karma.conf.js' with the
 * 'karma-webpack plugin'.
 * This is the entry file for webpack test. Just like webpack will create a 'bundle.js' file for our client, when we run
 * tests, it will compile and bundle them all here!
 * Crazy huh.
 * So we need to do some setup...
 */

Error.stackTraceLimit = Infinity;

/*
 * Import all SystemJS, CoreJS, TypeScript, Zone and RXJS polyfils.
 * Order is important!
 */
require('core-js/es6');
require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/mocha-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

require('rxjs/Rx');

/*
 * Initialize test environment.
 */
const TestBed = require('@angular/core/testing').TestBed;
const BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
const platformBrowserDynamicTesting =
    require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

/*
 * Ok, this is kinda crazy.
 * We can use the context method on require that webpack created in order to tell webpack what files we actually want to
 * require or import.
 * Below, context will be a function/object with file names as keys.
 * Using that regex we are saying look in '../../../src/client/app' then find any file that ends with 'spec(s).ts' and
 * get its path.
 * By passing in true we say do this recursively.
 */
const testContext = require.context('../../../src/client/app', true, /\.spec|specs\.ts/);

/*
 * Get all the files.
 * For each file, call the context function that will require the file and load it up here.
 * Context will loop and require those spec files here.
 */
function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

// Requires and returns all modules that match.
requireAll(testContext);
