const _ = require('lodash');

/////////////////////////////

module.exports = {
    /**
     * Comparator that waits until element is visible.
     * It is useful for situations when some element is dynamic and appears after some delay.
     *
     * @see {@link https://github.com/Xotabu4/jasmine-protractor-matchers|Jasmine Protractor Matchers}
     *
     * @param  {Element}  actual         Element that is expected to be visible. Should be ElementFinder object.
     * @param  {number}   [timeout=3000] Time in milliseconds to wait for element to appear.
     * @param  {string}   [message]      Message that overrides default error message.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toAppear: function toAppear() {
        return {
            compare: function toAppearCompare(actual, ...args) {
                let message;
                let timeout;

                if (typeof args[2] === 'string') {
                    timeout = 3000;
                    message = args[0];
                } else {
                    timeout = args[0] || 3000;
                    message = args[1];
                }
                let internalBrowser;
                if (actual.ptor_ === undefined) {
                    // Protractor 4.0 renamed .ptor_ to .browser_ , adding backward compatibility.
                    if (actual.browser_ === undefined) {
                        throw new Error('toAppear() expects to be applied to ElementFinder object, ' +
                            'please make sure that you pass correct object');
                    } else {
                        internalBrowser = actual.browser_;
                    }
                } else {
                    internalBrowser = actual.ptor_;
                }

                const result = {};
                result.pass = internalBrowser.wait(protractor.ExpectedConditions.visibilityOf(actual), timeout).then(
                    () => {
                        result.message = message ||
                            `Element ${actual.parentElementArrayFinder.locator_.toString()} was expected not to be shown in ${timeout} milliseconds but is visible`;

                        return true;
                    },
                    () => {
                        result.message = message ||
                            `Element ${actual.parentElementArrayFinder.locator_.toString()} was expected to be shown in ${timeout} milliseconds but is NOT visible`;

                        return false;
                    });

                return result;
            },
        };
    },

    /**
     * Expect a checkbox element to be checked.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toBeChecked: function toBeChecked() {
        return {
            compare: function toBeCheckedCompare(elementToTest) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getAttribute('checked').then(function getAttributeThen(checked) {
                        const pass = (checked === 'true');
                        ret.message = `Expected${((pass) ? ' not ' : '')} to be checked`;

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to be visible.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toBeDisplayed: function toBeDisplayed() {
        return {
            compare: function toBeDisplayedCompare(elementToTest) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.isDisplayed().then(function isDisplayedThen(isDisplayed) {
                        const pass = isDisplayed;
                        ret.message = `Expected${((pass) ? ' not ' : '')} to be displayed`;

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to be near the given screen location.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @param  {{x: number, y: number}} expectedLocation An object representing the expected location.
     * @param  {number}                 maxDistance      The distance max tolerated between the expected location and
     *                                                   the actual location.
     * @return {Function}               Comparator function according to Jasmine matchers specification.
     */
    toBeNearLocation: function toBeNearLocation() {
        return {
            compare: function toBeNearLocationCompare(elementToTest, expectedLocation, maxDistance) {
                maxDistance = (maxDistance === undefined) ? 2 : maxDistance;
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getLocation().then(function getLocationThen(actualLocation) {
                        const distance = Math.sqrt(
                            Math.pow(actualLocation.x - expectedLocation.x, 2) +
                            Math.pow(actualLocation.y - expectedLocation.y, 2)
                        );

                        const pass = (distance <= maxDistance);

                        function coordinatesToString(obj) {
                            return `(${obj.x}, ${obj.y})`;
                        }

                        ret.message = `Expected ${((pass) ? ' not' : '')} to be near ${coordinatesToString(expectedLocation)} but is at ${coordinatesToString((actualLocation))}, ${distance} pixels from it.`;

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to be present.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toBePresent: function toBePresent() {
        return {
            compare: function toBePresentCompare(elementToTest) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.isPresent().then(function isPresentThen(isPresent) {
                        const pass = isPresent;
                        ret.message = `Expected ${((pass) ? ' not ' : '')} to be present`;

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to contain a text (at any position).
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @param  {string}   expectedText The expected text.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toContainText: function toContainText() {
        return {
            compare: function toContainTextCompare(elementToTest, expectedText) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getText().then(function getTextThen(actualText) {
                        const pass = actualText.indexOf(expectedText) >= 0;
                        if (pass) {
                            ret.message = `Expected not to contain text ${expectedText}`;
                        } else {
                            ret.message = `Expected to contain text ${expectedText} but text is ${actualText}`;
                        }

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Opposite matcher to toAppear().
     * Can be used for element disappearing checks.
     *
     * @see {@link https://github.com/Xotabu4/jasmine-protractor-matchers|Jasmine Protractor Matchers}
     *
     * @param  {Element}  actual         Element that is expected to be invisible. Should be ElementFinder object.
     * @param  {number}   [timeout=3000] Time in milliseconds to wait for element to appear.
     * @param  {string}   [message]      Message that overrides default error message.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toDisappear: function toDisappear() {
        return {
            compare: function toDisappearCompare(actual, ...args) {
                let message;
                let timeout;

                if (typeof args[0] === 'string') {
                    timeout = 3000;
                    message = args[0];
                } else {
                    timeout = args[0] || 3000;
                    message = args[1];
                }

                let internalBrowser;
                if (actual.ptor_ === undefined) {
                    // Protractor 4.0 renamed .ptor_ to .browser_ , adding backward compatibility.
                    if (actual.browser_ === undefined) {
                        throw new Error('toDisappear() expects to be applied to ElementFinder object, ' +
                            'please make sure that you pass correct object');
                    } else {
                        internalBrowser = actual.browser_;
                    }
                } else {
                    internalBrowser = actual.ptor_;
                }

                const result = {};
                result.pass = internalBrowser.wait(protractor.ExpectedConditions.invisibilityOf(actual), timeout).then(
                    () => {
                        result.message = message ||
                            `Element ${actual.parentElementArrayFinder.locator_.toString()} was expected to be shown in ${timeout} milliseconds but is NOT visible`;

                        return true;
                    },
                    () => {
                        result.message = message ||
                            `Element ${actual.parentElementArrayFinder.locator_.toString()} was expected not to be shown in ${timeout} milliseconds but is visible`;

                        return false;
                    });

                return result;
            },
        };
    },

    /**
     * Expect an element to have all classes, or none of them in the negative case.
     *     expect($(#id)).toHaveClass('class1 class2');
     *     expect($(#id)).not.toHaveClass('class1 class2');
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @param  {string}   expectedClasses A string containing the expected classes separated by spaces.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toHaveClass: function toHaveClass() {
        return {
            compare: function toHaveClassCompare(elementToTest, expectedClasses) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getAttribute('class').then(function getAttributeThen(actualClasses) {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const expectedClassesArr = expectedClasses.split(/\s/);
                        const notSatisfiedClassesArr = _.difference(expectedClassesArr, actualClassesArr);

                        if (expectedClassesArr.length === 1) {
                            ret.message = `Expected to have class ${expectedClassesArr[0]}`;
                        } else {
                            ret.message = `Expected to have classes ${expectedClassesArr.join(', ')} but does not have classes ${notSatisfiedClassesArr.join(', ')}`;
                        }

                        return notSatisfiedClassesArr.length === 0;
                    }),
                };

                return ret;
            },

            negativeCompare: function toHaveClassNegativeCompare(elementToTest, forbiddenClasses) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getAttribute('class').then(function getAttributeThen(actualClasses) {
                        const actualClassesArr = actualClasses.split(/\s/);
                        const forbiddenClassesArr = forbiddenClasses.split(/\s/);
                        const satisfiedClassesArr = _.intersection(forbiddenClassesArr, actualClassesArr);

                        if (forbiddenClassesArr.length === 1) {
                            ret.message = `Expected to not have class ${forbiddenClassesArr[0]}`;
                        } else {
                            ret.message = `Expected to not have classes ${forbiddenClassesArr.join(', ')} but does have classes ${satisfiedClassesArr.join(', ')}`;
                        }

                        return satisfiedClassesArr.length === 0;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to contain the exact given text.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @param  {string}   expectedText The expected exact text.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toHaveExactText: function toHaveExactText() {
        return {
            compare: function toHaveExactTextCompare(elementToTest, expectedText) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getText().then(function getTextThen(actualText) {
                        const pass = (actualText === expectedText);
                        if (pass) {
                            ret.message = `Expected not to have text ${expectedText}`;
                        } else {
                            ret.message = `Expected to have text ${expectedText} but has text ${actualText}`;
                        }

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },

    /**
     * Expect an element to have the exact given value.
     *
     * @see {@link https://gist.github.com/tepez/145236601eb97384f516|This gist}
     *
     * @param  {any}      expectedValue The expected value.
     * @return {Function} Comparator function according to Jasmine matchers specification.
     */
    toHaveValue: function toHaveValue() {
        return {
            compare: function toHaveValueCompare(elementToTest, expectedValue) {
                // eslint-disable-next-line no-useless-assign/no-useless-assign
                const ret = {
                    pass: elementToTest.getAttribute('value').then(function getAttributeThen(actualValue) {
                        const pass = (actualValue === expectedValue);
                        if (pass) {
                            ret.message = `Expected not to have value ${expectedValue}`;
                        } else {
                            ret.message = `Expected to have value ${expectedValue} but has value ${actualValue}`;
                        }

                        return pass;
                    }),
                };

                return ret;
            },
        };
    },
};
