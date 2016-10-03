"use strict";
var core_1 = require('@angular/core');
var selectors_settings_1 = require('core/settings/selectors.settings');
var selectors_settings_2 = require('core/settings/selectors.settings');
var to_do_store_1 = require('to-do/to-do.store');
require('./to-do-list.component.scss');
var template = require('./' + selectors_settings_1.TO_DO_LIST_SELECTOR + '.component.html');
var ToDoListComponent = (function () {
    function ToDoListComponent(_ToDoStore) {
        this._ToDoStore = _ToDoStore;
    }
    ToDoListComponent = __decorate([
        core_1.Component({
            selector: selectors_settings_2.SELECTOR_PREFIX + selectors_settings_2.SELECTOR_SEPARATOR + selectors_settings_1.TO_DO_LIST_SELECTOR,
            template: template,
        }), 
        __metadata('design:paramtypes', [to_do_store_1.ToDoStore])
    ], ToDoListComponent);
    return ToDoListComponent;
}());
exports.ToDoListComponent = ToDoListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZG8tbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0by1kby1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDLG1DQUFnRCxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ25GLG1DQUFvRCxrQ0FBa0MsQ0FBQyxDQUFBO0FBRXZGLDRCQUEwQixtQkFBbUIsQ0FBQyxDQUFBO0FBTTlDLFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQUtyQyxJQUFNLFFBQVEsR0FBVyxPQUFPLENBQUMsSUFBSSxHQUFHLHdDQUFRLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQVl0RTtJQVFJLDJCQUFvQixVQUFxQjtRQUFyQixlQUFVLEdBQVYsVUFBVSxDQUFXO0lBQUcsQ0FBQztJQWpCakQ7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLG9DQUFlLEdBQUcsdUNBQWtCLEdBQUcsd0NBQVE7WUFDekQsUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQzs7eUJBQUE7SUFlRix3QkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBVFkseUJBQWlCLG9CQVM3QixDQUFBIn0=