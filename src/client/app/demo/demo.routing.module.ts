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
                loadChildren: './components/components/components.module#ComponentsModule',
                path: 'components',
            },
            {
                loadChildren: './components/css/css.module#CSSModule',
                path: 'css',
            },
            {
                loadChildren: './components/getting-started/getting-started.module#GettingStartedModule',
                path: 'getting-started',
            },
            {
                component: NotFoundComponent,
                path: '**',
            },
        ],
    )],
})
export class DemoRoutingModule {}
