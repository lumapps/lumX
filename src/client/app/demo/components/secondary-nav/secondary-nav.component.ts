import { Component, Input } from '@angular/core';

import { SECONDARY_NAV_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './secondary-nav.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Secondary Navigation Component.
 */
export class SecondaryNavComponent {
    @Input('lx-links') secondaryNavLinks: Array<Object> = [];
}
