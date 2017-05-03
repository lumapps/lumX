/* tslint:disable:no-unused-expression */

import { expect } from '../../../../src/client/app/core/testing/chai.module';

import { browser } from 'protractor';

import { UserBrowser } from '../helpers/user-browser.class';

import { SimplePage } from '../pages/simple.page';


describe('Application', () => {
    /**
     * The page that describe the test.
     *
     * @type {SimplePage}
     * @readonly
     * @constant
     * @default
     */
    const simplePage: SimplePage = new SimplePage(new UserBrowser('Jack', browser).connect());


    it('should have a title', () => {
        browser.get('/');
        expect(browser.getTitle()).to.eventually.equal('LumBoilerplate');
    });

    it('should have an "lb-app" element', () => {
        expect(simplePage.app).to.eventually.be.present;
    });
});
