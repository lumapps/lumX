"use strict";
var actions_1 = require('core/constants/actions');
exports.initialState = {
    needed: false,
    value: undefined,
};
exports.tokenReducer = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case actions_1.TokenActions.TOKEN_RECEIVED:
            return Object.assign({}, state, {
                needed: false,
                value: action.payload,
            });
        case actions_1.TokenActions.TOKEN_NEEDED:
            return Object.assign({}, state, {
                needed: true,
            });
        case actions_1.TokenActions.TOKEN_CLEARED:
            return Object.assign({});
        default:
            return state;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4ucmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRva2VuLnJlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLHdCQUE2Qix3QkFBd0IsQ0FBQyxDQUFBO0FBa0J6QyxvQkFBWSxHQUFnQjtJQU9yQyxNQUFNLEVBQUUsS0FBSztJQVFiLEtBQUssRUFBRSxTQUFTO0NBQ25CLENBQUM7QUFVVyxvQkFBWSxHQUErQixVQUFDLEtBQWlDLEVBQUUsTUFBYztJQUFqRCxxQkFBaUMsR0FBakMsNEJBQWlDO0lBQ3RGLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLEtBQUssc0JBQVksQ0FBQyxjQUFjO1lBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7Z0JBQzVCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTzthQUN4QixDQUFDLENBQUM7UUFFUCxLQUFLLHNCQUFZLENBQUMsWUFBWTtZQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFO2dCQUM1QixNQUFNLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQztRQUVQLEtBQUssc0JBQVksQ0FBQyxhQUFhO1lBQzNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdCO1lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNyQixDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=