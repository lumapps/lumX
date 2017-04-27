import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


export const routes: Routes = [
    {
        component: HomeComponent,
        path: '',
    },


    {
        loadChildren: 'about/about.module#AboutModule',
        path: 'about',
    },


    {
        component: NotFoundComponent,
        path: '**',
    },
];
