import { Component } from '@angular/core';

import { MobileNavService } from 'demo/services/mobile-nav.service';

import { HEADER_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
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
 * Header Component.
 *
 * The header of the application that contains the main navigation.
 */
export class HeaderComponent {
    constructor(private mobileNavService: MobileNavService) {}
}
