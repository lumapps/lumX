"use strict";
var core_1 = require('@angular/core');
var selectors_settings_1 = require('core/settings/selectors.settings');
var selectors_settings_2 = require('core/settings/selectors.settings');
var to_do_item_model_1 = require('to-do/to-do-item.model');
var to_do_store_1 = require('to-do/to-do.store');
require('./to-do.component.scss');
var template = require('./' + selectors_settings_1.TO_DO_SELECTOR + '.component.html');
var ToDoComponent = (function () {
    function ToDoComponent(_ToDoStore) {
        this._ToDoStore = _ToDoStore;
        _ToDoStore.add(new to_do_item_model_1.ToDoItem('Install Boilerplate', new Date()));
        _ToDoStore.add(new to_do_item_model_1.ToDoItem('Run a play with default Boilerplate', new Date()));
        _ToDoStore.add(new to_do_item_model_1.ToDoItem('Run Unit and E2E test on Boilerplate'));
    }
    ToDoComponent = __decorate([
        core_1.Component({
            selector: selectors_settings_2.SELECTOR_PREFIX + selectors_settings_2.SELECTOR_SEPARATOR + selectors_settings_1.TO_DO_SELECTOR,
            template: template,
        }), 
        __metadata('design:paramtypes', [to_do_store_1.ToDoStore])
    ], ToDoComponent);
    return ToDoComponent;
}());
exports.ToDoComponent = ToDoComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZG8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG8tZG8uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBMEIsZUFBZSxDQUFDLENBQUE7QUFFMUMsbUNBQTJDLGtDQUFrQyxDQUFDLENBQUE7QUFDOUUsbUNBQW9ELGtDQUFrQyxDQUFDLENBQUE7QUFFdkYsaUNBQXlCLHdCQUF3QixDQUFDLENBQUE7QUFDbEQsNEJBQTBCLG1CQUFtQixDQUFDLENBQUE7QUFNOUMsUUFBTyx3QkFBd0IsQ0FBQyxDQUFBO0FBS2hDLElBQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUNBQVEsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0FBWXRFO0lBUUksdUJBQW9CLFVBQXFCO1FBQXJCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDckMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFRLENBQUMscUJBQXFCLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFRLENBQUMscUNBQXFDLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEYsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFRLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFyQkw7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLG9DQUFlLEdBQUcsdUNBQWtCLEdBQUcsbUNBQVE7WUFDekQsUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQzs7cUJBQUE7SUFtQkYsb0JBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQWJZLHFCQUFhLGdCQWF6QixDQUFBIn0=