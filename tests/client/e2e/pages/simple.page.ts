import { ElementArrayFinder, ElementFinder } from 'protractor';
import { Locator } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { APP_SELECTOR, SELECTOR_PREFIX, SELECTOR_SEPARATOR }
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
    public appSelector: string = SELECTOR_PREFIX + SELECTOR_SEPARATOR + APP_SELECTOR;

    /**
     * References all elements needed for this page.
     *
     * @type {ElementFinder|ElementArrayFinder}
     * @public
     */
    public app: ElementFinder;

    /**
     * References all accessors needed for this page.
     *
     * @type {Locator}
     * @private
     */
    private _appAccessor: Locator;


    /**
     * Construct a new home page descriptor.
     *
     * @constructs HomePage
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page.
     */
    constructor(public userBrowser: UserBrowser) {
        this._appAccessor = by.tagName(this.appSelector);

        this.app = this.userBrowser.element(this._appAccessor);
    }
}
