/* tslint:disable:no-unused-expression */

import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';
import { SinonSandbox, sandbox } from 'sinon';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';


describe('Application startup', () => {
    /**
     * The sandbox environment.
     *
     * @type {SinonSandbox}
     */
    let sandboxEnv: SinonSandbox;


    /**
     * The HTTP Interceptor service.
     *
     * @type {HttpInterceptorService}
     */
    let _HttpInterceptorService: HttpInterceptorService;
    /**
     * The Token service.
     *
     * @type {TokenService}
     */
    let _TokenService: TokenService;


    /**
     * The App component
     *
     * @type {AppComponent}
     */
    let component: AppComponent;
    /**
     * The App component test fixture.
     *
     * @type {ComponentFixture<AppComponent>}
     */
    let fixture: ComponentFixture<AppComponent>;


    /**
     * Setup the Sinon fake backend.
     */
    function setupFakeBackend(): void {
        sandboxEnv.useFakeServer();
        sandboxEnv.server.respondWith('GET', /token.json/, [
            200, {
                'Content-Type': 'application/json',
            }, JSON.stringify({
                token: FAKE_TOKEN,
            }),
        ]);
        sandboxEnv.server.autoRespond = true;
        sandboxEnv.server.respondImmediately = true;
    }


    beforeEach(() => {
        // Setup the sandbox environment and the fake backend.
        sandboxEnv = sandbox.create();
        setupFakeBackend();

        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                AppModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                HttpInterceptorService,
                TokenService,
            ],
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        _TokenService = fixture.debugElement.injector.get(TokenService);
        _HttpInterceptorService = fixture.debugElement.injector.get(HttpInterceptorService);

        fixture.detectChanges();
    });


    it('should be initialized', () => {
        expect(fixture).to.exist;
        expect(component).to.exist;
    });

    it('should request a token at startup', fakeAsync(() => {
        // Setup the spies
        sandboxEnv.spy(_HttpInterceptorService, 'get');


        expect(_HttpInterceptorService.get).to.not.have.been.called;

        // Init the component
        component.ngOnInit();

        // Check that the component correctly initialized.
        expect(_HttpInterceptorService.get).to.have.been.calledOnce;
        expect(_TokenService.getToken()).to.equals(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;
    }));


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        sandboxEnv.restore();
    });
});
