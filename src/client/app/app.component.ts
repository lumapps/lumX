import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import { APP_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ITokenMessage } from 'core/messages/token.message';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


/*
 * Global styles
 */
import 'core/styles/app.scss';


/*
 * Component template
 */
const template: string = require(`./${SELECTOR}.component.html`);


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styles: [
        require(`./${SELECTOR}.component.scss`),
    ],
    template: template,
})
/**
 * App Component.
 * Top Level Component.
 *
 * At initialization, get the first OAuth token to authentify the connected user.
 */
export class AppComponent implements OnInit {
    /**
     * Construct a new App component.
     *
     * @constructs AppComponent
     *
     * @param {HttpInterceptorService} _Http  The HTTP service
     * @param {TokenService}           _Token The token service
     */
    constructor(private _Http: HttpInterceptorService, private _Token: TokenService) {}

    /**
     * Initialize the application component.
     */
    ngOnInit(): void {
        this._Http.get('/services/oauthtoken')
            .map((response: Response) => response.json())
            .subscribe((tokenMessage: ITokenMessage) => {
                this._Token.setToken(tokenMessage.token);
            });
    }
}
