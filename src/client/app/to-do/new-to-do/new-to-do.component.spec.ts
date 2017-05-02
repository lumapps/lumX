/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai.module';

import { FormsModule } from '@angular/forms';

import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';
import { NewToDoComponent } from './new-to-do.component';


describe('New To-Do', () => {
    /**
     * The To-Do Store.
     *
     * @type {ToDoStore}
     */
    let _ToDoStore: ToDoStore;

    /**
     * The New To-Do component
     *
     * @type {NewToDoComponent}
     */
    let component: NewToDoComponent;
    /**
     * The New To-Do component test fixture.
     *
     * @type {ComponentFixture<NewToDoComponent>}
     */
    let fixture: ComponentFixture<NewToDoComponent>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                AppModule,
                FormsModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                ToDoStore,
            ],
        });

        fixture = TestBed.createComponent(NewToDoComponent);
        component = fixture.componentInstance;

        _ToDoStore = fixture.debugElement.injector.get(ToDoStore);
    });


    it('can add an new to-do item', () => {
        _ToDoStore.reset();
        expect(_ToDoStore.items).to.be.array();
        expect(_ToDoStore.items).to.be.ofSize(0);

        const newItemId: number = component.addItem();
        expect(newItemId).to.equal(0);
        expect(_ToDoStore.items).to.be.ofSize(1);
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
