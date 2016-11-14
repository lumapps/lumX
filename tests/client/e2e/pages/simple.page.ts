import { by, ElementArrayFinder, ElementFinder } from 'protractor';
import { By } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { DEMO_SELECTOR, SELECTOR_PREFIX, SELECTOR_SEPARATOR }
    from '../../../../src/client/app/core/settings/selectors.settings';


/**
 * Simple page descriptor to separate selectors from specs.
 */
export class SimplePage {
    /**
     * References all classes needed for this page.
     *
     * @type {string}
     * @public
     */
    public demoSelector: string = SELECTOR_PREFIX + SELECTOR_SEPARATOR + DEMO_SELECTOR;

    /**
     * References all elements needed for this page.
     *
     * @type {ElementFinder|ElementArrayFinder}
     * @public
     */
    public demo: ElementFinder;

    /**
     * References all accessors needed for this page.
     *
     * @type {By}
     * @private
     */
    private _demoAccessor: By;


    /**
     * Construct a new home page descriptor.
     *
     * @constructs HomePage
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page.
     */
    constructor(public userBrowser: UserBrowser) {
        this._demoAccessor = by.tagName(this.demoSelector);

        this.demo = this.userBrowser.element(this._demoAccessor);
    }
}
