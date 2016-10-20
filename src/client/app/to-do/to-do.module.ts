import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { ToDoStore } from 'to-do/to-do.store';

import { NewToDoComponent } from 'to-do/components/new-to-do/new-to-do.component';
import { ToDoListComponent } from 'to-do/components/to-do-list/to-do-list.component';
import { ToDoComponent } from 'to-do/components/to-do.component';


@NgModule({
    declarations: [
        NewToDoComponent,
        ToDoComponent,
        ToDoListComponent,
    ],

    exports: [
        CoreModule,
        ToDoComponent,
    ],

    imports: [
        CoreModule,
    ],

    providers: [
        ToDoStore,
    ],
})
/**
 * The ToDo module.
 */
export class ToDoModule {}

