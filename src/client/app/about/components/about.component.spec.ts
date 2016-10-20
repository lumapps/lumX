import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';

import { AboutComponent } from 'about/components/about.module';


describe('About', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: {
                            subscribe: (fn: (value: Data) => void) => fn({
                                yourData: 'yolo',
                            }),
                        },
                    },
                },
                AboutComponent,
            ],
        });

        TestBed.compileComponents().catch((error: string) => console.error(error));
    });

    it('should log on init', inject([AboutComponent], (about: AboutComponent) => {
        spyOn(console, 'log');
        expect(console.log).not.toHaveBeenCalled();

        about.ngOnInit();

        expect(console.log).toHaveBeenCalled();
    }));
});
