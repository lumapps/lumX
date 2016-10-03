"use strict";
var testing_1 = require('@angular/core/testing');
var to_do_item_model_1 = require('to-do/to-do-item.model');
var to_do_store_1 = require('to-do/to-do.store');
var app_module_1 = require('app.module');
describe('To-Do List', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_module_1.AppModule,
            ],
            providers: [
                to_do_store_1.ToDoStore,
            ],
        });
        testing_1.TestBed.compileComponents().catch(function (error) { return console.error(error); });
    });
    it('can toggle the state of a to-do item', testing_1.inject([to_do_store_1.ToDoStore], function (toDoStore) {
        toDoStore.reset();
        var notDone = toDoStore.add(new to_do_item_model_1.ToDoItem('Not done'));
        var doneDate = new Date();
        var done = toDoStore.add(new to_do_item_model_1.ToDoItem('Done', doneDate));
        expect(toDoStore.items[notDone].done).toBeUndefined();
        expect(toDoStore.items[done].done).toBe(doneDate);
        var doneOn = toDoStore.items[notDone].toggle();
        var wasDone = toDoStore.items[done].toggle();
        expect(toDoStore.items[notDone].done).toBe(doneOn);
        expect(toDoStore.items[done].done).toBeUndefined();
        expect(wasDone).toBe(doneDate);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZG8tbGlzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG8tZG8tbGlzdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBZ0MsdUJBQXVCLENBQUMsQ0FBQTtBQUV4RCxpQ0FBeUIsd0JBQXdCLENBQUMsQ0FBQTtBQUNsRCw0QkFBMEIsbUJBQW1CLENBQUMsQ0FBQTtBQUU5QywyQkFBMEIsWUFBWSxDQUFDLENBQUE7QUFHdkMsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNuQixVQUFVLENBQUM7UUFDUCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzNCLE9BQU8sRUFBRTtnQkFDTCxzQkFBUzthQUNaO1lBRUQsU0FBUyxFQUFFO2dCQUNQLHVCQUFTO2FBQ1o7U0FDSixDQUFDLENBQUM7UUFFSCxpQkFBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBYSxJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLGdCQUFNLENBQUMsQ0FBQyx1QkFBUyxDQUFDLEVBQUUsVUFBQyxTQUFvQjtRQUM3RSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFHbEIsSUFBSSxPQUFPLEdBQVcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUU5RCxJQUFNLFFBQVEsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFXLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSwyQkFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRCxJQUFJLE1BQU0sR0FBUyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3JELElBQUksT0FBTyxHQUFTLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNSLENBQUMsQ0FBQyxDQUFDIn0=