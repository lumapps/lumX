import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

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
     * @param {Http}         _Http         The angular's regular HTTP Service.
     * @param {TokenService} _TokenService The application's token service.
     */
    constructor(private _Http: Http, private _TokenService: TokenService) {}


    /**
     * Execute a "DELETE" HTTP request.
     *
     * @param  {string}               url       The URL to call with "DELETE" verb.
     * @param  {RequestOptionsArgs}   [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this._Http.delete(url, this.getRequestOptionArgs(options)), 'delete', url, undefined,
                              undefined, options);
    }

    /**
     * Execyte a "GET" HTTP request.
     *
     * @param  {string}               url       The URL to call with "GET" verb.
     * @param  {RequestOptionsArgs}   [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this._Http.get(url, this.getRequestOptionArgs(options, true)), 'get', url, undefined,
                              undefined, options);
    }

    /**
     * Get the request options.
     *
     * @param  {RequestOptionsArgs} options       The defaut request options.
     * @param  {boolean}            [isGet=false] Indicates if it's a get request. FOr a get request, generate a fake
     *                                            empty body to avoid any error with Angular2 RC5 framework.
     *                                            False by default.
     * @return {RequestOptionsArgs}               The new request options.
     */
    getRequestOptionArgs(options?: RequestOptionsArgs, isGet: boolean = false): RequestOptionsArgs {
        if (!options) {
            options = new RequestOptions();
        }

        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        this._TokenService.token.subscribe((token: ITokenState) => {
            if (token && !token.needed) {
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
     * @param  {RequestOptionsArgs}   [options]  The options of the request.
     * @return {Observable<Response>}            The new observable for the future response to the request.
     */
    intercept(observable: Observable<Response>, method: string, url: string, request: string | Request,
              body?: string, options?: RequestOptionsArgs): Observable<Response> {
        return observable.catch((initialError: Response) => {
            if (initialError.status === 401) {
                if (this._loginAttempts === 5) {
                    return Observable.empty();
                } else {
                    this._loginAttempts++;
                    this._TokenService.refreshToken();

                    // Wait for the token to be retrieved.
                    return this._TokenService.token.switchMap((token: ITokenState) => {
                        if (!token.needed) {
                            switch (method) {
                                case 'request':
                                    return this.request(request, this.getRequestOptionArgs(options));
                                case 'get':
                                    return this.get(url, this.getRequestOptionArgs(options));
                                case 'post':
                                    return this.post(url, body, this.getRequestOptionArgs(options));
                                case 'put':
                                    return this.put(url, body, this.getRequestOptionArgs(options));
                                case 'delete':
                                    return this.delete(url, this.getRequestOptionArgs(options));
                                default:
                                    break;
                            }
                        } else {
                            return Observable.empty();
                        }
                    });
                }
            // All other errors.
            } else {
                console.error(`/!\\ ERROR - ${initialError.status} - ${initialError.statusText} - ${method}: ${url}`);

                return Observable.throw(initialError);
            }
        });
    }

    /**
     * Execute a "POST" HTTP request.
     *
     * @param  {string}               url       The URL to call with "POST" verb.
     * @param  {string}               body      The body of the request
     * @param  {RequestOptionsArgs}   [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this._Http.post(url, body, this.getRequestOptionArgs(options)), 'post', url, undefined,
                              body, options);
    }

    /**
     * Execute a "PUT" HTTP request.
     *
     * @param  {string}               url       The URL to call with "PUT" verb.
     * @param  {string}               body      The body of the request
     * @param  {RequestOptionsArgs}   [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this._Http.put(url, body, this.getRequestOptionArgs(options)), 'put', url, undefined,
                              body, options);
    }

    /**
     * Execute a "REQUEST" HTTP request.
     *
     * @param  {string|Request}       url       The URL to call with "REQUEST" verb.
     * @param  {RequestOptionsArgs}   [options] The options of the request.
     * @return {Observable<Response>}           The response of the request.
     */
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this._Http.request(url, this.getRequestOptionArgs(options)), 'request', undefined, url,
                              undefined, options);
    }
}
