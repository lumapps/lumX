import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { ToDoModule } from 'to-do/to-do.module';

import { HomeComponent } from './home.component';


/**
 * The Home module.
 *
 * Handle the home page
 */
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
export class HomeModule { }

