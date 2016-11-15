// Angular 2
import { ApplicationRef, ComponentRef, enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

import { INgObject, INgWindow } from 'core/types/ng-window.type';


interface IDecorateModuleRef {
    (value: NgModuleRef<any>): NgModuleRef<any>;
}

/* Angular debug tools in the dev console
 *
 * @see https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateModuleRef: IDecorateModuleRef = <T>(value: T): T => value;

if (ENV === 'production') {
    // Production
    _decorateModuleRef = (moduleRef: NgModuleRef<any>) => {
        disableDebugTools();
        enableProdMode();

        return moduleRef;
    };
} else {
    _decorateModuleRef = (moduleRef: NgModuleRef<any>) => {
        let appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        let cmpRef: ComponentRef<any> = appRef.components[0];

        let ng: INgObject = (<INgWindow>window).ng;

        enableDebugTools(cmpRef);

        (<INgWindow>window).ng.probe = ng.probe;
        (<INgWindow>window).ng.coreTokens = ng.coreTokens;

        return moduleRef;
    };
}

export const decorateModuleRef: IDecorateModuleRef = _decorateModuleRef;
