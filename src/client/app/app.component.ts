import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { APP_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ITokenMessage } from 'core/messages/token.message';
import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


/*
 * Global styles.
 */
import 'core/styles/app.scss';


/**
 * App Component.
 * Top Level Component.
 *
 * At initialization, get the first OAuth token to authentify the connected user.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    /**
     * Construct a new App component.
     *
     * @constructs AppComponent
     *
     * @param {HttpInterceptorService} _HttpService  The HTTP service
     * @param {TokenService}           _TokenService The token service
     */
    constructor(private _HttpService: HttpInterceptorService, private _TokenService: TokenService) {}

    /**
     * Initialize the App component.
     *
     * @public
     */
    public ngOnInit(): void {
        this._HttpService.get('/token.json')
            .map((response: Response) => response.json())
            .subscribe((tokenMessage: ITokenMessage) => {
                this._TokenService.setToken(tokenMessage.token);
            });
    }
}
