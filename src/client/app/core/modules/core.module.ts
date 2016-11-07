import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Store, StoreModule } from '@ngrx/store';

import { initialState, tokenReducer } from 'core/reducers/token.reducer';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';

import { NotFoundComponent } from '../components/not-found/not-found.component';


@NgModule({
    declarations: [
        NotFoundComponent,
    ],

    exports: [
        CommonModule,
        FormsModule,
        HttpModule,
    ],

    imports: [
        CommonModule,
        StoreModule.provideStore(tokenReducer, initialState),
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

            providers: [
                HttpInterceptorService,
                TokenService,
            ],
        };
    }
}
