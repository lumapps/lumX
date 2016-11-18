import { ComponentFixtureAutoDetect, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';


describe('Application', () => {
    const component: AppComponent;
    const fixture: ComponentFixture<AppComponent>;

    const _HttpService: HttpInterceptorService;
    const _TokenService: TokenService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            exports: [
            ],

            imports: [
                AppModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                HttpInterceptorService,
                TokenService,
                { provide: XHRBackend, useClass: MockBackend },
            ],
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        _TokenService = fixture.debugElement.injector.get(TokenService);
        _HttpService = fixture.debugElement.injector.get(HttpInterceptorService);
    });


    it('should request a token at startup', fakeAsync(() => {
        inject([XHRBackend], (backend: MockBackend) => {
            backend.connections.subscribe((connection: MockConnection) => {
                if (connection.request.url === '/token.json') {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: {
                            token: FAKE_TOKEN,
                        },
                        status: 200,
                        statusText: 'OK',
                        url: connection.request.url,
                    })));
                }
            });

            spyOn(_HttpService, 'get').and.callThrough();

            expect(_HttpService.get.calls.count()).toEqual(0);

            component.ngOnInit();
            tick();

            expect(_HttpService.get.calls.count()).toEqual(1);
            expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
            expect(_TokenService.isValid()).toBeTrue();
        })();
    }));
});
