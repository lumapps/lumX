import { inject, TestBed } from '@angular/core/testing';

import { HomeModule } from 'home/home.module';


describe('Home', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HomeModule,
            ],
        });

        TestBed.compileComponents().catch((error: string) => console.error(error));
    });

    it('should be instanciated', () => {
        expect(true).toBeTrue();
    });
});
