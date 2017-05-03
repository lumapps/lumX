import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


/**
 * The routes for the application.
 *
 * @type {Array[Object]}
 * @readonly
 * @constant
 * @default
 */
export const routes: Routes = [
    {
        component: HomeComponent,
        path: '',
    },


    {
        /* istanbul ignore next */
        loadChildren: 'about/about.module#AboutModule',
        path: 'about',
    },


    {
        component: NotFoundComponent,
        path: '**',
    },
];
