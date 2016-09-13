import { provide } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Headers, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { CoreModule } from 'core/modules/core.module';
import { ITokenState } from 'core/reducers/token.reducer';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';

import { AppComponent } from './app.component';


describe('Application startup', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                HttpInterceptorService,
                provide(XHRBackend, {
                    useClass: MockBackend,
                }),
                TokenService,
            ],
        });

        TestBed.compileComponents().catch((error: string) => console.error(error));
    });

    it('should request a token', inject([XHRBackend, TokenService],
                                        (backend: MockBackend, tokenService: TokenService) => {
        const generatedToken: string = 'Generated Test Token';
        const mockedResponse: ResponseOptions = new ResponseOptions({
            body: {
                token: generatedToken,
            },
        });

        backend.connections.subscribe(
            (connection: MockConnection) => {
                if (connection.request.url === '/services/oauthtoken') {
                    connection.mockRespond(new Response(mockedResponse));
                }
            }
        );

        tokenService.token.subscribe((token: ITokenState) => {
            if (token && !token.needed) {
                expect(token.value).toBe(generatedToken);
            }
        });
    }));
});
