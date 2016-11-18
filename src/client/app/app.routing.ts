import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from 'home/home.component';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forRoot([
            {
                loadChildren: 'about/about.module#AboutModule',
                path: 'about',
            },

            {
                component: HomeComponent,
                path: '',
            },
            {
                component: NotFoundComponent,
                path: '**',
            },
        ]),
    ],
})
export class AppRouting {}
