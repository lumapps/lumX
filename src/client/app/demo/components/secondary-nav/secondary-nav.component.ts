import { Component, Input } from '@angular/core';

import { SECONDARY_NAV_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
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
 * Secondary Navigation Component.
 */
export class SecondaryNavComponent {
    @Input('lx-links') secondaryNavLinks: Array<Object> = [];
}
