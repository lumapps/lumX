import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutDemoComponent } from 'demo/about/components/about.component';
import { HomeDemoComponent } from 'demo/home/components/home.component';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forRoot([
            {
                loadChildren: 'demo/about/about.module#AboutDemoModule',
                path: 'about',
            },

            {
                component: HomeDemoComponent,
                path: '',
            },
            {
                component: NotFoundComponent,
                path: '**',
            },
        ]),
    ],
})
export class DemoRoutingModule {}
