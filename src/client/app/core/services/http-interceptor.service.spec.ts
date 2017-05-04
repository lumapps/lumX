/* tslint:disable:no-unused-expression */

import * as _ from 'lodash';

import { TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';
import { SinonFakeXMLHttpRequest, SinonSandbox, sandbox } from 'sinon';

import { Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { CoreModule } from 'core/modules/core.module';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';

import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';


describe('HTTP Interceptor Service', () => {
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
     * The Angular's HTTP service.
     *
     * @type {Http}
     */
    let _HttpService: Http;
    /**
     * The Token Service.
     *
     * @type {TokenService}
     */
    let _TokenService: TokenService;


    /**
     * The URL to test.
     *
     * @type {string}
     * @readonly
     * @constant
     * @default
     */
    const urlToTest: string = '/';
    /**
     * The body of the request.
     *
     * @type {string}
     * @readonly
     * @constant
     * @default
     */
    const body: string = 'My test body';
    /**
     * The default request options.
     *
     * @type {RequestOptions}
     */
    let defaultRequestOptions: RequestOptions;

    /**
     * The error message to send for the "401/Unauthorized" response.
     *
     * @type {string}
     * @readonly
     * @constant
     * @default
     */
    const errorMessage: string = 'Unauthorized';

    /**
     * The URL that triggers the "401/Unauthorized" response.
     *
     * @type {string}
     * @readonly
     * @constant
     * @default
     */
    const errorUrl: string = '401';

    /**
     * The basic request options.
     *
     * @type {RequestOptions}
     * @readonly
     * @constant
     * @default Get request with 'My test body' body
     */
    const baseRequestOptions: RequestOptions = new RequestOptions({
        method: 'GET',
        body,
    });

    /**
     * The different methods to test.
     *
     * @type {Array[string]}
     * @readonly
     * @constant
     * @default
     */
    const methods: string[] = ['delete', 'get', 'head', 'patch', 'options', 'post', 'put', 'request'];


    /**
     * The number of mocked failed token.
     *
     * @type {string}
     */
    let failedToken: number = 0;


    /**
     * Setup the fake backend for retries tests.
     *
     * @param {number} [retries=5]   The number of retries we want to use.
     * @param {number} [failToken=0] The number of failed token we want to send.
     */
    function setupFakeBackend(retries: number = 5, failToken: number = 0): void {
        let attempts: number = 0;
        failedToken = 0;

        sandboxEnv.useFakeServer();
        sandboxEnv.server.respondWith((request: SinonFakeXMLHttpRequest) => {
            if (_.includes(request.url, errorUrl)) {
                if (attempts < retries) {
                    attempts++;

                    request.respond(parseInt(errorUrl, 10), {}, undefined);
                } else {
                    request.respond(200, {}, undefined);
                }
            } else if (_.includes(request.url, 'token.json')) {
                let token: string = FAKE_TOKEN;
                let status: number = 200;

                if (failedToken < failToken) {
                    token = '';
                    status = 500;

                    failedToken++;
                }

                request.respond(
                    status, {
                        'Content-Type': 'application/json',
                    },
                    JSON.stringify({
                        token,
                    }),
                  );
            } else if (request.url === String(parseInt(request.url, 10))) {
                request.respond(parseInt(request.url, 10), {}, undefined);
            }
        });

        sandboxEnv.server.autoRespond = true;
        sandboxEnv.server.respondImmediately = true;
    }


    beforeEach(() => {
        // Setup the sandbox environment and the fake backend.
        sandboxEnv = sandbox.create();
        setupFakeBackend();
        // Also add a global spy on the `console.error` function
        sandboxEnv.spy(console, 'error');


        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                HttpInterceptorService,
                TokenService,
            ],
        });

        _TokenService = TestBed.get(TokenService);
        _HttpInterceptorService = TestBed.get(HttpInterceptorService);
        _HttpService = TestBed.get(HttpInterceptorService);

        defaultRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
    });


    it('should be defined', () => {
        expect(_HttpInterceptorService).to.exist;
        expect(_HttpInterceptorService).to.be.instanceOf(HttpInterceptorService);
    });

    it('should compute the HTTP request options with authorization bearer', () => {
        expect(defaultRequestOptions).to.exist;
        expect(defaultRequestOptions.headers).to.exist;
        expect(defaultRequestOptions.headers.get('Content-Type')).to.equal('application/json');
        expect(defaultRequestOptions.headers.get('Authorization')).to.be.null;

        let newRequestOptions: RequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, false);
        expect(newRequestOptions.body).to.equal(body);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, true);
        expect(newRequestOptions.body).to.be.empty;
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
        expect(newRequestOptions.body).to.be.null;
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, true);
        expect(newRequestOptions.body).to.be.empty;

        _TokenService.setToken(FAKE_TOKEN);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(undefined, false);
        expect(baseRequestOptions.headers.get('Authorization')).to.equal(`Bearer ${FAKE_TOKEN}`);
        newRequestOptions = _HttpInterceptorService.getRequestOptionArgs(baseRequestOptions, false);
        expect(baseRequestOptions.headers.get('Authorization')).to.equal(`Bearer ${FAKE_TOKEN}`);
    });

    for (let i: number = 1, length: number = methods.length; i <= length; i++) {
        const method: string = _.get(methods, `[${i - 1}]`, 'get');

        it(`should be able to make a "${method.toUpperCase()}" request`, () => {
            sandboxEnv.spy(_HttpService, method);


            if (method === 'patch' || method === 'post' || method === 'put') {
                _HttpInterceptorService[method](urlToTest, body);
                expect(_HttpService[method]).to.have.been.calledWithExactly(urlToTest, body);
            } else {
                _HttpInterceptorService[method](urlToTest);
                expect(_HttpService[method]).to.have.been.calledWithExactly(urlToTest);
            }
        });

        const retries: number = (i <= 5) ? i : 0;
        /*
         *Compute the waited number of calls of the 'get' function.
         * When we are testing the 'get' method, we should add the 'get' of the token to the 'get' tested.
         * In any other method testing, only count the number of the token 'get'.
         */
        const supposedGetCalls: number = (method === 'get') ? ((retries * 2) + 1) : retries;
        const supposedMethodCalls: number = (method === 'get' || method === 'request') ?
            ((retries * 2) + 1) : (retries + 1);

        it(`can retry ${retries} "${method}" on 401 errors`, (done: () => void) => {
            setupFakeBackend(retries);

            if (method !== 'get') {
                sandboxEnv.spy(_HttpService, 'get');
            }
            sandboxEnv.spy(_HttpService, method);


            const responseObservable: Observable<Response> = _HttpInterceptorService[method](errorUrl);
            expect(responseObservable).to.exist;

            responseObservable.subscribe(
                (response: Response) => {
                    expect(_HttpService.get).to.have.callCount(supposedGetCalls);
                    expect(_HttpService[method]).to.have.callCount(supposedMethodCalls);

                    expect(console.error).to.have.callCount(failedToken);

                    expect(response.url).to.equal(errorUrl);
                    expect(response.status).to.equal(200);
                    expect(response.statusText).to.equal('OK');

                    done();
                },
                // Deliberately fail the test if the request failed, that's not the purpose of this test!
                () => expect(true).to.be.false,
            );
        });

        it(`should fail after 5 "${method}" retries on 401 errors`, (done: () => void) => {
            const retriesForFail: number = 6;
            setupFakeBackend(retriesForFail);

            if (method !== 'get') {
                sandboxEnv.spy(_HttpService, 'get');
            }
            sandboxEnv.spy(_HttpService, method);


            const supposedGetCallsForFail: number = (method === 'get') ?
                ((retriesForFail * 2) - 1) : retriesForFail - 1;
            const supposedMethodCallsForFail: number = (method === 'get') ?
                ((retriesForFail * 2) - 1) : retriesForFail;

            const responseObservable: Observable<Response> = _HttpInterceptorService[method](errorUrl);
            expect(responseObservable).to.exist;

            responseObservable.subscribe(
                // Deliberately fail the test if the request succeed, that's not the purpose of this test!
                () => expect(true).to.be.false,
                (response: Response) => {
                    expect(_HttpService.get).to.have.callCount(supposedGetCallsForFail);
                    expect(_HttpService[method]).to.have.callCount(supposedMethodCallsForFail);

                    expect(console.error).to.have.callCount(failedToken);

                    expect(response.url).to.equal(errorUrl);
                    expect(response.status).to.equal(parseInt(errorUrl, 10));
                    expect(response.statusText).to.equal(errorMessage);

                    done();
                },
            );
        });

        it(`"${method}" should fail if there is no observable to intercept`, (done: () => void) => {
            const responseObservable: Observable<Response> =
                _HttpInterceptorService.intercept(undefined, method.toUpperCase(), '/', method);
            expect(responseObservable).to.exist;

            responseObservable.subscribe(
                // Deliberately fail the test if the request succeed, that's not the purpose of this test!
                () => expect(true).to.be.false,
                (response: Response) => {
                    expect(response.url).to.equal('/');
                    expect(response.status).to.equal(404);
                    expect(response.statusText).to.equal('Not Found');

                    done();
                },
            );
        });
    }

    it('should pass any other backend error', (done: () => void) => {
        const errorsToTest: {} = {
            404: 'Not Found',
            403: 'Forbidden',
            500: 'Internal Server Error',
        };

        Object.keys(errorsToTest).forEach((errorCode: string) => {
            const responseObservable: Observable<Response> = _HttpInterceptorService.get(errorCode);
            expect(responseObservable).to.exist;

            responseObservable.subscribe(
                // Deliberately fail the test if the request succeed, that's not the purpose of this test!
                () => expect(true).to.be.false,
                (response: Response) => {
                    expect(console.error).to.have.been.called;
                    expect(response.url).to.equal(errorCode);
                    expect(response.status).to.equal(parseInt(errorCode, 10));
                    expect(response.statusText).to.equal(errorsToTest[errorCode]);

                    done();
                },
            );
        });
    });

    it(`should fail if the server doesn't respond`, (done: () => void) => {
        const responseObservable: Observable<Response> = _HttpInterceptorService.get(urlToTest);
        expect(responseObservable).to.exist;

        responseObservable.subscribe(
            // Deliberately fail the test if the request succeed, that's not the purpose of this test!
            () => expect(true).to.be.false,
            (response: Response) => {
                expect(console.error).to.have.been.called;
                expect(response.url).to.equal(urlToTest);
                expect(response.status).to.equal(404);
                expect(response.statusText).to.equal('Not Found');

                done();
            },
        );
    });


    afterEach(() => {
        // Remove all spies, stubs, mocks and fake servers.
        sandboxEnv.restore();
    });
});
