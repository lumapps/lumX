import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GettingStartedComponent } from './getting-started.component';

import { ContributeComponent } from './contribute/contribute.component';
import { CustomizationComponent } from './customization/customization.component';
import { InstallationComponent } from './installation/installation.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forChild([
            {
                children: [
                    {
                        path: '',
                        redirectTo: 'installation',
                    },
                    {
                        component: ContributeComponent,
                        path: 'contribute',
                    },
                    {
                        component: CustomizationComponent,
                        path: 'customization',
                    },
                    {
                        component: InstallationComponent,
                        path: 'installation',
                    },
                ],
                component: GettingStartedComponent,
                path: '',
            },
        ]),
    ],
})
export class GettingStartedRoutingModule {}
