import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forRoot([
            {
                component: NotFoundComponent,
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
