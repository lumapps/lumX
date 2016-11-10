import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule as LumXCoreModule } from 'core/modules/core.module';

import { SecondaryNavLinkComponent } from '../components/secondary-nav-link/secondary-nav-link.component';
import { SecondaryNavComponent } from '../components/secondary-nav/secondary-nav.component';


@NgModule({
    declarations: [
        SecondaryNavComponent,
        SecondaryNavLinkComponent,
    ],

    exports: [
        SecondaryNavComponent,
        SecondaryNavLinkComponent,
    ],

    imports: [
        LumXCoreModule.forRoot(),
        RouterModule,
    ],
})
/**
 * The Core module for the demo application.
 * Put stuff that are used by multiple modules in here.
 */
export class CoreModule {}
