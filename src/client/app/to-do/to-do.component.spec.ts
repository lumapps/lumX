/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

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


    it('should be initialized', () => {
        expect(fixture).to.exist;
        expect(component).to.exist;
    });

    it('should have a to-do store with 3 items', () => {
        expect(_ToDoStore.items).to.be.an('array');

        fixture.detectChanges();

        expect(_ToDoStore.items).to.have.length(3);
    });

    it('should not add default items after first initialization', () => {
        expect(_ToDoStore.items).to.be.an('array');

        fixture.detectChanges();

        expect(_ToDoStore.items).to.have.length(3);

        component.ngOnInit();

        expect(_ToDoStore.items).to.have.length(3);
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
