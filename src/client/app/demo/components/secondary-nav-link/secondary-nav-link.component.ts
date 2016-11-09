import { Component, Input } from '@angular/core';

import { SECONDARY_NAV_LINK_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './secondary-nav-link.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Secondary Navigation Link Component.
 */
export class SecondaryNavLinkComponent {
    @Input('lx-label') label: string;
    @Input('lx-url') url: string;
}
