import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { BASE_HREF } from 'core/settings/common.settings';

import { AppRouting } from 'app.routing';
import { CoreModule } from 'core/modules/core.module';

import { IHmrStore } from 'core/types/hmr-store.type';

import { HomeModule } from 'home/home.module';

import { AppComponent } from './app.component';


@NgModule({
    bootstrap: [
        AppComponent,
    ],

    declarations: [
        AppComponent,
    ],

    imports: [
        AppRouting,
        BrowserModule,
        CoreModule.forRoot(),
        HomeModule,
    ],

    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: BASE_HREF,
        },
    ],
})
/**
 * Our application module.
 *
 * Handles the bootstrapping and declaration of everything.
 */
export class AppModule {
    /**
     * Construct the application module.
     *
     * @constructs AppModule
     *
     * @param {ApplicationRef} _appRef The application reference.
     */
    constructor(private _appRef: ApplicationRef) {}


    /**
     * When Hot Reload has refreshed the app.
     * Delete any reference to old components.
     *
     * @param {IHmrStore} _HmrStore The hmr store
     */
    hmrAfterDestroy(_HmrStore: IHmrStore): void {
        // Display new elements
        _HmrStore.disposeOldHosts();
        delete _HmrStore.disposeOldHosts;
    }

    /**
     * When the Hot Reload want to refresh the app.
     * Recreate elements and clean styles.
     *
     * @param {IHmrStore} _HmrStore The HMR store
     */
    hmrOnDestroy(_HmrStore: IHmrStore): void {
        let cmpLocation: ComponentRef<any>[] = this._appRef.components.map((cmp: ComponentRef<any>) => {
            return cmp.location.nativeElement;
        });

        // Recreate elements
        _HmrStore.disposeOldHosts = createNewHosts(cmpLocation);

        // Remove styles
        removeNgStyles();
    }

    /**
     * On Hot Reload initialization.
     * Execute the next tick.
     *
     * @param {IHmrStore} _HmrStore The HMR store
     */
    hmrOnInit(_HmrStore: IHmrStore): void {
        if (!_HmrStore || !_HmrStore.state) {
            return;
        }

        this._appRef.tick();
    }
}
