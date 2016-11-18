import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import { ToDoStore } from 'to-do/to-do.store';

import { NewToDoComponent } from './new-to-do.component';
import { AppModule } from 'app.module';


describe('New To-Do', () => {
    const component: NewToDoComponent;
    const fixture: ComponentFixture<NewToDoComponent>;

    const _ToDoStore: ToDoStore;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            exports: [
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
        expect(_ToDoStore.items.length).toBe(0);

        let newItemId: number = component.addItem();
        expect(newItemId).toBe(0);
        expect(_ToDoStore.items.length).toBe(1);
    });
});
