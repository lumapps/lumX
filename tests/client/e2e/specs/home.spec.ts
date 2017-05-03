/* tslint:disable:no-unused-expression */

import { expect } from '../../../../src/client/app/core/testing/chai-e2e.module';

import { ElementFinder, browser } from 'protractor';

import { UserBrowser } from '../helpers/user-browser.class';

import { HomePage } from '../pages/home.page';


describe('Application', () => {
    /**
     * The page that describes the test.
     *
     * @type {HomePage}
     * @readonly
     * @constant
     * @default
     */
    const homePage: HomePage = new HomePage(new UserBrowser('Jack', browser).connect());


    it('should have a title', () => {
        browser.get('/');
        expect(browser.getTitle()).to.eventually.equal('LumBoilerplate');
    });

    it('should have an "lb-app" element', () => {
        expect(homePage.app).to.eventually.be.present;
    });

    it('should have a "lb-to-do" element', () => {
        expect(homePage.toDo).to.eventually.be.present;
    });

    describe('To-Do Component', () => {
        /**
         * The label of the new item to add to the To-Do List.
         *
         * @type {string}
         * @readonly
         * @constant
         * @default
         */
        const newItemLabel: string = 'Test New Item';


        it('should have an "header" element', () => {
            expect(homePage.header).to.eventually.be.present;
        });

        it('should have a title', () => {
            expect(homePage.title).to.eventually.be.present;
            expect(homePage.title.getText()).to.eventually.equal('To-do');
        });

        it('should have a section', () => {
            expect(homePage.section).to.eventually.be.present;
        });

        it('should have a "new-to-do" element', () => {
            expect(homePage.newToDo).to.eventually.be.present;
        });

        it('should have a "to-do-list" element', () => {
            expect(homePage.toDoList).to.eventually.be.present;
        });

        describe('New To-Do Component', () => {
            it('should have a "div" element', () => {
                expect(homePage.newToDoDiv).to.eventually.be.present;
            });

            it('should have a valid "New to-do item" input', () => {
                expect(homePage.newItemInput).to.eventually.be.present;
                expect(homePage.newItemInput.getAttribute('type')).to.eventually.equal('text');
            });

            it('should have a valid "Add" button', () => {
                expect(homePage.addNewItemButton).to.eventually.be.present;
                expect(homePage.addNewItemButton.getText()).to.eventually.equal('Add');
            });

            it('add a new item', () => {
                homePage.addToDoItem(newItemLabel);

                expect(homePage.toDoListElements.count()).to.be.eventually.above(0);

                const lastItemLabel: ElementFinder = homePage.getLabel(homePage.getLastItem());
                expect(lastItemLabel.getText()).to.eventually.contain(newItemLabel);
            });
        });

        describe('To-Do List Component', () => {
            /**
             * The last item of the To-Do List.
             *
             * @type {ElementFinder}
             */
            let lastItem: ElementFinder;

            /**
             * The label of the last item of the To-Do List.
             *
             * @type {ElementFinder}
             */
            let lastItemLabel: ElementFinder;

            /**
             * The done date of the last item of the To-Do List.
             *
             * @type {ElementFinder}
             */
            let lastItemDoneDate: ElementFinder;


            beforeEach(() => {
                expect(homePage.toDoListContainer).to.eventually.be.present;
                expect(homePage.toDoListElements.count()).to.be.eventually.above(0);

                lastItem = homePage.getLastItem();
                expect(lastItem.getAttribute('class')).to.eventually.contain('to-do__item');

                lastItemLabel = homePage.getLabel(lastItem);
                lastItemDoneDate = homePage.getDoneDate(lastItem);
            });


            it('should have one undone "Test New Item" item', () => {
                expect(lastItemLabel.getText()).to.eventually.contain(newItemLabel);

                checkIsNotDone(lastItem);
            });

            it('can toggle an item', () => {
                checkIsNotDone(lastItem);

                homePage.toggleItem(lastItem);
                checkIsDone(lastItem);

                homePage.toggleItem(lastItem);
                checkIsNotDone(lastItem);
            });

            /**
             * Check if a to-do item is done or not.
             *
             * @param {ElementFinder} item  The item to check.
             * @param {boolean}       [not=false] Indicates if we want to check that the item is not done.
             */
            function checkIsDone(item: ElementFinder, not: boolean = false): void {
                const itemLabel: ElementFinder = homePage.getLabel(item);
                const itemDoneDate: ElementFinder = homePage.getDoneDate(item);

                if (not) {
                    expect(itemLabel.getAttribute('class')).to.eventually.not.contain(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).to.eventually.not.be.present;
                } else {
                    expect(itemLabel.getAttribute('class')).to.eventually.contain(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).to.eventually.be.present;
                }
            }

            /**
             * Check if a to-do item is not done.
             *
             * @param {ElementFinder} item The item to check.
             */
            function checkIsNotDone(item: ElementFinder): void {
                checkIsDone(item, true);
            }
        });
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
