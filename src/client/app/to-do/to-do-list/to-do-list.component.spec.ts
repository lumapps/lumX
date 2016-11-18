import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import * as dedent from 'dedent';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';

import { ToDoListComponent } from './to-do-list.component';
import { AppModule } from 'app.module';


describe('To-Do List', () => {
    const component: ToDoListComponent;
    const fixture: ComponentFixture<ToDoListComponent>;

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

        fixture = TestBed.createComponent(ToDoListComponent);
        component = fixture.componentInstance;

        _ToDoStore = fixture.debugElement.injector.get(ToDoStore);
    });


    it('can toggle the state of a to-do item', () => {
           _ToDoStore.reset();

           let notDone: number = _ToDoStore.add(new ToDoItem('Not done'));
           expect(_ToDoStore.items[notDone].done).toBeUndefined();

           const doneDate: Date = new Date();
           let done: number = _ToDoStore.add(new ToDoItem('Done', doneDate));
           expect(_ToDoStore.items[done].done).toBe(doneDate);

           let doneOn: Date = _ToDoStore.items[notDone].toggle();
           expect(_ToDoStore.items[notDone].done).toBe(doneOn);

           let wasDone: Date = _ToDoStore.items[done].toggle();
           expect(_ToDoStore.items[done].done).toBeUndefined();
           expect(wasDone).toBe(doneDate);
    });

    it('can display an item with a due date', () => {
           _ToDoStore.reset();

           const dueNotDoneLabel: string = 'Due/Not done';
           const dueDate: Date = new Date();
           let dueNotDone: number = _ToDoStore.add(new ToDoItem(dueNotDoneLabel, undefined, dueDate));

           let dueNotDoneItem: ToDoItem = _ToDoStore.items[dueNotDone];
           expect(dueNotDoneItem.due).toBe(dueDate);
           let dueNotDoneDisplay: string = _ToDoStore.items[dueNotDone].toString();
           expect(dueNotDoneDisplay).toBe(`[${dueNotDone}] - ${dueNotDoneLabel} (due ${dueNotDoneItem.due})`);


           const dueDoneLabel: string = 'Due/Done';
           const doneDate: Date = new Date();
           let dueDone: number = _ToDoStore.add(new ToDoItem(dueDoneLabel, doneDate, dueDate));

           let dueDoneItem: ToDoItem = _ToDoStore.items[dueDone];
           expect(dueDoneItem.due).toBe(dueDate);
           let dueDoneDisplay: string = _ToDoStore.items[dueDone].toString();
           expect(dueDoneDisplay).toBe(dedent`[${dueDone}] - ${dueDoneLabel} (due ${dueDoneItem.due}) \
                                              - done (${dueDoneItem.done})`);
    });
});
