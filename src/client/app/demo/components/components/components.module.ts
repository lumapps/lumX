import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';
import { CoreModule as DemoCoreModule } from 'demo/core/core.module';

import { ComponentsRoutingModule } from './components.routing.module';

import { ComponentsComponent } from './components.component';


@NgModule({
    declarations: [
        ComponentsComponent,
    ],

    imports: [
        CoreModule,
        DemoCoreModule,
        ComponentsRoutingModule,
    ],
})
export class ComponentsModule {}
