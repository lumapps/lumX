/* tslint:disable:no-unused-expression */

// You can also import for exemple: async', 'fakeAsync', 'tick', ...
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';
// If you need anything from Sinon, import it here. For example:
// import { SinonSandbox, sandbox } from 'sinon';

// If you need to import any service or other, import it here.

// If you need another specific module (core module, ...), import it here.

import { AppComponent } from './app.component';

// If you need anything else, import it here.

describe('App', () => {
    // If you want to have Sinon's spies, stubs, mocks or fake servers, use a sandbox.
    // let sandboxEnv: SinonSandbox;

    // If you want to get any service.
    // let myService: MyService;

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;


    // If you want to setup a fake server.
    /*
    function setupFakeBackend(): void {
        sandboxEnv.useFakeServer();
        sandboxEnv.server.respondWith(...);
        sandboxEnv.server.autoRespond = true;
        sandboxEnv.server.respondImmediately = true;
    }
    */


    beforeEach(() => {
        // Setup the sandbox environment and the fake backend if you need.
        // sandboxEnv = sandbox.create();
        // setupFakeBackend();

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                // If your module have anything else to declare, add it here.
            ],

            imports: [
                // If you need to import anything for your tests, add it here. For example:
                // MyModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                // If you need any other provider for your tests, add it here. For example:
                // MyService,
                // You can also declare services doubles (stub, mockup, ...) here:
                // { provide: MyService, useValue: myServiceStub },
                // You can even add component so that they can be injected in your test functions.
            ],
        });


        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        // If you want to use any service, remember to get it from either the root injector:
        // myService = TestBed.get(MyService);
        // Or the component injector:
        // myService = fixture.debugElement.injector.get(MyService);

        // You can also declare spies here:
        // sandboxEnv.spy(myService, 'myMethod');

        // This is not required here as 'ComponentFixtureAutoDetect' is enabled.
        // However, it's always good to be explicit.
        // Also, remember to call 'fixture.detectChanges();' anytime you want to update the component state.
        fixture.detectChanges();
    });

    // For more info on how to test in Angular2, see https://angular.io/docs/ts/latest/guide/testing.html.
    it('should have a test written here', () => {
        // If you have defined spies, you can check them:;
        // expect(myService.myMethod).to.not.have.been.called;

        // You can simulate the passage of time:
        // tick();

        // If you have defined spies, you can check them again:;
        // expect(myService.myMethod).to.have.been.calledOnce;

        expect(component).to.exist;
    });


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        // sandboxEnv.restore();
    });
});
