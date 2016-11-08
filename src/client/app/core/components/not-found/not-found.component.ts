import { Component } from '@angular/core';

import { NOT_FOUND_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styles: [
        require('./' + SELECTOR + '.component.scss'),
    ],
    template: template,
})
/**
 * Not Found component
 *
 * Displayed when a route cannot be found
 */
export class NotFoundComponent {}
