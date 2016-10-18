import { Component, ViewEncapsulation } from '@angular/core';
import { Response } from '@angular/http';

import { DEMO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { HttpInterceptorService } from 'core/services/http-interceptor.service';
import { TokenService } from 'core/services/token.service';


/*
 * Global styles
 */
import '_lumx2.scss';

/*
 * Component styles
 */
import './demo.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Demo Component.
 * Top Level Component.

 * At initialization, get the first OAuth token to authentify the connected user.
 */
export class DemoComponent {
    /**
     * Construct a new Demo component.
     *
     * @constructs DemoComponent
     *
     * @param {HttpInterceptorService} _Http         Our customized HTTP service that handles request authentication
     * @param {TokenService}           _TokenService The token service
     */
    constructor(_Http: HttpInterceptorService, _TokenService: TokenService) {
        _Http.get('/').subscribe(() => _TokenService.setToken('1234'));
    }
}
