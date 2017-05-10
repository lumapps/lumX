import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bootloader } from '@angularclass/hmr';

import { decorateModuleRef } from 'libs/environment';

import { AppModule } from 'app.module';


/*
 * Bootstrap our Angular app
 */
// tslint:disable-next-line:no-any
const _main: () => Promise<any> = async (): Promise<any> => {
    return platformBrowserDynamic().bootstrapModule(AppModule)
        .then(decorateModuleRef)
        .catch((error: string) => console.error(error));
};

bootloader(_main);

// tslint:disable-next-line:no-any
export const main: () => Promise<any> = _main;
