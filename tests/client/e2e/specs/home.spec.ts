import { promise as WebDriverPromise } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { HomePage } from '../pages/home.page';


describe('Application', () => {
    let homePage: HomePage = new HomePage(new UserBrowser('Jack', browser).connect());

    it('should have a title', () => {
        let title: WebDriverPromise.Promise<string> = browser.getTitle();

        expect(title).toEqual('LumBoilerplate');
    });

    it('should have an "app" element', () => {
        expect(homePage.app).toBePresent();
    });

    it('should have a "to-do" element', () => {
        expect(homePage.toDo).toBePresent();
    });

    describe('To-Do Component', () => {
        beforeEach(() => {
            this.newItemLabel = 'Test New Item';
        });


        it('should have an "header" element', () => {
            expect(homePage.header).toBePresent();
        });

        it('should have a title', () => {
            expect(homePage.title).toBePresent();
            expect(homePage.title).toHaveExactText('To-do');
        });

        it('should have a section', () => {
            expect(homePage.section).toBePresent();
        });

        it('should have a "new-to-do" element', () => {
            expect(homePage.newToDo).toBePresent();
        });

        it('should have a "to-do-list" element', () => {
            expect(homePage.toDoList).toBePresent();
        });

        describe('New To-Do Component', () => {
            it('should have a "div" element', () => {
                expect(homePage.newToDoDiv).toBePresent();
            });

            it('should have a valid "New to-do item" input', () => {
                let inputType: WebDriverPromise.Promise<string> = homePage.newItemInput.getAttribute('type');

                expect(homePage.newItemInput).toBePresent();
                expect(inputType).toEqual('text');
            });

            it('should have a valid "Add" button', () => {
                expect(homePage.addNewItemButton).toBePresent();
                expect(homePage.addNewItemButton).toHaveExactText('Add');
            });

            it('add a new item', () => {
                homePage.addToDoItem(this.newItemLabel);

                expect(homePage.toDoListElements.count()).toBeGreaterThan(0);

                let lastItemLabel: protractor.ElementFinder = homePage.getLabel(homePage.getLastItem());
                expect(lastItemLabel).toContainText(this.newItemLabel);
            });
        });

        describe('To-Do List Component', () => {
            beforeEach(() => {
                expect(homePage.toDoListContainer).toBePresent();
                expect(homePage.toDoListElements.count()).toBeGreaterThan(0);

                this.lastItem = homePage.getLastItem();
                expect(this.lastItem).toHaveClass('to-do__item');

                this.lastItemLabel = homePage.getLabel(this.lastItem);
                this.lastItemDoneDate = homePage.getLabel(this.lastItem);
            });


            it('should have one undone "Test New Item" item', () => {
                expect(this.lastItemLabel).toContainText(this.newItemLabel);

                checkIsNotDone(this.lastItem);
            });

            it('can toggle an item', () => {
                checkIsNotDone(this.lastItem);

                homePage.toggleItem(this.lastItem);
                checkIsDone(this.lastItem);

                homePage.toggleItem(this.lastItem);
                checkIsNotDone(this.lastItem);
            });

            /**
             * Check if a to-do item is done or not.
             *
             * @param {protractor.ElementFinder} item        The item to check.
             * @param {boolean}                  [not=false] Indicates if we want to check that the item is not done.
             */
            function checkIsDone(item: protractor.ElementFinder, not: boolean = false): void { // tslint:disable-line
                let itemLabel: protractor.ElementFinder = homePage.getLabel(item);
                let itemDoneDate: protractor.ElementFinder = homePage.getDoneDate(item);

                if (not) {
                    expect(itemLabel).not.toHaveClass(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).not.toBePresent();
                } else {
                    expect(itemLabel).toHaveClass(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).toBePresent();
                }
            }

            /**
             * Check if a to-do item is not done.
             *
             * @param {protractor.ElementFinder} item The item to check.
             */
            function checkIsNotDone(item: protractor.ElementFinder): void { // tslint:disable-line
                checkIsDone(item, true);
            }
        });
    });
});
