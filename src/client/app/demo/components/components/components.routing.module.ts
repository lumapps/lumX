import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forChild([
            {
                component: ComponentsComponent,
                path: '',
            },
        ]),
    ],
})
export class ComponentsRoutingModule {}
