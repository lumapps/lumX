// Angular 2
import { ApplicationRef, ComponentRef, enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

import { INgObject, INgWindow } from 'core/types/ng-window.type';


interface IDecorateModuleRef {
    (value: NgModuleRef<{}>): NgModuleRef<{}>;
}

/* Angular debug tools in the dev console
 *
 * @see https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateModuleRef: IDecorateModuleRef = <T>(value: T): T => value;

if (ENV === 'production') {
    // Production
    disableDebugTools();
    enableProdMode();
} else {
    _decorateModuleRef = (moduleRef: NgModuleRef<{}>) => {
        let appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        let cmpRef: ComponentRef<{}> = appRef.components[0];

        let ng: INgObject = (<INgWindow>window).ng;
        (<INgWindow>window).ng.probe = ng.probe;
        (<INgWindow>window).ng.coreTokens = ng.coreTokens;

        enableDebugTools(cmpRef);

        return moduleRef;
    };
}

export const decorateModuleRef: IDecorateModuleRef = _decorateModuleRef;
