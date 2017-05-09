/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

import { HomeModule } from './home.module';

import { HomeComponent } from './home.component';


describe('Home', () => {
    /**
     * The New To-Do component
     *
     * @type {HomeComponent}
     */
    let component: HomeComponent;
    /**
     * The New To-Do component test fixture.
     *
     * @type {ComponentFixture<HomeComponent>}
     */
    let fixture: ComponentFixture<HomeComponent>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                HomeModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
            ],
        });

        fixture = TestBed.createComponent(HomeComponent);
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
