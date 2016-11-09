import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { ContributeComponent } from './contribute/contribute.component';
// import { CustomizationComponent } from './customization/customization.component';


import { GettingStartedComponent } from './getting-started.component';
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
                        component: InstallationComponent,
                        path: 'installation',
                    },
                ],
                component: GettingStartedComponent,
                path: 'getting-started',
            },
        ]),
    ],
})
export class GettingStartedRoutingModule {}
