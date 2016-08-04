/*
 * When testing with webpack and ES6, we have to do some extra
 * things to get testing to work right. Because we are gonna write tests
 * in ES6 too, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it will compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */

Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

/*
 * Import all CoreJS, TypeScript, Zone and RXJS polyfils
 */
require('core-js/');
require('ts-helpers');
require('zone.js/dist/zone');
require('rxjs/Rx');

/*
 * Initialize test environment
 */
var TestBed = require('@angular/core/testing').TestBed;
var BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
var platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

/*
 * Ok, this is kinda crazy. We can use the context method on
 * require that webpack created in order to tell webpack
 * what files we actually want to require or import.
 * Below, context will be a function/object with file names as keys.
 * using that regex we are saying look in ./src/client then find
 * any file that ends with spec.ts and get its path. By passing in true
 * we say do this recursively
 */
var testContext = require.context('../../../src/client/app', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);

var coverageContext = require.context('../../../src/client/app', true, /^(?!.*(spec|e2e)\.ts?$).*\.ts?$/);
coverageContext.keys().forEach(coverageContext);
