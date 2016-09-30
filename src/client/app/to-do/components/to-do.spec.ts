import { inject, TestBed } from '@angular/core/testing';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';


describe('To-Do Store', () => {
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

    it('should have a to-do store', inject([ToDoStore], (toDoStore: ToDoStore) => {
        expect(toDoStore.items).toBeDefined();
    }));

    it('can add a to-do item in the to-do store', inject([ToDoStore], (toDoStore: ToDoStore) => {
        toDoStore.reset();


        const newItemLabel: string = 'New item 1';
        let newId: number = toDoStore.add(new ToDoItem(newItemLabel));

        expect(toDoStore.items).toBeDefined();
        expect(toDoStore.items.length).toBe(1);
        expect(newId).toBe(0);

        expect(toDoStore.items[newId].id).toBe(newId);
        expect(toDoStore.items[newId].label).toBe(newItemLabel);
        expect(toDoStore.items[newId].done).toBeUndefined();
        expect(toDoStore.items[newId].due).toBeUndefined();


        const doneDate: Date = new Date();
        newId = toDoStore.add(new ToDoItem(newItemLabel, doneDate));

        expect(toDoStore.items).toBeDefined();
        expect(toDoStore.items.length).toBe(2);
        expect(newId).toBe(1);

        expect(toDoStore.items[newId].id).toBe(newId);
        expect(toDoStore.items[newId].label).toBe(newItemLabel);
        expect(toDoStore.items[newId].done).toBe(doneDate);
        expect(toDoStore.items[newId].due).toBeUndefined();
    }));

    it('can remove a to-do item from the to-do store', inject([ToDoStore], (toDoStore: ToDoStore) => {
        toDoStore.reset();


        const newItemLabel: string = 'New item 1';
        const doneDate: Date = new Date();
        let newId: number = toDoStore.add(new ToDoItem(newItemLabel, doneDate));
        let removedItem: ToDoItem = toDoStore.remove(newId);

        expect(toDoStore.items).toBeDefined();
        expect(toDoStore.items.length).toBe(0);

        expect(removedItem.id).toBe(newId);
        expect(removedItem.label).toBe(newItemLabel);
        expect(removedItem.done).toBe(doneDate);
        expect(removedItem.due).toBeUndefined();
    }));

    it('can reset to-do store', inject([ToDoStore], (toDoStore: ToDoStore) => {
        const newItemLabel: string = 'New item 1';
        toDoStore.add(new ToDoItem(newItemLabel));

        toDoStore.reset();

        expect(toDoStore.items).toBeDefined();
        expect(toDoStore.items.length).toBe(0);
    }));
});
