import { ApplicationRef, ComponentRef, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { CoreModule } from 'core/modules/core.module';
import { IHmrStore } from 'core/types/hmr-store.type';

import { ToDoModule } from 'to-do/to-do.module';

import { AppComponent } from 'app.component';


@NgModule({
    bootstrap: [
        AppComponent,
    ],

    declarations: [
        AppComponent,
    ],

    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ToDoModule,
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


    hmrAfterDestroy(_HmrStore: IHmrStore): void {
        // Display new elements
        _HmrStore.disposeOldHosts();
        delete _HmrStore.disposeOldHosts;
    }

    hmrOnDestroy(_HmrStore: IHmrStore): void {
        let cmpLocation: ComponentRef<{}>[] = this._appRef.components.map((cmp: ComponentRef<{}>) => {
            return cmp.location.nativeElement;
        });

        // Recreate elements
        _HmrStore.disposeOldHosts = createNewHosts(cmpLocation);

        // Remove styles
        removeNgStyles();
    }

    hmrOnInit(_HmrStore: IHmrStore): void {
        if (!_HmrStore || !_HmrStore.state) {
            return;
        }
        this._appRef.tick();
    }
}
