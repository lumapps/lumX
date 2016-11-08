import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BASE_HREF } from 'core/settings/common.settings';

import { DemoRoutingModule } from './demo.routing.module';
import { CoreModule } from 'core/modules/core.module';

import { DemoComponent } from './demo.component';


@NgModule({
    bootstrap: [
        DemoComponent,
    ],

    declarations: [
        DemoComponent,
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
    ],
})
/**
 * Our demo module.
 *
 * Handles the bootstrapping and declaration of everything.
 */
export class DemoModule {
}
