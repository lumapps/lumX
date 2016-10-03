"use strict";
var protractor_1 = require('protractor');
Array.prototype['except'] = function (o) {
    return this.filter(function (i) { return o.indexOf(i) < 0; });
};
Array.prototype['intersect'] = function (o) {
    return this.filter(function (i) { return o.indexOf(i) !== -1; });
};
var UserBrowser = (function () {
    function UserBrowser(name, browser) {
        this.name = name;
        this.browser = browser;
        this.$ = browser.$;
        this.$$ = browser.$$;
        this.element = browser.element;
        this.driver = browser.driver;
        this.sleep = browser.sleep;
        this.prefix = 'PTOR_' + this.name.toUpperCase() + '_';
    }
    UserBrowser.prototype.appendChild = function (element, destination) {
        return this.browser.executeScript('arguments[1].appendChild(arguments[0]);', element.getWebElement(), destination.getWebElement());
    };
    UserBrowser.prototype.evaluateBoolean = function (bool) {
        return bool;
    };
    UserBrowser.prototype.clickOn = function (element, isWebElement, timeout) {
        var _this = this;
        if (isWebElement === void 0) { isWebElement = false; }
        if (timeout === void 0) { timeout = 1000; }
        isWebElement = isWebElement || false;
        this.driver.wait(function () {
            return element.isPresent().then(_this.evaluateBoolean)
                && element.isDisplayed().then(_this.evaluateBoolean)
                && protractor_1.ExpectedConditions.elementToBeClickable(element);
        }, timeout);
        this.browser.sleep(timeout / 10);
        this.browser
            .executeScript('arguments[0].click();', (isWebElement) ? element : element.getWebElement())
            .then(function () {
            _this.browser.waitForAngular();
        });
    };
    UserBrowser.prototype.connect = function () {
        this.driver.get(this.browser.baseUrl);
        return this;
    };
    UserBrowser.prototype.insertAfter = function (element, destination) {
        return this.browser.executeScript('arguments[0].parentNode.insertAfter(arguments[0], arguments[1]);', element.getWebElement(), destination.getWebElement());
    };
    UserBrowser.prototype.insertBefore = function (element, destination) {
        return this.browser.executeScript('arguments[0].parentNode.insertBefore(arguments[0], arguments[1]);', element.getWebElement(), destination.getWebElement());
    };
    UserBrowser.prototype.scrollAndInput = function (element, keys, clear, prefix, isWebElement, timeout) {
        var _this = this;
        if (clear === void 0) { clear = true; }
        if (prefix === void 0) { prefix = false; }
        if (isWebElement === void 0) { isWebElement = false; }
        if (timeout === void 0) { timeout = 1000; }
        isWebElement = isWebElement || false;
        this.driver.wait(function () {
            return element.isPresent().then(_this.evaluateBoolean) && element.isDisplayed().then(_this.evaluateBoolean)
                && protractor.ExpectedConditions.elementToBeClickable(element);
        }, timeout);
        this.browser.sleep(timeout / 10);
        this.browser
            .executeScript('arguments[0].scrollIntoView();', isWebElement ? element : element.getWebElement())
            .then(function () {
            if (clear) {
                element.clear();
            }
            element.getText().then(function (text) {
                var input = (text === '' && prefix) ? _this.prefix + keys : keys;
                element.sendKeys(input).then(function () {
                    _this.browser.waitForAngular();
                });
            });
        });
    };
    return UserBrowser;
}());
exports.UserBrowser = UserBrowser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1icm93c2VyLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1icm93c2VyLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyQkFBNEQsWUFBWSxDQUFDLENBQUE7QUFTekUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFTLENBQUM7SUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBSSxDQUFJLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBUyxDQUFDO0lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUksQ0FBSSxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO0FBQ3pELENBQUMsQ0FBQztBQU1GO0lBcUVJLHFCQUFZLElBQVksRUFBRSxPQUFpQjtRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FB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