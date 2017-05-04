import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';

import { ToDoStore } from './to-do.store';

import { NewToDoComponent } from './new-to-do/new-to-do.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ToDoComponent } from './to-do.component';


/**
 * The "ToDo" module.
 */
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
export class ToDoModule {}

