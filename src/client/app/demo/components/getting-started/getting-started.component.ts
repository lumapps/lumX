import { Component } from '@angular/core';

import { DocumentationAbstract } from '../documentation/documentation.abstract';

import { PAGE_GETTING_STARTED_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './getting-started.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Getting Started page Component.
 */
export class GettingStartedComponent extends DocumentationAbstract {
    constructor() {
        super([
            {
                label: 'Installation',
                url: 'getting-started/installation',
            },
            {
                label: 'Customization',
                url: 'getting-started/customization',
            },
            {
                label: 'Contribute',
                url: 'getting-started/contribute',
            },
        ]);
    }
}
