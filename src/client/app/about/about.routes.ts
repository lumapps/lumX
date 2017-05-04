import { Routes } from '@angular/router';

import { AboutComponent } from './about.component';


/**
 * The routes for the "About" module.
 *
 * @type {Routes}
 * @readonly
 * @constant
 * @default
 */
export const routes: Routes = [
    {
        component: AboutComponent,
        path: '',
    },
];
