"use strict";
var selectors_settings_1 = require('../../../../src/client/app/core/settings/selectors.settings');
var HomePage = (function () {
    function HomePage(userBrowser) {
        this.userBrowser = userBrowser;
        this.addNewItemButtonClass = '.add-item__btn';
        this.newItemInputClass = '.new-item__input';
        this.toDoItemDoneClass = 'to-do__item-label--is-done';
        this.toDoItemDoneDateClass = 'to-do__item-done-date';
        this.toDoItemLabelClass = 'to-do__item-label';
        this.toDoListClass = '.to-do__list';
        this._toDoItemDoneDateAccessor = by.css('.' + this.toDoItemDoneDateClass);
        this._toDoItemLabelAccessor = by.css('.' + this.toDoItemLabelClass);
        this.app = this.userBrowser.element(by.tagName(selectors_settings_1.SELECTOR_PREFIX + '-' + selectors_settings_1.APP_SELECTOR));
        this.toDo = this.app.element(by.tagName(selectors_settings_1.SELECTOR_PREFIX + '-' + selectors_settings_1.TO_DO_SELECTOR));
        this.header = this.toDo.element(by.tagName('header'));
        this.title = this.header.element(by.tagName('h1'));
        this.section = this.toDo.element(by.tagName('section'));
        this.newToDo = this.section.element(by.tagName(selectors_settings_1.SELECTOR_PREFIX + '-' + selectors_settings_1.NEW_TO_DO_SELECTOR));
        this.addNewItemButton = this.newToDo.element(by.css(this.addNewItemButtonClass));
        this.newItemInput = this.newToDo.element(by.css(this.newItemInputClass));
        this.newToDoDiv = this.newToDo.element(by.tagName('div'));
        this.toDoList = this.section.element(by.tagName(selectors_settings_1.SELECTOR_PREFIX + '-' + selectors_settings_1.TO_DO_LIST_SELECTOR));
        this.toDoListContainer = this.toDoList.element(by.css(this.toDoListClass));
        this.toDoListElements = this.toDoListContainer.all(by.tagName('li'));
    }
    HomePage.prototype.addToDoItem = function (label) {
        this.newItemInput.sendKeys(label);
        this.addNewItemButton.click();
    };
    HomePage.prototype.getDoneDate = function (item) {
        return item.element(this._toDoItemDoneDateAccessor);
    };
    HomePage.prototype.getLabel = function (item) {
        return item.element(this._toDoItemLabelAccessor);
    };
    HomePage.prototype.getLastItem = function () {
        return this.toDoListElements && this.toDoListElements.last();
    };
    HomePage.prototype.toggleItem = function (item) {
        item.click();
    };
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZS5wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFLQSxtQ0FDUyw2REFBNkQsQ0FBQyxDQUFBO0FBTXZFO0lBa0RJLGtCQUFtQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQTNDcEMsMEJBQXFCLEdBQVcsZ0JBQWdCLENBQUM7UUFDakQsc0JBQWlCLEdBQVcsa0JBQWtCLENBQUM7UUFDL0Msc0JBQWlCLEdBQVcsNEJBQTRCLENBQUM7UUFDekQsMEJBQXFCLEdBQVcsdUJBQXVCLENBQUM7UUFDeEQsdUJBQWtCLEdBQVcsbUJBQW1CLENBQUM7UUFDakQsa0JBQWEsR0FBVyxjQUFjLENBQUM7UUF1QzFDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFcEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLG9DQUFlLEdBQUcsR0FBRyxHQUFHLGlDQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQ0FBZSxHQUFHLEdBQUcsR0FBRyxtQ0FBYyxDQUFDLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0NBQWUsR0FBRyxHQUFHLEdBQUcsdUNBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLG9DQUFlLEdBQUcsR0FBRyxHQUFHLHdDQUFtQixDQUFDLENBQUMsQ0FBQztRQUM5RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQVFELDhCQUFXLEdBQVgsVUFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBUUQsOEJBQVcsR0FBWCxVQUFZLElBQW1CO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFRRCwyQkFBUSxHQUFSLFVBQVMsSUFBbUI7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQU9ELDhCQUFXLEdBQVg7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBT0QsNkJBQVUsR0FBVixVQUFXLElBQW1CO1FBQzFCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0wsZUFBQztBQUFELENBQUMsQUF0SEQsSUFzSEM7QUF0SFksZ0JBQVEsV0FzSHBCLENBQUEifQ==