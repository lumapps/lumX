/* tslint:disable:no-unused-expression max-file-line-count */

import { expect } from 'core/testing/chai-unit.utils';

import { ToDoItem } from 'to-do/to-do-item.model';


describe('To-Do Item', () => {
    beforeEach(() => {
        // Nothing to do here.
    });


    it('should be defined', () => {
        expect(ToDoItem).to.exist;
    });

    it('should have an id', () => {
        const toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem).to.have.property('id');
        expect(toDoItem.id).to.be.undefined;

        const toDoItemId: number = 0;
        toDoItem.id = toDoItemId;
        expect(toDoItem.id).to.equal(toDoItemId);
    });

    it('should have a label, defined at construction', () => {
        const toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem).to.have.property('label', 'Winter');
    });

    it('should have a done date, definable at construction if needed', () => {
        let toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem).to.have.property('done');
        expect(toDoItem.done).to.be.undefined;

        let doneDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate);
        expect(toDoItem.done).to.equal(doneDate);

        doneDate = new Date();
        const dueDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate, dueDate);
        expect(toDoItem.done).to.equal(doneDate);
    });

    it('should have a due date, definable at construction if needed', () => {
        let toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem).to.have.property('due');
        expect(toDoItem.due).to.be.undefined;

        let dueDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', undefined, dueDate);
        expect(toDoItem.due).to.equal(dueDate);

        dueDate = new Date();
        const doneDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate, dueDate);
        expect(toDoItem.due).to.equal(dueDate);
    });

    it('should be possible to mark an undone to-do item as done', () => {
        let toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem.done).to.be.undefined;

        const firstDoneDate: Date = toDoItem.do();
        expect(firstDoneDate).to.exist;
        expect(toDoItem.done).to.equal(firstDoneDate);

        let newDoneDate: Date = toDoItem.do();
        expect(newDoneDate).to.exist;
        expect(newDoneDate).to.equal(firstDoneDate);
        expect(toDoItem.done).to.equal(firstDoneDate);


        const doneDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate);
        expect(toDoItem.done).to.equal(doneDate);

        newDoneDate = toDoItem.do();
        expect(newDoneDate).to.exist;
        expect(newDoneDate).to.equal(doneDate);
        expect(toDoItem.done).to.equal(doneDate);
    });

    it('should be possible to mark a done to-do item as not done', () => {
        let toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem.done).to.be.undefined;

        let doneDate: Date = toDoItem.do();
        expect(doneDate).to.exist;
        expect(toDoItem.done).to.equal(doneDate);

        let wasDoneDate: Date = toDoItem.unDo();
        expect(wasDoneDate).to.exist;
        expect(wasDoneDate).to.equal(doneDate);
        expect(toDoItem.done).to.be.undefined;

        wasDoneDate = toDoItem.unDo();
        expect(wasDoneDate).to.be.undefined;
        expect(toDoItem.done).to.be.undefined;


        doneDate = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate);
        expect(toDoItem.done).to.equal(doneDate);

        wasDoneDate = toDoItem.unDo();
        expect(wasDoneDate).to.exist;
        expect(wasDoneDate).to.equal(doneDate);
        expect(toDoItem.done).to.be.undefined;

        wasDoneDate = toDoItem.unDo();
        expect(wasDoneDate).to.be.undefined;
        expect(toDoItem.done).to.be.undefined;
    });

    it('should be possible to toggle a to-do item', () => {
        let toDoItem: ToDoItem = new ToDoItem('Winter');
        expect(toDoItem.done).to.be.undefined;

        const firstDoneDate: Date = toDoItem.toggle();
        expect(firstDoneDate).to.exist;
        expect(toDoItem.done).to.equal(firstDoneDate);

        let firstWasDoneDate: Date = toDoItem.toggle();
        expect(firstWasDoneDate).to.exist;
        expect(firstWasDoneDate).to.equal(firstDoneDate);
        expect(toDoItem.done).to.be.undefined;

        let newDoneDate: Date = toDoItem.toggle();
        expect(newDoneDate).to.exist;
        expect(newDoneDate).to.not.equal(firstDoneDate);
        expect(toDoItem.done).to.equal(newDoneDate);

        let wasDoneDate: Date = toDoItem.toggle();
        expect(wasDoneDate).to.exist;
        expect(wasDoneDate).to.equal(newDoneDate);
        expect(wasDoneDate).to.not.equal(firstWasDoneDate);
        expect(toDoItem.done).to.be.undefined;


        const doneDate: Date = new Date();
        toDoItem = new ToDoItem('Is coming', doneDate);
        expect(toDoItem.done).to.equal(doneDate);

        firstWasDoneDate = toDoItem.toggle();
        expect(firstWasDoneDate).to.exist;
        expect(firstWasDoneDate).to.equal(doneDate);
        expect(toDoItem.done).to.be.undefined;

        newDoneDate = toDoItem.toggle();
        expect(newDoneDate).to.exist;
        expect(toDoItem.done).to.equal(newDoneDate);
        expect(newDoneDate).to.not.equal(doneDate);

        wasDoneDate = toDoItem.toggle();
        expect(wasDoneDate).to.exist;
        expect(wasDoneDate).to.equal(newDoneDate);
        expect(wasDoneDate).to.not.equal(doneDate);
        expect(toDoItem.done).to.be.undefined;
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
