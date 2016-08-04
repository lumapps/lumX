import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { TokenState } from 'core/reducers/token.reducer';
import { TokenService } from 'core/services/token.service';


/**
 * Responsible to intercept all HTTP request and add the OAuth token to the headers
 * If the token is not valid (or inexistant), updates it.
 * Only try to auth 5 times then give up
 */
@Injectable()
export class HttpInterceptorService {
    /**
     * The number of login attemps for the request
     * When 5 attemps have been made, give up
     *
     * @type       {number}
     * @visibility private
     */
    private loginAttempts: number = 0;


    /**
     * Construct a new HTTP Interceptor service
     * Initialize the login attemps number
     *
     * @param {Http}         http         The angular's regular HTTP Service
     * @param {TokenService} tokenService The application's token service
     */
    constructor(private http: Http, private tokenService: TokenService) {}


    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.delete(url, this.getRequestOptionArgs(options)), 'delete', url, undefined,
                              undefined, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.get(url, this.getRequestOptionArgs(options, true)), 'get', url, undefined,
                              undefined, options);
    }

    getRequestOptionArgs(options?: RequestOptionsArgs, isGet: boolean = false): RequestOptionsArgs {
        if (!options) {
            options = new RequestOptions();
        }

        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        this.tokenService.token.subscribe((token: TokenState) => {
            if (token && !token.needed) {
                options.headers.append('Authorization', 'Bearer ' + token.value);
            }
        });

        // This is a temporary fix for Angular2 RC5
        if (isGet) {
            options.body = '';
        }

        return options;
    }

    intercept(observable: Observable<Response>, method: string, url: string, requestUrl: string | Request,
              body?: string, options?: RequestOptionsArgs): Observable<Response> {
        return observable.catch((initialError: Response) => {
            if (initialError.status === 401) {
                if (this.loginAttempts === 5) {
                    return Observable.empty();
                } else {
                    this.loginAttempts++;
                    this.tokenService.refreshToken();

                    // Wait for the token to be retrieved
                    return this.tokenService.token.switchMap((token: TokenState) => {
                        if (!token.needed) {
                            switch (method) {
                                case 'request':
                                    return this.request(requestUrl, this.getRequestOptionArgs(options));
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
                // All other errors
            } else {
                console.error(`/!\\ ERROR - ${initialError.status} - ${initialError.statusText} - ${method}: ${url}`);

                return Observable.throw(initialError);
            }
        });
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.post(url, body, this.getRequestOptionArgs(options)), 'post', url, undefined,
                              body, options);
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.put(url, body, this.getRequestOptionArgs(options)), 'put', url, undefined, body,
                              options);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(this.http.request(url, this.getRequestOptionArgs(options)), 'request', undefined, url,
                              undefined, options);
    }
}
