import { ElementArrayFinder, ElementFinder, ElementHelper, ExpectedConditions, ProtractorBrowser } from 'protractor';
import { WebDriver, promise as WebdriverPromise } from 'selenium-webdriver';

import { UtilsService } from '../../../../src/client/app/core/services/utils.service';


/**
 * User Browser.
 * User browser object to facilitate login and DOM manipulation.
 */
export class UserBrowser {
    /**
     * Alias for the "browser.$" CSS selector helper.
     *
     * @type {(query: string) => ElementFinder}
     * @public
     */
    public $: (query: string) => ElementFinder;
    /**
     * Alias for the "browser.$$" CSS array selector helper.
     *
     * @type {(query: string) => ElementArrayFinder}
     * @public
     */
    public $$: (query: string) => ElementArrayFinder;

    /**
     * The Selenium webdriver browser object attached to the user.
     *
     * @type {ProtractorBrowser}
     * @public
     */
    public browser: ProtractorBrowser;

    /**
     * Alias for the "browser.driver" webdriver property.
     *
     * @type {WebDriver}
     * @public
     */
    public driver: WebDriver;

    /**
     * Alias for the "browser.element" root element.
     *
     * @type {ElementHelper}
     * @public
     */
    public element: ElementHelper;

    /**
     * The name of the user.
     *
     * @type {string}
     * @public
     */
    public name: string;

    /**
     * A unique text prefix for this user.
     *
     * @type {string}
     * @public
     */
    public prefix: string;

    /**
     * Alias for the "browser.sleep" function.
     *
     * @type {Function}
     * @public
     */
    public sleep: Function;


    /**
     * Construct a new user object.
     *
     * @param {string}            name    The name of the user.
     * @param {ProtractorBrowser} browser The browser to attach to the user.
     */
    constructor(name: string, browser: ProtractorBrowser) {
        this.name = name;
        this.browser = browser;
        this.$ = browser.$;
        this.$$ = browser.$$;
        this.element = browser.element;
        this.driver = browser.driver;
        this.sleep = browser.sleep;
        // Prefix for faster deletion of test data.
        this.prefix = `PTOR_${this.name.toUpperCase()}_`;
    }


    /**
     * Move an element inside another element.
     *
     * @param  {ElementFinder}                element     The element we want to move.
     * @param  {ElementFinder}                destination The element which will contain the element.
     * @return {WebdriverPromise.Promise<{}>} The promise.
     * @public
     * @async
     */
    public async appendChild(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<{}> {
        return this.browser.executeScript('arguments[1].appendChild(arguments[0]);', element.getWebElement(),
                                          destination.getWebElement());
    }

    /**
     * Click on the element.
     *
     * @param {ElementFinder} element              The element we want to click.
     * @param {boolean}       [isWebElement=false] If the element is already in the webElement format.
     * @param {number}        [timeout=1000]       Max waiting time.
     * @public
     */
    public clickOn(element: ElementFinder, isWebElement: boolean = false, timeout: number = 1000): void {
        isWebElement = (UtilsService.isDefined(isWebElement)) ? isWebElement : false;

        this.driver.wait(() => {
            /* tslint:disable:strict-boolean-expressions */
            return element.isPresent().then(this.evaluateBoolean) && element.isDisplayed().then(this.evaluateBoolean) &&
                ExpectedConditions.elementToBeClickable(element);
            /* tslint:enable:strict-boolean-expressions */
        }, timeout);
        this.browser.sleep(timeout / 10);

        this.browser.executeScript('arguments[0].click();', (isWebElement) ? element : element.getWebElement())
            .then(async () => this.browser.waitForAngular());
    }

    /**
     * Load home page in order to be redirected to google auth and then connect to it.
     *
     * @return {UserBrowser} The connected user browser.
     * @public
     */
    public connect(): UserBrowser {
        this.driver.get(this.browser.baseUrl);

        return this;
    }

    /**
     * Evaluate boolean promises.
     *
     * @param  {boolean} bool The boolean to evaluate.
     * @return {boolean}      The boolean.
     * @public
     */
    public evaluateBoolean(bool: boolean): boolean {
        return bool;
    }

    /**
     * Move an element right after another element.
     *
     * @param  {ElementFinder}                element     The element we want to move.
     * @param  {ElementFinder}                destination The element we use as destination point.
     * @return {WebdriverPromise.Promise<{}>} The promise.
     * @public
     * @async
     */
    public async insertAfter(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<{}> {
        return this.browser.executeScript('arguments[0].parentNode.insertAfter(arguments[0], arguments[1]);',
                                          element.getWebElement(), destination.getWebElement());
    }

    /**
     * Move an element right before another element.
     *
     * @param  {ElementFinder}                 element     The element we want to move.
     * @param  {ElementFinder}                 destination The element we use as destination point.
     * @return {!WebdriverPromise.Promise<{}>} The promise.
     * @public
     * @async
     */
    public async insertBefore(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<{}> {
        return this.browser.executeScript('arguments[0].parentNode.insertBefore(arguments[0], arguments[1]);',
                                          element.getWebElement(), destination.getWebElement());
    }

    /**
     * Scroll to an input and then write on it.
     *
     * @param {ElementFinder} element              The element we want to click.
     * @param {string}        keys                 The text we want to use to erase or append.
     * @param {boolean}       [clear=true]         Indicates if we want to clear the input before write on it or add the
     *                                             text at the end.
     * @param {boolean}       [prefix=false]       Indicates if we want to prefix the input (useful but not for email or
     *                                             password or search e.g. ...).
     * @param {boolean}       [isWebElement=false] Indicates if it's a web element.
     * @param {number}        [timeout=1000]       Max waiting time.
     * @public
     */
    public scrollAndInput(element: ElementFinder, keys: string, clear: boolean = true, prefix: boolean = false,
                          isWebElement: boolean = false, timeout: number = 1000): void {
        isWebElement = (UtilsService.isDefined(isWebElement)) ? isWebElement : false;

        this.driver.wait(() => {
            /* tslint:disable:strict-boolean-expressions */
            return element.isPresent().then(this.evaluateBoolean) && element.isDisplayed().then(this.evaluateBoolean) &&
                ExpectedConditions.elementToBeClickable(element);
            /* tslint:enable:strict-boolean-expressions */
        }, timeout);
        this.browser.sleep(timeout / 10);

        this.browser.executeScript('arguments[0].scrollIntoView();', isWebElement ? element : element.getWebElement())
            .then(() => {
                if (clear) {
                    element.clear();
                }

                element.getText().then((text: string) => {
                    // Add prefix if first input
                    const input: string = (text === '' && prefix) ? this.prefix + keys : keys;

                    element.sendKeys(input).then(async () => this.browser.waitForAngular());
                });
            });
    }
}
