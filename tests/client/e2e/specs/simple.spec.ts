import { promise as WebDriverPromise } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { SimplePage } from '../pages/simple.page';


describe('Application', () => {
    let homePage: SimplePage = new SimplePage(new UserBrowser('Jack', browser).connect());

    it('should have a title', () => {
        let title: WebDriverPromise.Promise<string> = browser.getTitle();

        expect(title).toEqual('LumX²');
    });

    it('should have an "app" element', () => {
        expect(homePage.app).toBePresent();
    });
});
