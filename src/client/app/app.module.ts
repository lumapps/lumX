import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { BASE_HREF } from 'core/settings/common.settings';

import { UtilsService } from 'core/services/utils.service';

import { CoreModule } from 'core/modules/core.module';

import { IHmrStore } from 'core/types/hmr-store.type';

import { routes } from './app.routes';

import { AppComponent } from './app.component';


/**
 * The main application module.
 * Handles the bootstrapping and declaration of everything.
 */
@NgModule({
    bootstrap: [
        AppComponent,
    ],

    declarations: [
        AppComponent,
    ],

    exports: [
        RouterModule,
    ],

    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            useHash: false,
        }),
    ],

    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: BASE_HREF,
        },
    ],
})
export class AppModule {
    /**
     * Construct the application module.
     *
     * @param {ApplicationRef} appRef The application reference.
     */
    constructor(public appRef: ApplicationRef) {}


    /**
     * When Hot Reload has refreshed the app.
     * Delete any reference to old components.
     *
     * @param {IHmrStore} HmrStore The HMR store.
     * @public
     */
    public hmrAfterDestroy(HmrStore: IHmrStore): void {
        // Display new elements
        HmrStore.disposeOldHosts();
        delete HmrStore.disposeOldHosts;
    }

    /**
     * When the Hot Reload want to refresh the app.
     * Recreate elements and clean styles.
     *
     * @param {IHmrStore} HmrStore The HMR store.
     * @public
     */
    public hmrOnDestroy(HmrStore: IHmrStore): void {
        // tslint:disable-next-line:no-any
        const cmpLocation: ComponentRef<any>[] = this.appRef.components.map(
            // tslint:disable-next-line:no-any
            (cmp: ComponentRef<any>) => cmp.location.nativeElement,
        );

        // Recreate elements
        HmrStore.disposeOldHosts = createNewHosts(cmpLocation);

        // Remove styles
        removeNgStyles();
    }

    /**
     * On Hot Reload initialization.
     * Execute the next tick.
     *
     * @param {IHmrStore} HmrStore The HMR store.
     * @public
     */
    public hmrOnInit(HmrStore: IHmrStore): void {
        if (UtilsService.isUndefined(HmrStore) || UtilsService.isUndefinedOrEmpty(HmrStore.state)) {
            return;
        }

        this.appRef.tick();
    }
}
