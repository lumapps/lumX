import { Component } from '@angular/core';

import { HOME_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/**
 * Home Component.
 *
 * Display the to-do list.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent {}
