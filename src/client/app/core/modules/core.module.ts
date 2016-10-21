import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { NotFoundComponent } from '../components/not-found/not-found.component';


@NgModule({
    declarations: [
        NotFoundComponent,
    ],

    exports: [
        CommonModule,
    ],

    imports: [
        CommonModule,
    ],

    providers: [
    ],
})
/**
 * Our application module.
 *
 * Handles the bootstrapping and declaration of everything.
 */
export class CoreModule {
    /**
     * Export the module for the app's root module.
     *
     * @return {ModuleWithProviders} The modules with the providers that can be used for the app's root module.
     */
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
        };
    }
}
