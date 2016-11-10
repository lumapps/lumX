import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { BASE_HREF } from 'core/settings/common.settings';

import { DemoRoutingModule } from './demo.routing.module';
import { CoreModule } from 'core/modules/core.module';

import { IHmrStore } from 'core/types/hmr-store.type';

import { MobileNavService } from './services/mobile-nav.service';

import { DemoComponent } from './demo.component';

import { HomeComponent } from './components/home/home.component';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MobileNavigationComponent } from './components/mobile-nav/mobile-nav.component';
import { PrimaryNavLinkComponent } from './components/primary-nav-link/primary-nav-link.component';
import { PrimaryNavComponent } from './components/primary-nav/primary-nav.component';

import { ComponentsModule } from './components/components/components.module';
import { CSSModule } from './components/css/css.module';
import { GettingStartedModule } from './components/getting-started/getting-started.module';


@NgModule({
    bootstrap: [
        DemoComponent,
    ],

    declarations: [
        DemoComponent,
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        PrimaryNavComponent,
        PrimaryNavLinkComponent,
        MobileNavigationComponent,
    ],

    imports: [
        DemoRoutingModule,
        BrowserModule,
        CoreModule.forRoot(),
        ComponentsModule,
        CSSModule,
        GettingStartedModule,
    ],

    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: BASE_HREF,
        },
        MobileNavService,
    ],
})
/**
 * Our demo module.
 *
 * Handles the bootstrapping and declaration of everything.
 */
export class DemoModule {
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
        let cmpLocation: ComponentRef<any>[] = this._appRef.components.map((cmp: ComponentRef<any>) => {
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
