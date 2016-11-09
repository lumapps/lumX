import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';

import { HomeComponent } from './components/home/home.component';


@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forRoot([
            {
                component: HomeComponent,
                path: '',
            },
            {
                component: NotFoundComponent,
                path: '**',
            },
        ],
    )],
})
export class DemoRoutingModule {}
