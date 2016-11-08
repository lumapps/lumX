import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'core/modules/core.module';

import { AboutComponent } from './about.component';


@NgModule({
    declarations: [
        AboutComponent,
    ],

    exports: [
        CoreModule,
        AboutComponent,
        RouterModule,
    ],

    imports: [
        CoreModule,
        RouterModule.forChild([
            {
                component: AboutComponent,
                path: '',
            },
        ]),
    ],

    providers: [
    ],
})
/**
 * The About module.
 */
export class AboutModule {}

