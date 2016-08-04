import { inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { NewToDoComponent } from './new-to-do.component';


describe('New To-Do', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                NewToDoComponent,
            ],

            imports: [
                FormsModule,
            ],

            providers: [
                ToDoStore,
            ],
        });

        TestBed.compileComponents().catch((error: string) => console.error(error));
    });

    xit('can add an new to-do item', inject([ToDoStore], (toDoStore: ToDoStore) => {
        expect(toDoStore.items).toBeDefined();
    }));
});
