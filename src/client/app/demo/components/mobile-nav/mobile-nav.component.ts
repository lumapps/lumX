import { Component } from '@angular/core';

import { MobileNavService } from 'demo/services/mobile-nav.service';

import { MOBILE_NAV_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


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
 * Mobile Navigation Component.
 */
export class MobileNavigationComponent {
    constructor(private mobileNavService: MobileNavService) {}
}
