/* tslint:disable:no-unused-expression max-file-line-count */

import { TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

import { CoreModule } from 'core/modules/core.module';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


describe('To-Do Store', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                ToDoStore,
            ],
        });


        const _ToDoStore: ToDoStore = TestBed.get(ToDoStore);
        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.empty;
    });


    it('should be defined', inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(ToDoStore).to.exist;
        expect(_ToDoStore).to.exist;
    }));

    it('should have a list of to-do items', inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(_ToDoStore).to.have.property('items');
    }));

    it('should be able to check if the list is empty', inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(_ToDoStore).to.respondTo('isEmpty');
        expect(_ToDoStore.isEmpty()).to.be.true;

        _ToDoStore.add(new ToDoItem('Winter'));
        expect(_ToDoStore.isEmpty()).to.be.false;

        _ToDoStore.reset();
        expect(_ToDoStore.isEmpty()).to.be.true;

        const newToDoItemId: number = _ToDoStore.add(new ToDoItem('Is coming'));
        expect(_ToDoStore.isEmpty()).to.be.false;

        _ToDoStore.remove(newToDoItemId);
        expect(_ToDoStore.isEmpty()).to.be.true;
    }));

    it('should be able to add a new to-do-item and increment id', inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(_ToDoStore).to.respondTo('add');

        const newToDoItem: ToDoItem = new ToDoItem('Winter');
        let newToDoItemId: number = _ToDoStore.add(newToDoItem);
        expect(newToDoItemId).to.equal(0);
        expect(_ToDoStore.items).to.have.length(newToDoItemId + 1);
        expect(_ToDoStore.items[newToDoItemId]).to.equal(newToDoItem);

        newToDoItemId = _ToDoStore.add(new ToDoItem('Is coming'));
        expect(newToDoItemId).to.equal(1);
        expect(_ToDoStore.items).to.have.length(2);

        _ToDoStore.remove(1);
        expect(_ToDoStore.items).to.have.length(1);

        newToDoItemId = _ToDoStore.add(new ToDoItem('Ned Stark'));
        expect(newToDoItemId).to.equal(2);
        expect(_ToDoStore.items).to.have.length(2);
    }));

    it(`should be able to remove a to-do-item with it's id`, inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(_ToDoStore).to.respondTo('remove');

        const newToDoItem: ToDoItem = new ToDoItem('Winter');
        let newToDoItemId: number = _ToDoStore.add(newToDoItem);
        expect(_ToDoStore.items).to.have.length(1);

        const removedToDoItem: ToDoItem = _ToDoStore.remove(newToDoItemId);
        expect(removedToDoItem).to.equal(newToDoItem);

        expect(_ToDoStore.items).to.be.empty;

        newToDoItemId = _ToDoStore.add(newToDoItem);
        expect(newToDoItemId).to.equal(1);
        expect(_ToDoStore.items).to.have.length(1);

        let notFoundItem: ToDoItem = _ToDoStore.remove(-1);
        expect(notFoundItem).to.be.undefined;
        expect(_ToDoStore.items).to.have.length(1);

        notFoundItem = _ToDoStore.remove(999);
        expect(notFoundItem).to.be.undefined;
        expect(_ToDoStore.items).to.have.length(1);

        expect(_ToDoStore.remove(newToDoItemId)).to.equal(newToDoItem);
        expect(_ToDoStore.items).to.be.empty;
    }));

    it('should be able to reset the to-do items list and the ids', inject([ToDoStore], (_ToDoStore: ToDoStore) => {
        expect(_ToDoStore).to.respondTo('reset');

        let newToDoItemId: number = _ToDoStore.add(new ToDoItem('Winter'));
        expect(_ToDoStore.items).to.have.length(1);
        expect(newToDoItemId).to.equal(0);

        _ToDoStore.reset();
        expect(_ToDoStore.items).to.be.an('array');
        expect(_ToDoStore.items).to.be.empty;

        newToDoItemId = _ToDoStore.add(new ToDoItem('Is coming'));
        expect(_ToDoStore.items).to.have.length(1);
        expect(newToDoItemId).to.equal(0);
    }));


    afterEach(() => {
        // Nothing to do here.
    });
});
