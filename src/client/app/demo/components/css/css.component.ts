import { Component } from '@angular/core';

import { DocumentationAbstract } from '../documentation/documentation.abstract';

import { PAGE_CSS_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component template
 */
const template: string = require(`./${SELECTOR}.component.html`);


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * CSS page Component.
 */
export class CSSComponent extends DocumentationAbstract {
    constructor() {
        super([
            {
                label: 'Color',
                url: '/css/color',
            },
            {
                label: 'Flexbox',
                url: '/css/flexbox',
            },
            {
                label: 'Mixin',
                url: '/css/mixin',
            },
            {
                label: 'Typography',
                url: '/css/typography',
            },
        ]);
    }
}
