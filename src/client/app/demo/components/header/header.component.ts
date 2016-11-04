import { Component } from '@angular/core';

import { MobileNavService } from 'demo/services/mobile-nav.service';

import { HEADER_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './header.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Header Component.
 */
export class HeaderComponent {
    constructor(private mobileNavService: MobileNavService) {
        /* Nothing here yet */
    }
}
