/* tslint:disable:no-unused-expression */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';
import { SinonSandbox, SinonSpy, sandbox } from 'sinon';

import { IHmrStore } from 'core/types/hmr-store.type';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

import { routes } from './app.routes';


describe('Application startup', () => {
    /**
     * The sandbox environment.
     *
     * @type {SinonSandbox}
     */
    let sandboxEnv: SinonSandbox;

    /**
     * The mockup of the HMRStore.
     *
     * @type {IHmrStore}
     */
    let mockHmrStore: IHmrStore;


    /**
     * The App component test fixture.
     *
     * @type {ComponentFixture<AppComponent>}
     */
    let fixture: ComponentFixture<AppComponent>;


    beforeEach(() => {
        // Setup the sandbox environment and the fake backend.
        sandboxEnv = sandbox.create();

        mockHmrStore = {
            disposeOldHosts: undefined,
            state: 'toto',
        };

        TestBed.configureTestingModule({
            imports: [
                AppModule,
            ],

            providers: [
                AppModule,
            ],
        });

        fixture = TestBed.createComponent(AppComponent);
    });


    it('should have at least one route', () => {
        expect(routes).to.be.an('array');
        expect(routes).to.have.length.above(0);
    });

    describe('Hot Module Reload', () => {
        it('should handle initialization of the HMR', inject([AppModule], (appModule: AppModule) => {
            expect(appModule).to.exist;

            sandboxEnv.spy(appModule.appRef, 'tick');
            expect(appModule.appRef.tick).to.not.have.been.called;


            appModule.hmrOnInit(undefined);
            expect(appModule.appRef.tick).to.not.have.been.called;
            appModule.hmrOnInit({});
            expect(appModule.appRef.tick).to.not.have.been.called;
            appModule.hmrOnInit({
                state: '',
            });
            expect(appModule.appRef.tick).to.not.have.been.called;

            appModule.hmrOnInit(mockHmrStore);
            expect(appModule.appRef.tick).to.have.been.calledOnce;
        }));

        it('should handle destroying of the HMR', inject([AppModule], (appModule: AppModule) => {
            expect(appModule).to.exist;


            // tslint:disable-next-line:no-any
            appModule.appRef.components.push(fixture.componentRef);

            appModule.hmrOnDestroy(mockHmrStore);
            expect(mockHmrStore.disposeOldHosts).to.be.a('function');

            const disposeOldHosts: SinonSpy = sandboxEnv.spy(mockHmrStore, 'disposeOldHosts');
            expect(disposeOldHosts).to.not.have.been.called;

            appModule.hmrAfterDestroy(mockHmrStore);
            expect(disposeOldHosts).to.have.been.calledOnce;
            expect(mockHmrStore.disposeOldHosts).to.not.exist;
        }));
    });


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        sandboxEnv.restore();
    });
});
