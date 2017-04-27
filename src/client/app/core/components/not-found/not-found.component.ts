import { Component } from '@angular/core';

import { NOT_FOUND_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/**
 * Not Found component.
 *
 * Displayed when a route cannot be found.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
