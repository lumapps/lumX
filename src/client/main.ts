import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bootloader } from '@angularclass/hmr';

import { decorateModuleRef } from './libs/environment';

import { DemoModule } from 'demo/demo.module';


/*
 * Bootstrap our Angular app
 */
let _main: () => Promise<{}> = (): Promise<{}> => {
    return platformBrowserDynamic().bootstrapModule(DemoModule)
                                   .then(decorateModuleRef)
                                   .catch((error: string) => console.error(error));
};

bootloader(_main);

export const main: () => Promise<{}> = _main;
