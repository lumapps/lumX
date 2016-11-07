import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { ToDoModule } from 'to-do/to-do.module';

import { HomeComponent } from './components/home.component';


@NgModule({
    declarations: [
        HomeComponent,
    ],

    exports: [
        CoreModule,
        HomeComponent,
        ToDoModule,
    ],

    imports: [
        CoreModule,
        ToDoModule,
    ],

    providers: [
    ],
})
/**
 * The Home module.
 */
export class HomeModule { }

