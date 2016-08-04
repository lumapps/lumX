import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Store, StoreModule } from '@ngrx/store';

import { initialState, tokenReducer } from 'core/reducers/token.reducer';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


/**
 * Our application module
 * Handles the bootstrapping and declaration of everything
 */
@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpModule,
    ],

    imports: [
        CommonModule,
        StoreModule.provideStore(tokenReducer, initialState),
    ],
})
export class CoreModule {
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
