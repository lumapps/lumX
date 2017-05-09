/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

import { FormsModule } from '@angular/forms';

import { ToDoStore } from 'to-do/to-do.store';

import { AppModule } from 'app.module';
import { NewToDoComponent } from './new-to-do.component';


describe('New To-Do', () => {
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
    });


    it('should be initialized', () => {
        expect(fixture).to.exist;
        expect(component).to.exist;
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
