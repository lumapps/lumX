import { ElementFinder, ExpectedConditions, IBrowser } from 'protractor';
import { Locator, promise as WebdriverPromise } from 'selenium-webdriver';


interface Array<T> { // tslint:disable-line
    except(o: T): T[];
    intersect(o: T): T[];
}

Array.prototype['except'] = function(o) { // tslint:disable-line
    return this.filter(<T>(i: T) => o.indexOf(i) < 0);
};
Array.prototype['intersect'] = function(o) { // tslint:disable-line
    return this.filter(<T>(i: T) => o.indexOf(i) !== -1);
};


/**
 * User browser object to facilitate login and DOM manipulation.
 */
export class UserBrowser {
    /**
     * The name of the user.
     *
     * @type {string}
     * @public
     */
    public name: string;
    /**
     * The Selenium webdriver browser object attached to the user.
     *
     * @type {IBrowser}
     * @public
     */
    public browser: IBrowser;

    /**
     * A unique text prefix for this user.
     *
     * @type {string}
     * @public
     */
    public prefix: string;

    /**
     * Alias for the "browser.$" CSS selector helper.
     *
     * @type {cssSelectorHelper}
     * @public
     */
    public $: cssSelectorHelper;
    /**
     * Alias for the "browser.$$" CSS array selector helper.
     *
     * @type {cssArraySelectorHelper}
     * @public
     */
    public $$: cssArraySelectorHelper;
    /**
     * Alias for the "browser.element" root element.
     *
     * @type {any}
     * @public
     */
    public element: (locator: Locator) => ElementFinder;
    /**
     * Alias for the "browser.driver" webdriver property.
     *
     * @type {webdriver.WebDriver}
     * @public
     */
    public driver: webdriver.WebDriver;
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
     * @constructs UserBrowser
     *
     * @param {string}   name    The name of the user.
     * @param {IBrowser} browser The browser to attach to the user.
     */
    constructor(name: string, browser: IBrowser) {
        this.name = name;
        this.browser = browser;
        this.$ = browser.$;
        this.$$ = browser.$$;
        this.element = browser.element;
        this.driver = browser.driver;
        this.sleep = browser.sleep;
        this.prefix = 'PTOR_' + this.name.toUpperCase() + '_'; // Prefix for faster deletion of test data
    }


    /**
     * Move an element inside another element.
     *
     * @param  {ElementFinder}                           element     The element we want to move.
     * @param  {ElementFinder}                           destination The element which will contain the element.
     * @return {WebdriverPromise.Promise<ElementFinder>}             The promise.
     */
    appendChild(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<ElementFinder> {
        return this.browser.executeScript('arguments[1].appendChild(arguments[0]);', element.getWebElement(),
                                          destination.getWebElement());
    }

    /**
     * Evaluate boolean promises.
     *
     * @param  {boolean} bool The boolean to evaluate.
     * @return {boolean}      The boolean.
     */
    evaluateBoolean(bool: boolean): boolean {
        return bool;
    }

    /**
     * Click on the element.
     *
     * @param {ElementFinder} element              The element we want to click.
     * @param {boolean}       [isWebElement=false] If the element is already in the webElement format.
     * @param {number}        [timeout=1000]       Max waiting time.
     */
    clickOn(element: ElementFinder, isWebElement: boolean = false, timeout: number = 1000): void {
        isWebElement = isWebElement || false;

        this.driver.wait(() => {
            return element.isPresent().then(this.evaluateBoolean)
                   && element.isDisplayed().then(this.evaluateBoolean)
                   && ExpectedConditions.elementToBeClickable(element);
        },
                         timeout);
        this.browser.sleep(timeout / 10);

        this.browser
            .executeScript('arguments[0].click();', (isWebElement) ? element : element.getWebElement())
            .then(() => {
                this.browser.waitForAngular();
            });
    }

    /**
     * Load home page in order to be redirected to google auth and then connect to it.
     *
     * @return {UserBrowser} The connected user browser.
     */
    connect(): UserBrowser {
        this.driver.get(this.browser.baseUrl);

        return this;
    }

    /**
     * Move an element right after another element.
     *
     * @param  {ElementFinder}                           element     The element we want to move.
     * @param  {ElementFinder}                           destination The element we use as destination point.
     * @return {WebdriverPromise.Promise<ElementFinder>}             The promise.
     */
    insertAfter(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<ElementFinder> {
        return this.browser.executeScript('arguments[0].parentNode.insertAfter(arguments[0], arguments[1]);',
                                          element.getWebElement(), destination.getWebElement());
    }

    /**
     * Move an element right before another element.
     *
     * @param  {ElementFinder}                            element     The element we want to move.
     * @param  {ElementFinder}                            destination The element we use as destination point.
     * @return {!WebdriverPromise.Promise<ElementFinder>}             The promise.
     */
    insertBefore(element: ElementFinder, destination: ElementFinder): WebdriverPromise.Promise<ElementFinder> {
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
     */
    scrollAndInput(element: ElementFinder, keys: string, clear: boolean = true, prefix: boolean = false,
                   isWebElement: boolean = false, timeout: number = 1000): void {
        isWebElement = isWebElement || false;

        this.driver.wait(() => {
            return element.isPresent().then(this.evaluateBoolean) && element.isDisplayed().then(this.evaluateBoolean)
                   && protractor.ExpectedConditions.elementToBeClickable(element);
        },
                         timeout);
        this.browser.sleep(timeout / 10);

        this.browser
            .executeScript('arguments[0].scrollIntoView();', isWebElement ? element : element.getWebElement())
            .then(() => {
                if (clear) {
                    element.clear();
                }

                element.getText().then((text: string) => {
                    // Add prefix if first input
                    let input: string = (text === '' && prefix) ? this.prefix + keys : keys;

                    element.sendKeys(input).then(() => {
                      this.browser.waitForAngular();
                    });
                });
            });
    }
}
