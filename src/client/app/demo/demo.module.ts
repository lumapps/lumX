import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BASE_HREF } from 'core/settings/common.settings';

import { DemoRoutingModule } from './demo.routing.module';
import { CoreModule } from 'core/modules/core.module';

import { DemoRoutingModule } from './demo.routing.module';

import { MobileNavService } from './services/mobile-nav.service';

import { DemoComponent } from './demo.component';

// import { DocumentationAbstract } from './components/documentation/documentation.abstract';
import { HomeComponent } from './components/home/home.component';

import { HeaderComponent } from './components/header/header.component';
import { MobileNavigationComponent } from './components/mobile-nav/mobile-nav.component';
import { PrimaryNavLinkComponent } from './components/primary-nav-link/primary-nav-link.component';
import { PrimaryNavComponent } from './components/primary-nav/primary-nav.component';
import { SecondaryNavLinkComponent } from './components/secondary-nav-link/secondary-nav-link.component';
import { SecondaryNavComponent } from './components/secondary-nav/secondary-nav.component';

// import { ComponentsModule } from './components/components/components.module';
// import { CSSModule } from './components/css/css.module';
import { GettingStartedModule } from './components/getting-started/getting-started.module';


@NgModule({
    bootstrap: [
        DemoComponent,
    ],

    declarations: [
        DemoComponent,
        HomeComponent,
        HeaderComponent,
        PrimaryNavComponent,
        PrimaryNavLinkComponent,
        SecondaryNavComponent,
        SecondaryNavLinkComponent,
        MobileNavigationComponent,
    ],

    imports: [
        DemoRoutingModule,
        BrowserModule,
        CoreModule.forRoot(),
        DemoRoutingModule,
        // ComponentsModule,
        // CSSModule,
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
}
