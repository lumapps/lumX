import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bootloader } from '@angularclass/hmr';

import { decorateModuleRef } from './libs/environment';

import { AppModule } from 'app.module';


/*
 * Bootstrap our Angular app
 */
let _main: () => Promise<any> = (): Promise<any> => {
    return platformBrowserDynamic().bootstrapModule(AppModule)
                                   .then(decorateModuleRef)
                                   .catch((error: string) => console.error(error));
};

bootloader(_main);

export const main: () => Promise<any> = _main;
