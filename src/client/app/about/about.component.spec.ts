/* tslint:disable:no-unused-expression */

import { TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai.module';
import { SinonSandbox, sandbox } from 'sinon';

import { ActivatedRoute, Data } from '@angular/router';

import { AboutModule } from './about.module';

import { AboutComponent } from './about.component';


describe('About', () => {
    /**
     * The sandbox environment.
     *
     * @type {SinonSandbox}
     */
    let sandboxEnv: SinonSandbox;


    beforeEach(() => {
        // Setup the sandbox environment.
        sandboxEnv = sandbox.create();


        TestBed.configureTestingModule({
            imports: [
                AboutModule,
            ],

            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: {
                            subscribe: (fn: (value: Data) => void): void => fn({
                                yourData: 'Hi there!',
                            }),
                        },
                    },
                },
                AboutComponent,
            ],
        });

        TestBed.compileComponents().catch(console.error);
    });


    it('should log an information on init', inject([AboutComponent], (about: AboutComponent) => {
        sandboxEnv.spy(console, 'info');


        expect(about).to.exist;
        expect(console.info).to.not.have.been.called;

        about.ngOnInit();

        expect(console.info).to.have.been.calledTwice;
    }));


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        sandboxEnv.restore();
    });
});
