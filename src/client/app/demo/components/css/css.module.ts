import { NgModule }       from '@angular/core';

import { CSSComponent } from './css.component';
// import { InstallationComponent } from './installation/installation.component';

import { CSSRoutingModule } from './css.routing.module';

import { SecondaryNavComponent } from 'demo/components/secondary-nav/secondary-nav.component';


@NgModule({
    declarations: [
        CSSComponent,
        // InstallationComponent,
        SecondaryNavComponent,
    ],

    imports: [
        CSSRoutingModule,
    ],
})
export class CSSModule {}
