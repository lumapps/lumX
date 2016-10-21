import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from 'about/components/about.component';
import { HomeComponent } from 'home/components/home.component';

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
export class AppRoutingModule {}
