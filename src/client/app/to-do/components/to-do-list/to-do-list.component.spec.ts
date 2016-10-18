import { inject, TestBed } from '@angular/core/testing';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';


describe('To-Do List', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
            ],

            providers: [
                ToDoStore,
            ],
        });

        TestBed.compileComponents().catch((error: string) => console.error(error));
    });

    it('can toggle the state of a to-do item', inject([ToDoStore], (toDoStore: ToDoStore) => {
           toDoStore.reset();


           let notDone: number = toDoStore.add(new ToDoItem('Not done'));

           const doneDate: Date = new Date();
           let done: number = toDoStore.add(new ToDoItem('Done', doneDate));

           expect(toDoStore.items[notDone].done).toBeUndefined();
           expect(toDoStore.items[done].done).toBe(doneDate);

           let doneOn: Date = toDoStore.items[notDone].toggle();
           let wasDone: Date = toDoStore.items[done].toggle();

           expect(toDoStore.items[notDone].done).toBe(doneOn);
           expect(toDoStore.items[done].done).toBeUndefined();
           expect(wasDone).toBe(doneDate);
    }));
});
