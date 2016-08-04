// Angular 2
import { ApplicationRef, ComponentRef, enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

import { NgObject, NgWindow } from 'core/types/ng-window.type';


interface IDecorateComponentRef {
    (value: NgModuleRef<{}>): ComponentRef<{}>;
}

/* Angular debug tools in the dev console
 *
 * @see https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateComponentRef: IDecorateComponentRef = <T>(value: T): T => value;

if (ENV === 'production') {
    // Production
    disableDebugTools();
    enableProdMode();
} else {
    _decorateComponentRef = (moduleRef: NgModuleRef<{}>) => {
        let appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        let cmpRef: ComponentRef<{}> = appRef.components[0];

        let ng: NgObject = (<NgWindow>window).ng;
        enableDebugTools(cmpRef);
        (<NgWindow>window).ng.probe = ng.probe;
        (<NgWindow>window).ng.coreTokens = ng.coreTokens;

        return cmpRef;
    };
}

export const decorateComponentRef: IDecorateComponentRef = _decorateComponentRef;
