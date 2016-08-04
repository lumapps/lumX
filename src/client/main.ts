/*
 * Providers provided by Angular
 */
import { platformBrowser } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { decorateComponentRef } from 'libs/environment';


/*
 * Bootstrap our Angular app
 */
let _main: Function = (initialHmrState?: Object): Promise<{}> => {
    if (true || (ENV === 'development' && HMR === true)) {
        let appModule = require('./app/app.module').AppModule; // tslint:disable-line

        return platformBrowserDynamic().bootstrapModule(appModule)
            .then(decorateComponentRef)
            .catch((error: string) => console.error(error));
    }/* else {
        let appModuleNgFactory = require('.app/app.module.ngfactory').AppModuleNgFactory; // tslint:disable-line

        // The browser platform without a compiler
        // The app module factory produced by the static offline compiler
        // Launch with the app module factory.
        platformBrowser().bootstrapModuleFactory(appModuleNgFactory);
    }*/
};

if (ENV === 'development' && HMR === true) {
    // Activate hot module reload
    let ngHmr = require('angular2-hmr'); // tslint:disable-line
    ngHmr.hotModuleReplacement(_main, module);
} else {
    // Bootstrap when document is ready
    document.addEventListener('DOMContentLoaded', () => _main());
}


export const main: Function = _main;
