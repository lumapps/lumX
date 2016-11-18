import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { ToDoComponent } from './to-do.component';
import { AppModule } from 'app.module';


describe('To-Do', () => {
    const component: ToDoComponent;
    const fixture: ComponentFixture<ToDoComponent>;

    const _ToDoStore: ToDoStore;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            exports: [
            ],

            imports: [
                AppModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                ToDoStore,
            ],
        });

        fixture = TestBed.createComponent(ToDoComponent);
        component = fixture.componentInstance;

        _ToDoStore = fixture.debugElement.injector.get(ToDoStore);
    });


    it('should have a to-do store with 3 items', () => {
        expect(_ToDoStore.items).toBeDefined();

        fixture.detectChanges();
        expect(_ToDoStore.items.length).toBe(3);
    });

    it('can add a to-do item in the to-do store', () => {
        _ToDoStore.reset();

        const newItemLabel: string = 'New item 1';
        let newId: number = _ToDoStore.add(new ToDoItem(newItemLabel));

        expect(_ToDoStore.items).toBeDefined();
        expect(_ToDoStore.items.length).toBe(1);
        expect(newId).toBe(0);

        expect(_ToDoStore.items[newId].id).toBe(newId);
        expect(_ToDoStore.items[newId].label).toBe(newItemLabel);
        expect(_ToDoStore.items[newId].done).toBeUndefined();
        expect(_ToDoStore.items[newId].due).toBeUndefined();


        const doneDate: Date = new Date();
        newId = _ToDoStore.add(new ToDoItem(newItemLabel, doneDate));

        expect(_ToDoStore.items).toBeDefined();
        expect(_ToDoStore.items.length).toBe(2);
        expect(newId).toBe(1);

        expect(_ToDoStore.items[newId].id).toBe(newId);
        expect(_ToDoStore.items[newId].label).toBe(newItemLabel);
        expect(_ToDoStore.items[newId].done).toBe(doneDate);
        expect(_ToDoStore.items[newId].due).toBeUndefined();
    });

    it('can remove a to-do item from the to-do store', () => {
        _ToDoStore.reset();

        const newItemLabel: string = 'New item 1';
        const doneDate: Date = new Date();
        let newId: number = _ToDoStore.add(new ToDoItem(newItemLabel, doneDate));
        let removedItem: ToDoItem = _ToDoStore.remove(newId);

        expect(_ToDoStore.items).toBeDefined();
        expect(_ToDoStore.items.length).toBe(0);

        expect(removedItem.id).toBe(newId);
        expect(removedItem.label).toBe(newItemLabel);
        expect(removedItem.done).toBe(doneDate);
        expect(removedItem.due).toBeUndefined();

        let removedItemFail: ToDoItem = _ToDoStore.remove(-1);
        expect(removedItemFail).toBeUndefined();
        removedItemFail = _ToDoStore.remove(999);
        expect(removedItemFail).toBeUndefined();
    });

    it('can reset to-do store', () => {
        const newItemLabel: string = 'New item 1';
        _ToDoStore.add(new ToDoItem(newItemLabel));

        _ToDoStore.reset();

        expect(_ToDoStore.items).toBeDefined();
        expect(_ToDoStore.items.length).toBe(0);
    });
});
