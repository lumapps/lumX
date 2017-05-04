import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'core/modules/core.module';

import { routes } from './about.routes';

import { AboutComponent } from './about.component';


/**
 * The "About" module.
 */
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
        RouterModule.forChild(routes),
    ],

    providers: [
    ],
})
export class AboutModule {
    /**
     * The routes of the module.
     *
     * @type {Array[Object]}
     * @public
     * @static
     */
    public static routes: {}[] = routes;
}

