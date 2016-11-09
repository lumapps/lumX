import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { GettingStartedComponent } from './getting-started.component';
import { InstallationComponent } from './installation/installation.component';

import { GettingStartedRoutingModule } from './getting-started.routing.module';

import { SecondaryNavComponent } from 'demo/components/secondary-nav/secondary-nav.component';


@NgModule({
    declarations: [
        GettingStartedComponent,
        InstallationComponent,
        SecondaryNavComponent,
    ],

    imports: [
        CoreModule.forRoot(),
        GettingStartedRoutingModule,
    ],
})
export class GettingStartedModule {}
