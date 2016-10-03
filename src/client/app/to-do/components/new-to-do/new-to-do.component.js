"use strict";
var core_1 = require('@angular/core');
var selectors_settings_1 = require('core/settings/selectors.settings');
var selectors_settings_2 = require('core/settings/selectors.settings');
var to_do_item_model_1 = require('to-do/to-do-item.model');
var to_do_store_1 = require('to-do/to-do.store');
require('./new-to-do.component.scss');
var template = require('./' + selectors_settings_1.NEW_TO_DO_SELECTOR + '.component.html');
var NewToDoComponent = (function () {
    function NewToDoComponent(_ToDoStore) {
        this._ToDoStore = _ToDoStore;
        this.newItem = '';
    }
    NewToDoComponent.prototype.addItem = function () {
        var newItemId = this._ToDoStore.add(new to_do_item_model_1.ToDoItem(this.newItem));
        this.newItem = '';
        return newItemId;
    };
    NewToDoComponent = __decorate([
        core_1.Component({
            selector: selectors_settings_2.SELECTOR_PREFIX + selectors_settings_2.SELECTOR_SEPARATOR + selectors_settings_1.NEW_TO_DO_SELECTOR,
            template: template,
        }), 
        __metadata('design:paramtypes', [to_do_store_1.ToDoStore])
    ], NewToDoComponent);
    return NewToDoComponent;
}());
exports.NewToDoComponent = NewToDoComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXRvLWRvLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldy10by1kby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUEwQixlQUFlLENBQUMsQ0FBQTtBQUUxQyxtQ0FBK0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNsRixtQ0FBb0Qsa0NBQWtDLENBQUMsQ0FBQTtBQUV2RixpQ0FBeUIsd0JBQXdCLENBQUMsQ0FBQTtBQUNsRCw0QkFBMEIsbUJBQW1CLENBQUMsQ0FBQTtBQU05QyxRQUFPLDRCQUE0QixDQUFDLENBQUE7QUFLcEMsSUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFDLElBQUksR0FBRyx1Q0FBUSxHQUFHLGlCQUFpQixDQUFDLENBQUM7QUFZdEU7SUFpQkksMEJBQW9CLFVBQXFCO1FBQXJCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFWbEMsWUFBTyxHQUFXLEVBQUUsQ0FBQztJQVVnQixDQUFDO0lBUTdDLGtDQUFPLEdBQVA7UUFDSSxJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFbEIsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBdkNMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxvQ0FBZSxHQUFHLHVDQUFrQixHQUFHLHVDQUFRO1lBQ3pELFFBQVEsRUFBRSxRQUFRO1NBQ3JCLENBQUM7O3dCQUFBO0lBcUNGLHVCQUFDO0FBQUQsQ0FBQyxBQS9CRCxJQStCQztBQS9CWSx3QkFBZ0IsbUJBK0I1QixDQUFBIn0=