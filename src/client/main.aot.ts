import { platformBrowser } from '@angular/platform-browser';

import { decorateModuleRef } from './libs/environment';

import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';


/*
 * Bootstrap our Angular app.
 */
// tslint:disable-next-line:no-any
const _main: () => Promise<any> = async (): Promise<any> => {
    return platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
        .then(decorateModuleRef)
        .catch((error: string) => console.error(error));
};

/**
 * Bootstrap the angular application when the DOM is ready.
 */
export function bootstrapDomReady(): void {
    document.addEventListener('DOMContentLoaded', _main);
}

bootstrapDomReady();
