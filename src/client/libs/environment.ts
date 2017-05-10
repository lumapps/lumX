// Angular 2
import { ApplicationRef, ComponentRef, NgModuleRef, enableProdMode } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

import { INgObject, INgWindow } from 'core/types/ng-window.type';


interface IDecorateModuleRef {
    // tslint:disable-next-line:no-any
    (value: NgModuleRef<any>): NgModuleRef<any>;
}

/* Angular debug tools in the dev console
 *
 * @see https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateModuleRef: IDecorateModuleRef = <T>(value: T): T => value;

if (ENV === 'development') {
    // tslint:disable-next-line:no-any
    _decorateModuleRef = (moduleRef: NgModuleRef<any>): NgModuleRef<any> => {
        const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        // tslint:disable-next-line:no-any
        const cmpRef: ComponentRef<any> = appRef.components[0];

        const ng: INgObject = (<INgWindow>window).ng;

        enableDebugTools(cmpRef);

        (<INgWindow>window).ng.probe = ng.probe;
        (<INgWindow>window).ng.coreTokens = ng.coreTokens;

        return moduleRef;
    };
} else {
    // Production
    enableProdMode();

    // tslint:disable-next-line:no-any
    _decorateModuleRef = (moduleRef: NgModuleRef<any>): NgModuleRef<any> => {
        disableDebugTools();

        return moduleRef;
    };
}

export const decorateModuleRef: IDecorateModuleRef = _decorateModuleRef;
