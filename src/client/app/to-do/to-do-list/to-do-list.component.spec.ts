/* tslint:disable:no-unused-expression */

import * as dedent from 'dedent';

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.module';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';
import { ToDoListComponent } from './to-do-list.component';


describe('To-Do List', () => {
    /**
     * The To-Do Store.
     *
     * @type {ToDoStore}
     */
    let _ToDoStore: ToDoStore;

    /**
     * The To-Do component
     *
     * @type {ToDoListComponent}
     */
    let component: ToDoListComponent;
    /**
     * The To-Do component test fixture.
     *
     * @type {ComponentFixture<ToDoListComponent>}
     */
    let fixture: ComponentFixture<ToDoListComponent>;


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

        fixture = TestBed.createComponent(ToDoListComponent);
        component = fixture.componentInstance;

        _ToDoStore = fixture.debugElement.injector.get(ToDoStore);
    });


    it('can toggle the state of a to-do item', () => {
        _ToDoStore.reset();

        const notDone: number = _ToDoStore.add(new ToDoItem('Not done'));
        expect(_ToDoStore.items[notDone]).to.exist;

        expect(_ToDoStore.items[notDone].done).to.be.undefined;

        const doneDate: Date = new Date();
        const done: number = _ToDoStore.add(new ToDoItem('Done', doneDate));
        expect(_ToDoStore.items[done]).to.exist;

        expect(_ToDoStore.items[done].done).to.equalDate(doneDate);

        const doneOn: Date = _ToDoStore.items[notDone].toggle();
        expect(_ToDoStore.items[notDone].done).to.equalDate(doneOn);

        const wasDone: Date = _ToDoStore.items[done].toggle();
        expect(_ToDoStore.items[done].done).to.be.undefined;
        expect(wasDone).equalDate(doneDate);
    });

    it('can display an item with a due date', () => {
        _ToDoStore.reset();

        const dueNotDoneLabel: string = 'Due/Not done';
        const dueDate: Date = new Date();
        const dueNotDone: number = _ToDoStore.add(new ToDoItem(dueNotDoneLabel, undefined, dueDate));
        expect(_ToDoStore.items[dueNotDone]).to.exist;

        const dueNotDoneItem: ToDoItem = _ToDoStore.items[dueNotDone];
        expect(dueNotDoneItem.due).to.equalDate(dueDate);
        const dueNotDoneDisplay: string = _ToDoStore.items[dueNotDone].toString();
        expect(dueNotDoneDisplay).to.equal(`[${dueNotDone}] - ${dueNotDoneLabel} (due ${dueNotDoneItem.due})`);

        const dueDoneLabel: string = 'Due/Done';
        const doneDate: Date = new Date();
        const dueDone: number = _ToDoStore.add(new ToDoItem(dueDoneLabel, doneDate, dueDate));
        expect(_ToDoStore.items[dueDone]).to.exist;

        const dueDoneItem: ToDoItem = _ToDoStore.items[dueDone];
        expect(dueDoneItem.due).to.equalDate(dueDate);
        const dueDoneDisplay: string = _ToDoStore.items[dueDone].toString();
        expect(dueDoneDisplay).to.equal(dedent`[${dueDone}] - ${dueDoneLabel} (due ${dueDoneItem.due}) \
                                               - done (${dueDoneItem.done})`);
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
