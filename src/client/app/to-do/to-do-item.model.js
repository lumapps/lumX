"use strict";
var ToDoItem = (function () {
    function ToDoItem(label, done, due) {
        this.label = label;
        this.done = done;
        this.due = due;
    }
    ToDoItem.prototype.do = function () {
        this.done = new Date();
        return this.done;
    };
    ToDoItem.prototype.toggle = function () {
        if (this.done) {
            return this.unDo();
        }
        else {
            return this.do();
        }
    };
    ToDoItem.prototype.toString = function () {
        var stringRep = "[" + this.id + "] - " + this.label;
        if (this.due) {
            stringRep = stringRep + " (due " + this.due + ")";
        }
        if (this.done) {
            stringRep = stringRep + " - done (" + this.done + ")";
        }
        return stringRep;
    };
    ToDoItem.prototype.unDo = function () {
        var wasDone = this.done;
        this.done = undefined;
        return wasDone;
    };
    return ToDoItem;
}());
exports.ToDoItem = ToDoItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZG8taXRlbS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvLWRvLWl0ZW0ubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQWNBO0lBd0NJLGtCQUFZLEtBQWEsRUFBRSxJQUFXLEVBQUUsR0FBVTtRQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBUUQscUJBQUUsR0FBRjtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBUUQseUJBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0lBT0QsMkJBQVEsR0FBUjtRQUNJLElBQUksU0FBUyxHQUFXLE1BQUksSUFBSSxDQUFDLEVBQUUsWUFBTyxJQUFJLENBQUMsS0FBTyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsU0FBUyxHQUFNLFNBQVMsY0FBUyxJQUFJLENBQUMsR0FBRyxNQUFHLENBQUM7UUFDakQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1osU0FBUyxHQUFNLFNBQVMsaUJBQVksSUFBSSxDQUFDLElBQUksTUFBRyxDQUFDO1FBQ3JELENBQUM7UUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFPRCx1QkFBSSxHQUFKO1FBQ0ksSUFBSSxPQUFPLEdBQVMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUU5QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUV0QixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQXRHRCxJQXNHQztBQXRHWSxnQkFBUSxXQXNHcEIsQ0FBQSJ9