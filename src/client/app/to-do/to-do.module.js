"use strict";
var core_1 = require('@angular/core');
var core_module_1 = require('core/modules/core.module');
var to_do_store_1 = require('to-do/to-do.store');
var new_to_do_component_1 = require('to-do/components/new-to-do/new-to-do.component');
var to_do_list_component_1 = require('to-do/components/to-do-list/to-do-list.component');
var to_do_component_1 = require('to-do/components/to-do.component');
var ToDoModule = (function () {
    function ToDoModule() {
    }
    ToDoModule = __decorate([
        core_1.NgModule({
            declarations: [
                new_to_do_component_1.NewToDoComponent,
                to_do_component_1.ToDoComponent,
                to_do_list_component_1.ToDoListComponent,
            ],
            exports: [
                core_module_1.CoreModule,
                to_do_component_1.ToDoComponent,
            ],
            imports: [
                core_module_1.CoreModule,
            ],
            providers: [
                to_do_store_1.ToDoStore,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], ToDoModule);
    return ToDoModule;
}());
exports.ToDoModule = ToDoModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZG8ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG8tZG8ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFFekMsNEJBQTJCLDBCQUEwQixDQUFDLENBQUE7QUFFdEQsNEJBQTBCLG1CQUFtQixDQUFDLENBQUE7QUFFOUMsb0NBQWlDLGdEQUFnRCxDQUFDLENBQUE7QUFDbEYscUNBQWtDLGtEQUFrRCxDQUFDLENBQUE7QUFDckYsZ0NBQThCLGtDQUFrQyxDQUFDLENBQUE7QUE0QmpFO0lBQUE7SUFBeUIsQ0FBQztJQXpCMUI7UUFBQyxlQUFRLENBQUM7WUFDTixZQUFZLEVBQUU7Z0JBQ1Ysc0NBQWdCO2dCQUNoQiwrQkFBYTtnQkFDYix3Q0FBaUI7YUFDcEI7WUFFRCxPQUFPLEVBQUU7Z0JBQ0wsd0JBQVU7Z0JBQ1YsK0JBQWE7YUFDaEI7WUFFRCxPQUFPLEVBQUU7Z0JBQ0wsd0JBQVU7YUFDYjtZQUVELFNBQVMsRUFBRTtnQkFDUCx1QkFBUzthQUNaO1NBQ0osQ0FBQzs7a0JBQUE7SUFNdUIsaUJBQUM7QUFBRCxDQUFDLEFBQTFCLElBQTBCO0FBQWIsa0JBQVUsYUFBRyxDQUFBIn0=