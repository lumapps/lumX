import { Component, ViewEncapsulation } from '@angular/core';

import { APP_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


/*
 * Global styles
 */
import 'app.global.scss';


/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styles: [
        require('./' + SELECTOR + '.component.scss'),
    ],
    template: template,
})
/**
 * App Component.
 * Top Level Component.
 *
 * At initialization, get the first OAuth token to authentify the connected user.
 */
export class AppComponent {
    /**
     * Construct a new App component.
     *
     * @constructs AppComponent
     *
     * @param {HttpInterceptorService} _Http         Our customized HTTP service that handles request authentication
     * @param {TokenService}           _TokenService The token service
     */
    constructor(_Http: HttpInterceptorService, _TokenService: TokenService) {
        _Http.get('/').subscribe(() => _TokenService.setToken('1234'));
    }
}
