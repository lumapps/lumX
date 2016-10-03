"use strict";
var testing_1 = require('@angular/core/testing');
var forms_1 = require('@angular/forms');
var to_do_store_1 = require('to-do/to-do.store');
var app_module_1 = require('app.module');
describe('New To-Do', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_module_1.AppModule,
                forms_1.FormsModule,
            ],
            providers: [
                to_do_store_1.ToDoStore,
            ],
        });
        testing_1.TestBed.compileComponents().catch(function (error) { return console.error(error); });
    });
    xit('can add an new to-do item', testing_1.inject([to_do_store_1.ToDoStore], function (toDoStore) {
        expect(toDoStore.items).toBeDefined();
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXRvLWRvLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXctdG8tZG8uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQWdDLHVCQUF1QixDQUFDLENBQUE7QUFDeEQsc0JBQTRCLGdCQUFnQixDQUFDLENBQUE7QUFHN0MsNEJBQTBCLG1CQUFtQixDQUFDLENBQUE7QUFFOUMsMkJBQTBCLFlBQVksQ0FBQyxDQUFBO0FBR3ZDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDbEIsVUFBVSxDQUFDO1FBQ1AsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztZQUMzQixPQUFPLEVBQUU7Z0JBQ0wsc0JBQVM7Z0JBQ1QsbUJBQVc7YUFDZDtZQUVELFNBQVMsRUFBRTtnQkFDUCx1QkFBUzthQUNaO1NBQ0osQ0FBQyxDQUFDO1FBRUgsaUJBQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQWEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztJQUMvRSxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxnQkFBTSxDQUFDLENBQUMsdUJBQVMsQ0FBQyxFQUFFLFVBQUMsU0FBb0I7UUFDdEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQyxDQUFDLENBQUMifQ==