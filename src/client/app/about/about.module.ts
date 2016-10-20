import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { AboutComponent } from 'about/components/about.component';


@NgModule({
    declarations: [
        AboutComponent,
    ],

    exports: [
        CoreModule,
        AboutComponent,
    ],

    imports: [
        CoreModule,
    ],
})
/**
 * The About module.
 */
export class AboutModule {}

