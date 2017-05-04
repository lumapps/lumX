/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';
import { ToDoComponent } from './to-do.component';


describe('To-Do', () => {
    /**
     * The To-Do Store.
     *
     * @type {ToDoStore}
     */
    let _ToDoStore: ToDoStore;

    /**
     * The To-Do component
     *
     * @type {ToDoComponent}
     */
    let component: ToDoComponent;
    /**
     * The To-Do component test fixture.
     *
     * @type {ComponentFixture<ToDoComponent>}
     */
    let fixture: ComponentFixture<ToDoComponent>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
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
        expect(_ToDoStore.items).to.be.an('array');

        fixture.detectChanges();

        expect(_ToDoStore.items).to.be.ofSize(3);
    });

    it('can add a to-do item in the to-do store', () => {
        _ToDoStore.reset();

        const newItemLabel: string = 'New item 1';
        let newId: number = _ToDoStore.add(new ToDoItem(newItemLabel));

        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.ofSize(1);
        expect(newId).to.equal(0);

        expect(_ToDoStore.items[newId].id).to.equal(newId);
        expect(_ToDoStore.items[newId].label).to.equal(newItemLabel);
        expect(_ToDoStore.items[newId].done).to.be.undefined;
        expect(_ToDoStore.items[newId].due).to.be.undefined;


        const doneDate: Date = new Date();
        newId = _ToDoStore.add(new ToDoItem(newItemLabel, doneDate));

        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.ofSize(2);
        expect(newId).to.equal(1);

        expect(_ToDoStore.items[newId].id).to.equal(newId);
        expect(_ToDoStore.items[newId].label).to.equal(newItemLabel);
        expect(_ToDoStore.items[newId].done).to.equalDate(doneDate);
        expect(_ToDoStore.items[newId].due).to.be.undefined;
    });

    it('can remove a to-do item from the to-do store', () => {
        _ToDoStore.reset();

        const newItemLabel: string = 'New item 1';
        const doneDate: Date = new Date();
        const newId: number = _ToDoStore.add(new ToDoItem(newItemLabel, doneDate));
        const removedItem: ToDoItem = _ToDoStore.remove(newId);

        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.empty;

        expect(removedItem.id).to.equal(newId);
        expect(removedItem.label).to.equal(newItemLabel);
        expect(removedItem.done).to.equalDate(doneDate);
        expect(removedItem.due).to.be.undefined;

        let removedItemFail: ToDoItem = _ToDoStore.remove(-1);
        expect(removedItemFail).to.be.undefined;
        removedItemFail = _ToDoStore.remove(999);
        expect(removedItemFail).to.be.undefined;
    });

    it('can reset to-do store', () => {
        const newItemLabel: string = 'New item 1';
        _ToDoStore.add(new ToDoItem(newItemLabel));

        _ToDoStore.reset();

        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.empty;
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
