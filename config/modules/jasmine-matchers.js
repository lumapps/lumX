var _ = require('lodash');


module.exports = {
    /**
     * Comparator that waits until element is visible.
     * It is useful for situations when some element is dynamic and appears after some delay.
     *
     * @see https://github.com/Xotabu4/jasmine-protractor-matchers
     *
     * @param  {Element}  actual             Element that is expected to be visible. Should be ElementFinder object.
     * @param  {number}   timeout [Optional] Time in milliseconds to wait for element to appear.
     * @param  {string}   message [Optional] Message that overrides default error message.
     * @return {function}                    Comparator function according to Jasmine matchers specification.
     */
    toAppear: function() {
        return {
            compare: function(actual) {
                let message, timeout;
                if (typeof arguments[1] === 'string') {
                    timeout = 3000;
                    message = arguments[1]
                } else {
                    timeout = arguments[1] || 3000;
                    message = arguments[2];
                }
                let internalBrowser;
                if (actual.ptor_ == undefined) {
                    // Protractor 4.0 renamed .ptor_ to .browser_ , adding backward compatibility
                    if (actual.browser_ == undefined) {
                        throw new Error('toAppear() expects to be applied to ElementFinder object, ' +
                            'please make sure that you pass correct object');
                    } else {
                        internalBrowser = actual.browser_;
                    }
                } else {
                    internalBrowser = actual.ptor_;
                }

                let result = {};
                result.pass = internalBrowser.wait(protractor.ExpectedConditions.visibilityOf(actual), timeout).then(() => {
                    result.message = message || "Element " + actual.parentElementArrayFinder.locator_.toString() +
                        " was expected not to be shown in " + timeout + " milliseconds but is visible";
                    return true;
                }, err => {
                    result.message = message || "Element " + actual.parentElementArrayFinder.locator_.toString() +
                        " was expected to be shown in " + timeout + " milliseconds but is NOT visible";
                    return false;
                });

                return result;
            }
        }
    },

    /**
     * Opposite matcher to toAppear() . Can be used for element disappearing checks.
     *
     * @see https://github.com/Xotabu4/jasmine-protractor-matchers
     *
     * @param  {Element}  actual             Element that is expected to be invisible. Should be ElementFinder object.
     * @param  {number}   timeout [Optional] Time in milliseconds to wait for element to appear.
     * @param  {string}   message [Optional] Message that overrides default error message.
     * @return {function}                    Comparator function according to Jasmine matchers specification.
     */
    toDisappear: function() {
        return {
            compare: function(actual) {
                let message, timeout;
                if (typeof arguments[1] === 'string') {
                    timeout = 3000;
                    message = arguments[1]
                } else {
                    timeout = arguments[1] || 3000;
                    message = arguments[2];
                }

                let internalBrowser;
                if (actual.ptor_ == undefined) {
                    // Protractor 4.0 renamed .ptor_ to .browser_ , adding backward compatibility
                    if (actual.browser_ == undefined) {
                        throw new Error('toDisappear() expects to be applied to ElementFinder object, ' +
                            'please make sure that you pass correct object');
                    } else {
                        internalBrowser = actual.browser_;
                    }
                } else {
                    internalBrowser = actual.ptor_;
                }

                let result = {};
                result.pass = internalBrowser.wait(protractor.ExpectedConditions.invisibilityOf(actual), timeout).then(() => {
                    result.message = message || "Element " + actual.parentElementArrayFinder.locator_.toString() +
                        " was expected to be shown in " + timeout + " milliseconds but is NOT visible";
                    return true;
                }, err => {
                    result.message = message || "Element " + actual.parentElementArrayFinder.locator_.toString() +
                        " was expected not to be shown in " + timeout + " milliseconds but is visible";
                    return false;
                });

                return result;
            }
        }
    },

    /**
     * Expect an element to be present
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @return {function} Comparator function according to Jasmine matchers specification.
     */
    toBePresent: function() {
        return {
            compare: function(element) {
                var ret = {
                    pass: element.isPresent().then(function(isPresent) {
                        var pass = !!isPresent;
                        ret.message = "Expected" + (pass ? " not " : "") + " to be present";
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to be visible
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @return {function} Comparator function according to Jasmine matchers specification.
     */
    toBeDisplayed: function() {
        return {
            compare: function(element) {
                var ret = {
                    pass: element.isDisplayed().then(function(isDisplayed) {
                        var pass = !!isDisplayed;
                        ret.message = "Expected" + (pass ? " not " : "") + " to be displayed";
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to contain a text (at any position)
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @param  {string}   expectedText The expected text
     * @return {function}              Comparator function according to Jasmine matchers specification.
     */
    toContainText: function() {
        return {
            compare: function(element, expectedText) {
                var ret = {
                    pass: element.getText().then(function(actualText) {
                        var pass = actualText.indexOf(expectedText) >= 0;
                        if (pass) {
                            ret.message = "Expected not to contain text " + expectedText;
                        } else {
                            ret.message = "Expected to contain text " + expectedText + " but text is " + actualText;
                        }
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to contain the exact given text
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @param  {string}   expectedText The expected exact text
     * @return {function}              Comparator function according to Jasmine matchers specification.
     */
    toHaveExactText: function() {
        return {
            compare: function(element, expectedText) {
                var ret = {
                    pass: element.getText().then(function(actualText) {
                        var pass = actualText === expectedText;
                        if (pass) {
                            ret.message = "Expected not to have text " + expectedText;
                        } else {
                            ret.message = "Expected to have text " + expectedText + " but has text " + actualText;
                        }
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to have the exact given value
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @param  {any}      expectedValue The expected value
     * @return {function}               Comparator function according to Jasmine matchers specification.
     */
    toHaveValue: function() {
        return {
            compare: function(element, expectedValue) {
                var ret = {
                    pass: element.getAttribute('value').then(function(actualValue) {
                        var pass = actualValue === expectedValue;
                        if (pass) {
                            ret.message = "Expected not to have value " + expectedValue;
                        } else {
                            ret.message = "Expected to have value " + expectedValue + " but has value " + actualValue;
                        }
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect a checkbox element to be checked
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @return {function} Comparator function according to Jasmine matchers specification.
     */
    toBeChecked: function() {
        return {
            compare: function(element) {
                var ret = {
                    pass: element.getAttribute('checked').then(function(checked) {
                        var pass = checked === 'true';
                        ret.message = "Expected" + (pass ? " not " : "") + " to be checked";
                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to be near the given screen location
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @param  {Object}   expectedLocation An object representing the expected location
     *                                     x property containing the expected x position
     *                                     y property containing the expected y position
     * @param  {number}   maxDistance      The distance max tolerated between the expected location and the actual
     *                                     location
     * @return {function}                  Comparator function according to Jasmine matchers specification.
     */
    toBeNearLocation: function() {
        return {
            compare: function(element, expectedLocation, maxDistance) {
                maxDistance = (maxDistance === undefined) ? 2 : maxDistance;
                var ret = {
                    pass: element.getLocation().then(function(actualLocation) {
                        var distance = Math.sqrt(
                            Math.pow(actualLocation.x - expectedLocation.x, 2) +
                            Math.pow(actualLocation.y - expectedLocation.y, 2)
                        );

                        var pass = distance <= maxDistance;

                        // { x: 1, y: 2 } => "(1, 2)"
                        function coordinatesToString(obj) {
                            return "(" + obj.x + ", " + obj.y + ")";
                        }

                        ret.message = "Expected " + (pass ? " not" : "") + " to be near " + coordinatesToString(expectedLocation) + " but is at " + coordinatesToString((actualLocation)) + ", " + distance + " pixels from it.";

                        return pass;
                    }),
                };

                return ret;
            }
        };
    },

    /**
     * Expect an element to have all classes, or none of them in the negative case
     *     expect($(#id)).toHaveClass('class1 class2')
     *     expect($(#id)).not.toHaveClass('class1 class2')
     *
     * @see https://gist.github.com/tepez/145236601eb97384f516
     *
     * @param  {string}   expectedClasses A string containing the expected classes separated by spaces
     * @return {function}                 Comparator function according to Jasmine matchers specification.
     */
    toHaveClass: function() {
        return {
            compare: function(element, expectedClasses) {
                var ret = {
                    pass: element.getAttribute('class').then(function(actualClasses) {
                        var actualClassesArr = actualClasses.split(/\s/),
                            expectedClassesArr = expectedClasses.split(/\s/),
                            notSatisfiedClassesArr = _.difference(expectedClassesArr, actualClassesArr);

                        if (expectedClassesArr.length === 1) {
                            ret.message = "Expected to have class " + expectedClassesArr[0];
                        } else {
                            ret.message = "Expected to have classes " + expectedClassesArr.join(', ') + " but does not have classes " + notSatisfiedClassesArr.join(', ');
                        }

                        return notSatisfiedClassesArr.length === 0;
                    }),
                };

                return ret;
            },

            negativeCompare: function(element, forbiddenClasses) {
                var ret = {
                    pass: element.getAttribute('class').then(function(actualClasses) {
                        var actualClassesArr = actualClasses.split(/\s/),
                            forbiddenClassesArr = forbiddenClasses.split(/\s/),
                            satisfiedClassesArr = _.intersection(forbiddenClassesArr, actualClassesArr);

                        if (forbiddenClassesArr.length === 1) {
                            ret.message = "Expected to not have class " + forbiddenClassesArr[0];
                        } else {
                            ret.message = "Expected to not have classes " + forbiddenClassesArr.join(', ') + " but does have classes " + satisfiedClassesArr.join(', ');
                        }

                        return satisfiedClassesArr.length === 0;
                    }),
                };

                return ret;
            }
        };
    },
};
