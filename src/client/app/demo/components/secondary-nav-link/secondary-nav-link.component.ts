import { Component, Input } from '@angular/core';

import { ILink } from 'demo/types/link.type';

import { SECONDARY_NAV_LINK_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
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
 * Secondary Navigation Link Component.
 */
export class SecondaryNavLinkComponent {
    @Input('lx-link') link: ILink;
}
