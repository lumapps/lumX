import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, Response, ResponseOptions } from '@angular/http';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { ITokenMessage } from 'core/messages/token.message';
import { ITokenState } from 'core/reducers/token.reducer';
import { TokenService } from 'core/services/token.service';


@Injectable()
/**
 * Responsible to intercept all HTTP request and add the OAuth token to the headers.
 * If the token is not valid (or inexistant), updates it.
 * Only try to auth 5 times then give up.
 */
export class HttpInterceptorService {
    /**
     * The number of login attemps for the request.
     * When 5 attemps have been made, give up.
     *
     * @type {number}
     * @private
     */
    private _loginAttempts: number = 0;


    /**
     * Construct a new HTTP Interceptor service.
     * Initialize the login attemps number.
     *
     * @constructs HttpInterceptorService
     *
     * @param {Http}         _HttpService  The angular's regular HTTP Service.
     * @param {TokenService} _TokenService The application's token service.
     */
    constructor(private _HttpService: Http, private _TokenService: TokenService) {}


    /**
     * Execute a "DELETE" HTTP request.
     *
     * @param  {string}               url       The URL to call with "DELETE" verb.
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    delete(url: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.delete(url, this.getRequestOptionArgs(options)), 'delete', url,
                              undefined, undefined, options);
    }

    /**
     * Execute a "GET" HTTP request.
     *
     * @param  {string}               url       The URL to call with "GET" verb.
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    get(url: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.get(url, this.getRequestOptionArgs(options, true)), 'get', url,
                              undefined, undefined, options);
    }

    /**
     * Execute a "HEAD" HTTP request.
     *
     * @param  {string}               url       The URL to call with "HEAD" verb.
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    head(url: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.head(url, this.getRequestOptionArgs(options)), 'head', url,
                              undefined, undefined, options);
    }

    /**
     * Get the request options.
     *
     * @param  {RequestOptions} [options]     The defaut request options.
     * @param  {boolean}        [isGet=false] Indicates if it's a get request. FOr a get request, generate a fake
     *                                        empty body to avoid any error with Angular2 RC5 framework.
     *                                        False by default.
     * @return {RequestOptions}               The new request options.
     */
    getRequestOptionArgs(options?: RequestOptions, isGet: boolean = false): RequestOptions {
        if (options === undefined) {
            options = new RequestOptions();
        }

        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        this._TokenService.token.subscribe((token: ITokenState) => {
            if (token !== undefined && token.value !== undefined && token.needed !== undefined && !token.needed) {
                options.headers.append('Authorization', 'Bearer ' + token.value);
            }
        });

        // This is a temporary fix for Angular2 RC5.
        if (isGet) {
            options.body = '';
        }

        return options;
    }

    /**
     * Intercept all the HTTP request.
     *
     * @param  {Observable<Response>} observable The original observable for the future response to the request.
     * @param  {string}               method     The HTTP verb used for the request.
     * @param  {string}               url        The request URL.
     * @param  {string|Request}       request    The request.
     * @param  {string}               [body]     The body of the request.
     * @param  {RequestOptions}       [options]  The options of the request.
     * @return {Observable<Response>}            The new observable for the future response to the request.
     */
    intercept(observable: Observable<Response>, method: string, url: string, request: string | Request,
              body?: string, options?: RequestOptions): Observable<Response> {
        if (observable === undefined) {
            return Observable.throw(new Response(
                new ResponseOptions({
                    status: 404,
                    statusText: 'Not found',
                    url: url,
                })
            ));
        }

        return observable.catch((initialError: Response) => {
            if (initialError.status === 401) {
                if (this._loginAttempts < 5) {
                    this._loginAttempts++;

                    this._TokenService.refreshToken();
                    return this.get('/token.json')
                        .map((response: Response) => response.json())
                        .flatMap((tokenMessage: ITokenMessage) => {
                            this._TokenService.setToken(tokenMessage.token);

                            if (method === 'patch' || method === 'post' || method === 'put') {
                                return this[method](url, body, this.getRequestOptionArgs(options));
                            }
                            if (method === 'request') {
                                return this[method](request, this.getRequestOptionArgs(options));
                            }

                            return this[method](url, this.getRequestOptionArgs(options));
                        });
                } else {
                    this._loginAttempts = 0;
                }
            // All other errors.
            } else {
                console.error(`/!\\ ERROR - ${initialError.status} - ${initialError.statusText} - ${method}: ${url}`);
            }

            return Observable.throw(initialError);
        });
    }

    /**
     * Execute a "OPTIONS" HTTP request.
     *
     * @param  {string}               url       The URL to call with "OPTIONS" verb.
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    options(url: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.options(url, this.getRequestOptionArgs(options)), 'options', url,
                              undefined, undefined, options);
    }

    /**
     * Execute a "PATCH" HTTP request.
     *
     * @param  {string}               url       The URL to call with "PATCH" verb.
     * @param  {string}               body      The body of the request
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    patch(url: string, body: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.patch(url, body, this.getRequestOptionArgs(options)), 'patch', url,
                              undefined, body, options);
    }

    /**
     * Execute a "POST" HTTP request.
     *
     * @param  {string}               url       The URL to call with "POST" verb.
     * @param  {string}               body      The body of the request
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    post(url: string, body: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.post(url, body, this.getRequestOptionArgs(options)), 'post', url,
                              undefined, body, options);
    }

    /**
     * Execute a "PUT" HTTP request.
     *
     * @param  {string}               url       The URL to call with "PUT" verb.
     * @param  {string}               body      The body of the request
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    put(url: string, body: string, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.put(url, body, this.getRequestOptionArgs(options)), 'put', url,
                              undefined, body, options);
    }

    /**
     * Execute a "REQUEST" HTTP request.
     *
     * @param  {string|Request}       url       The URL to call with "REQUEST" verb.
     * @param  {RequestOptions}       [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    request(url: string | Request, options?: RequestOptions): Observable<Response> {
        return this.intercept(this._HttpService.request(url, this.getRequestOptionArgs(options)), 'request', undefined,
                              url, undefined, options);
    }
}
