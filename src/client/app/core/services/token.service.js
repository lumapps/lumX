"use strict";
var core_1 = require('@angular/core');
var store_1 = require('@ngrx/store');
var actions_1 = require('core/constants/actions');
var TokenService = (function () {
    function TokenService(_Store) {
        this._Store = _Store;
        this.token = this._Store.select('token');
    }
    TokenService.prototype.clearToken = function () {
        this._Store.dispatch({
            type: actions_1.TokenActions.TOKEN_CLEARED,
        });
    };
    TokenService.prototype.getToken = function () {
        var currentToken;
        this.token.take(1).subscribe(function (token) {
            if (token !== undefined) {
                currentToken = token.value;
            }
        });
        return currentToken;
    };
    TokenService.prototype.refreshToken = function () {
        this._Store.dispatch({
            type: actions_1.TokenActions.TOKEN_NEEDED,
        });
    };
    TokenService.prototype.setToken = function (token) {
        this._Store.dispatch({
            payload: token,
            type: actions_1.TokenActions.TOKEN_RECEIVED,
        });
    };
    TokenService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [store_1.Store])
    ], TokenService);
    return TokenService;
}());
exports.TokenService = TokenService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUUzQyxzQkFBc0IsYUFBYSxDQUFDLENBQUE7QUFHcEMsd0JBQTZCLHdCQUF3QixDQUFDLENBQUE7QUFRdEQ7SUFpQkksc0JBQW9CLE1BQTBCO1FBQTFCLFdBQU0sR0FBTixNQUFNLENBQW9CO1FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQWMsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUdELGlDQUFVLEdBQVY7UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNqQixJQUFJLEVBQUUsc0JBQVksQ0FBQyxhQUFhO1NBQ25DLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwrQkFBUSxHQUFSO1FBQ0ksSUFBSSxZQUFvQixDQUFDO1FBRXpCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEtBQWtCO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMvQixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxtQ0FBWSxHQUFaO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsSUFBSSxFQUFFLHNCQUFZLENBQUMsWUFBWTtTQUNsQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQWE7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsT0FBTyxFQUFFLEtBQUs7WUFDZCxJQUFJLEVBQUUsc0JBQVksQ0FBQyxjQUFjO1NBQ3BDLENBQUMsQ0FBQztJQUNQLENBQUM7SUF2REw7UUFBQyxpQkFBVSxFQUFFOztvQkFBQTtJQXdEYixtQkFBQztBQUFELENBQUMsQUFwREQsSUFvREM7QUFwRFksb0JBQVksZUFvRHhCLENBQUEifQ==