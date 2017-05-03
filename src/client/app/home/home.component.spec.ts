/* tslint:disable:no-unused-expression */

import { TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.module';

import { HomeModule } from './home.module';

import { HomeComponent } from './home.component';


describe('Home', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HomeModule,
            ],

            providers: [
                HomeComponent,
            ],
        });

        TestBed.compileComponents().catch(console.error);
    });

    it('should be instanciated', inject([HomeComponent], (home: HomeComponent) => {
        expect(home).to.exist;
    }));


    afterEach(() => {
        // Nothing to do here.
    });
});
