"use strict";
var _this = this;
var user_browser_class_1 = require('../helpers/user-browser.class');
var home_page_1 = require('../pages/home.page');
describe('Application', function () {
    var homePage = new home_page_1.HomePage(new user_browser_class_1.UserBrowser('Jack', browser).connect());
    it('should have a title', function () {
        var title = browser.getTitle();
        expect(title).toEqual('LumBoilerplate');
    });
    it('should have an "app" element', function () {
        expect(homePage.app).toBePresent();
    });
    it('should have a "to-do" element', function () {
        expect(homePage.toDo).toBePresent();
    });
    describe('To-Do Component', function () {
        beforeEach(function () {
            _this.newItemLabel = 'Test New Item';
        });
        it('should have an "header" element', function () {
            expect(homePage.header).toBePresent();
        });
        it('should have a title', function () {
            expect(homePage.title).toBePresent();
            expect(homePage.title).toHaveExactText('Todos');
        });
        it('should have a section', function () {
            expect(homePage.section).toBePresent();
        });
        it('should have a "new-to-do" element', function () {
            expect(homePage.newToDo).toBePresent();
        });
        it('should have a "to-do-list" element', function () {
            expect(homePage.toDoList).toBePresent();
        });
        describe('New To-Do Component', function () {
            it('should have a "div" element', function () {
                expect(homePage.newToDoDiv).toBePresent();
            });
            it('should have a valid "New to-do item" input', function () {
                var inputType = homePage.newItemInput.getAttribute('type');
                expect(homePage.newItemInput).toBePresent();
                expect(inputType).toEqual('text');
            });
            it('should have a valid "Add" button', function () {
                expect(homePage.addNewItemButton).toBePresent();
                expect(homePage.addNewItemButton).toHaveExactText('Add');
            });
            it('add a new item', function () {
                homePage.addToDoItem(_this.newItemLabel);
                expect(homePage.toDoListElements.count()).toBeGreaterThan(0);
                var lastItemLabel = homePage.getLabel(homePage.getLastItem());
                expect(lastItemLabel).toContainText(_this.newItemLabel);
            });
        });
        describe('To-Do List Component', function () {
            beforeEach(function () {
                expect(homePage.toDoListContainer).toBePresent();
                expect(homePage.toDoListElements.count()).toBeGreaterThan(0);
                _this.lastItem = homePage.getLastItem();
                expect(_this.lastItem).toHaveClass('to-do__item');
                _this.lastItemLabel = homePage.getLabel(_this.lastItem);
                _this.lastItemDoneDate = homePage.getLabel(_this.lastItem);
            });
            it('should have one undone "Test New Item" item', function () {
                expect(_this.lastItemLabel).toContainText(_this.newItemLabel);
                checkIsNotDone(_this.lastItem);
            });
            it('can toggle an item', function () {
                checkIsNotDone(_this.lastItem);
                homePage.toggleItem(_this.lastItem);
                checkIsDone(_this.lastItem);
                homePage.toggleItem(_this.lastItem);
                checkIsNotDone(_this.lastItem);
            });
            function checkIsDone(item, not) {
                if (not === void 0) { not = false; }
                var itemLabel = homePage.getLabel(item);
                var itemDoneDate = homePage.getDoneDate(item);
                if (not) {
                    expect(itemLabel).not.toHaveClass(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).not.toBePresent();
                }
                else {
                    expect(itemLabel).toHaveClass(homePage.toDoItemDoneClass);
                    expect(itemDoneDate).toBePresent();
                }
            }
            function checkIsNotDone(item) {
                checkIsDone(item, true);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkF5SUE7QUF2SUEsbUNBQTRCLCtCQUErQixDQUFDLENBQUE7QUFFNUQsMEJBQXlCLG9CQUFvQixDQUFDLENBQUE7QUFHOUMsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUNwQixJQUFJLFFBQVEsR0FBYSxJQUFJLG9CQUFRLENBQUMsSUFBSSxnQ0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRWxGLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN0QixJQUFJLEtBQUssR0FBcUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDeEIsVUFBVSxDQUFDO1lBQ1AsS0FBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFHSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN0QixNQUFN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