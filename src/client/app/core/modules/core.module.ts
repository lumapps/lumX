import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';

import { initialState, tokenReducer } from 'core/reducers/token.reducer';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';

import { NotFoundComponent } from '../components/not-found/not-found.component';


/**
 * Main core module.
 * Import, initialize and exports miscellaneous utilities to be used througout the application.
 */
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
export class CoreModule {
    /**
     * Export the module for the app's root module.
     *
     * @return {ModuleWithProviders} The modules with the providers that can be used for the app's root module.
     * @public
     * @static
     */
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,

            providers: [
                HttpInterceptorService,
                TokenService,
            ],
        };
    }
}
