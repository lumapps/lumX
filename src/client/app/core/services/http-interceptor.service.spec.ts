import { inject, TestBed } from '@angular/core/testing';
import { Http, RequestOptions, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';

import { CoreModule } from 'core/modules/core.module';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';


describe('HTTP-Interceptor Service', () => {
    const _HttpInterceptorService: HttpInterceptorService;
    const _HttpService: Http;
    const _TokenService: TokenService;

    const urlToTest: string = '/';
    const body: string = 'My test body';
    const defaultRequestOptions: RequestOptions;
    const baseRequestOptions: RequestOptions = new RequestOptions({
        method: 'GET',
        body,
    });

    const errorMessage: string = 'Not authorized';
    const errorUrl: string = '401';
    const methods: string[] = ['delete', 'get', 'head', 'patch', 'options', 'post', 'put', 'request'];

    /**
     * The number of mocked failed token.
     *
     * @type {string}
     */
    let failedToken: number = 0;


    /**
     * Setup the mock backend for retries tests.
     *
     * @param {MockBackend} backend   The mock backend instance.
     * @param {number}      retries   The number of retries we want to use.
     * @param {number}      failToken The number of failed token we want to send.
     */
    function setupMockBackend(backend: MockBackend, retries: number = 5, failToken: number = 0): void {
        let attempts: number = 0;
        failedToken = 0;

        backend.connections.subscribe((connection: MockConnection) => {
            if (connection.request.url.indexOf(errorUrl) > -1) {
                if (attempts < retries) {
                    attempts++;

                    connection.mockError(new Response(new ResponseOptions({
                        status: parseInt(errorUrl, 10),
                        statusText: errorMessage,
                        url: connection.request.url,
                    })));
                } else {
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200
                        statusText: 'OK',
                        url: connection.request.url,
                    })));
                }
            } else if (connection.request.url === '/token.json') {
                let token: string = FAKE_TOKEN;
                let status: number = 200;
                let statusText: string = 'OK';
                if (failedToken < failToken) {
                    token = '';
                    status = 500;
                    statusText = 'Internal Server Error';

                    failedToken++;
                }

                connection.mockRespond(new Response(new ResponseOptions({
                    body: { token },
                    status,
                    statusText,
                    url: connection.request.url,
                })));
            }
        });
    }


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            exports: [
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                HttpInterceptorService,
                TokenService,
                { provide: XHRBackend, useClass: MockBackend },
            ],
        });

        _TokenService = TestBed.get(TokenService);
        _HttpInterceptorService = TestBed.get(HttpInterceptorService);
        _HttpService = TestBed.get(Http);

        defaultRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
    });


    it('should compute the HTTP request options with authorization bearer', () => {
        expect(defaultRequestOptions).toBeDefined();
        expect(defaultRequestOptions.headers).toBeDefined();
        expect(defaultRequestOptions.headers.get('Content-Type')).toBe('application/json');
        expect(defaultRequestOptions.headers.get('Authorization')).toBeNull();

        let newRequestOptions: RequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, false);
        expect(newRequestOptions.body).toBe(body);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, true);
        expect(newRequestOptions.body).toBe('');
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
        expect(newRequestOptions.body).toBeNull();
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, true);
        expect(newRequestOptions.body).toBe('');

        _TokenService.setToken(FAKE_TOKEN);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
        expect(baseRequestOptions.headers.get('Authorization')).toBe('Bearer ' + FAKE_TOKEN);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, false);
        expect(baseRequestOptions.headers.get('Authorization')).toBe('Bearer ' + FAKE_TOKEN);
    });

    for (let i: number = 1, length: number = methods.length; i <= length; i++) {
        const method: string = methods[i - 1] || 'get';

        it(`should be able to make a "${method.toUpperCase()}" request`, () => {
            let methodSpy: jasmine.Spy = spyOn(_HttpService, method).and.callThrough();

            let requestOptions: RequestOptions = (method === 'get') ?
                _HttpInterceptorService.getRequestOptionArgs(undefined, true) : defaultRequestOptions;

            if (method === 'patch' || method === 'post' || method === 'put') {
                _HttpInterceptorService[method](urlToTest, body);
                expect(methodSpy).toHaveBeenCalledWith(urlToTest, body, requestOptions);
            } else {
                _HttpInterceptorService[method](urlToTest);
                expect(methodSpy).toHaveBeenCalledWith(urlToTest, requestOptions);
            }
        });

        const retries: number = (i <= 5) ? i : 0;
        // Compute the waited number of calls of the 'get' function
        // When we are testing the 'get' method, we should add the 'get' of the token to the 'get' tested.
        // In any other method testing, only count the number of the token 'get'
        const supposedGetCalls: number = (method === 'get') ? ((retries * 2) + 1) : retries;
        const supposedMethodCalls: number = (method === 'get' || method === 'request') ?
            ((retries * 2) + 1) : (retries + 1);

        it(`can retry ${retries} "${method}" on 401 errors`, (done: () => void) => {
            inject([XHRBackend], (backend: MockBackend) => {
                setupMockBackend(backend, retries);

                if (method !== 'get') {
                    spyOn(_HttpService, 'get').and.callThrough();
                }
                let methodSpy: jasmine.Spy = spyOn(_HttpService, method).and.callThrough();
                spyOn(console, 'error');

                let responseObservable: Observable<Response> = _HttpInterceptorService[method](errorUrl);
                responseObservable.subscribe(
                    (response: Response) => {
                        expect(_HttpService.get.calls.count()).toEqual(supposedGetCalls, 'refresh of the token');
                        expect(methodSpy.calls.count()).toEqual(supposedMethodCalls, 'tries');

                        expect(console.error.calls.count()).toEqual(failedToken, 'error displays');

                        expect(response.url).toEqual(errorUrl);
                        expect(response.status).toEqual(200);
                        expect(response.statusText).toEqual('OK');

                        done();
                    },
                    () => expect(true).toBe(false),
                );
            })();
        });

        it(`should fail after 5 "${method}" retries on 401 errors`, (done: () => void) => {
            inject([XHRBackend], (backend: MockBackend) => {
                const retriesForFail: number = 6;
                setupMockBackend(backend, retriesForFail, false);

                const supposedGetCallsForFail: number = (method === 'get') ?
                    ((retriesForFail * 2) - 1) : retriesForFail - 1;
                const supposedMethodCallsForFail: number = (method === 'get' || method === 'request') ?
                    ((retriesForFail * 2) - 1) : retriesForFail;

                if (method !== 'get') {
                    spyOn(_HttpService, 'get').and.callThrough();
                }
                let methodSpy: jasmine.Spy = spyOn(_HttpService, method).and.callThrough();
                spyOn(console, 'error');

                let responseObservable: Observable<Response> = _HttpInterceptorService[method](errorUrl);
                responseObservable.subscribe(
                    () => expect(true).toBe(false),
                    (response: Response) => {
                        expect(_HttpService.get.calls.count()).toEqual(supposedGetCallsForFail, 'token refresh');
                        expect(methodSpy.calls.count()).toEqual(supposedMethodCallsForFail, 'tries');

                        expect(console.error.calls.count()).toEqual(failedToken, 'error displays');

                        expect(response.url).toEqual(errorUrl);
                        expect(response.status).toEqual(parseInt(errorUrl, 10));
                        expect(response.statusText).toEqual(errorMessage);

                        done();
                    },
                );
            })();
        });
    }

    it('should pass any other backend error', (done: () => void) => {
        inject([XHRBackend], (backend: MockBackend) => {
            const errorsToTest: { number: string } = {
                404: 'Not found',
                403: 'Forbidden',
                500: 'Internal Server Error',
            };

            backend.connections.subscribe((connection: MockConnection) => {
                if (errorsToTest[connection.request.url] !== undefined) {
                    connection.mockError(new Response(new ResponseOptions({
                        status: parseInt(connection.request.url, 10),
                        statusText: errorsToTest[connection.request.url],
                        url: connection.request.url,
                    })));
                }
            });

            spyOn(console, 'error');

            Object.keys(errorsToTest).forEach((errorCode: string) => {
                let responseObservable: Observable<Response> = _HttpInterceptorService.get(errorCode);

                responseObservable.subscribe(
                    () => expect(true).toBe(false),
                    (response: Response) => {
                        expect(console.error.calls.count()).toBeGreaterThan(0);
                        expect(response.url).toEqual(errorCode);
                        expect(response.status).toEqual(parseInt(errorCode, 10));
                        expect(response.statusText).toEqual(errorsToTest[errorCode]);

                        done();
                    },
                );
            });
        })();
    });

    it ('should fail if the server doesn\'t respond', (done: () => void) => {
        spyOn(_HttpService, 'get').and.returnValue(undefined);
        spyOn(console, 'error');

        let responseObservable: Observable<Response> = _HttpInterceptorService.get(urlToTest);
        responseObservable.subscribe(
            () => expect(true).toBe(false),
            (response: Response) => {
                expect(console.error.calls.count()).toEqual(0);
                expect(response.url).toEqual(urlToTest);
                expect(response.status).toEqual(404);
                expect(response.statusText).toEqual('Not found');

                done();
            },
        );
    });
});
