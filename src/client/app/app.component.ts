import { Component, ViewEncapsulation } from '@angular/core';
import { Response } from '@angular/http';

import { SELECTOR_PREFIX } from 'core/settings/common.settings';

import { TokenMessage } from 'core/messages/token.message';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


export const SELECTOR: string = 'app';


/**
 * App Component
 * Top Level Component
 * At initialization, get the first OAuth token to authentify the connected user
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: SELECTOR_PREFIX + '-' + SELECTOR,
    styles: [
        require('main.scss'),
    ],
    template: require('./' + SELECTOR + '.component.html'),
})
export class AppComponent {
    /**
     * Construct a new App component
     *
     * @param {HttpInterceptorService} http         Our customized HTTP service that handles request authentication
     * @param {TokenService}           tokenService The token service
     */
    constructor(http: HttpInterceptorService, tokenService: TokenService) {
        http.get('/services/oauthtoken')
            .map((response: Response) => response.json())
            .subscribe(
                (tokenResponse: TokenMessage) => tokenService.setToken(tokenResponse.token)
            );
    }
}
