import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BASE_HREF } from 'core/settings/common.settings';

import { DemoRoutingModule } from './demo.routing.module';
import { CoreModule } from 'core/modules/core.module';

import { MobileNavService } from './services/mobile-nav.service';

import { DemoComponent } from './demo.component';

import { HeaderComponent } from './components/header/header.component';
import { MainNavigationComponent } from './components/main-nav/main-nav.component';
import { MobileNavigationComponent } from './components/mobile-nav/mobile-nav.component';


@NgModule({
    bootstrap: [
        DemoComponent,
    ],

    declarations: [
        DemoComponent,
        HeaderComponent,
        MainNavigationComponent,
        MobileNavigationComponent,
    ],

    imports: [
        DemoRoutingModule,
        BrowserModule,
        CoreModule.forRoot(),
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
}
