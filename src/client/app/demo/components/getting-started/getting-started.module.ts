import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';
import { CoreModule as DemoCoreModule } from 'demo/core/core.module';

import { GettingStartedRoutingModule } from './getting-started.routing.module';

import { GettingStartedComponent } from './getting-started.component';

import { ContributeComponent } from './contribute/contribute.component';
import { CustomizationComponent } from './customization/customization.component';
import { InstallationComponent } from './installation/installation.component';


@NgModule({
    declarations: [
        GettingStartedComponent,
        ContributeComponent,
        CustomizationComponent,
        InstallationComponent,
    ],

    imports: [
        CoreModule,
        DemoCoreModule,
        GettingStartedRoutingModule,
    ],
})
export class GettingStartedModule {}
