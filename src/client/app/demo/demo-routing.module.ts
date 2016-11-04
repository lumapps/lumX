import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components/components.component';
import { CSSComponent } from './components/css/css.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
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
                component: ComponentsComponent,
                path: 'components',
            },
            {
                component: CSSComponent,
                path: 'css',
            },
            {
                component: GettingStartedComponent,
                path: 'getting-started',
            },
        ]),
    ],
})
export class DemoRoutingModule {}
