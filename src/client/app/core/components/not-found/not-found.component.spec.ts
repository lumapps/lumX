/* tslint:disable:no-unused-expression */

import { TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.module';

import { NotFoundComponent } from './not-found.component';


describe('Not Found', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                NotFoundComponent,
            ],

            providers: [
                NotFoundComponent,
            ],
        });

        TestBed.compileComponents().catch(console.error);
    });

    it('should be instanciated', inject([NotFoundComponent], (notFound: NotFoundComponent) => {
        expect(notFound).to.exist;
    }));


    afterEach(() => {
        // Nothing to do here.
    });
});
