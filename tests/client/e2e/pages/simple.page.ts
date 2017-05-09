import { ElementFinder, by } from 'protractor';
import { By } from 'selenium-webdriver';

import { UserBrowser } from 'e2e/helpers/user-browser.class';

import { APP_SELECTOR, SELECTOR_PREFIX,
         SELECTOR_SEPARATOR } from 'app/core/settings/selectors.settings';


/**
 * Simple Page.
 * Simple page descriptor to separate selectors from specs.
 */
export class SimplePage {
    /* tslint:disable:completed-docs */
    /**
     * References all accessors needed for this page.
     *
     * @type {By}
     * @private
     */
    private _appAccessor: By;

    /**
     * References all elements needed for this page.
     *
     * @type {ElementFinder|ElementArrayFinder}
     * @public
     */
    public app: ElementFinder;

    /**
     * References all classes needed for this page.
     *
     * @type {string}
     * @default 'lb-app'
     * @public
     */
    public appSelector: string = SELECTOR_PREFIX + SELECTOR_SEPARATOR + APP_SELECTOR;
    /* tslint:enable:completed-docs */


    /**
     * Construct a new home page descriptor.
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page.
     */
    constructor(public userBrowser: UserBrowser) {
        this._appAccessor = by.tagName(this.appSelector);

        this.app = this.userBrowser.element(this._appAccessor);
    }
}
