"use strict";
var core_1 = require('@angular/core');
var selectors_settings_1 = require('core/settings/selectors.settings');
var selectors_settings_2 = require('core/settings/selectors.settings');
var http_interceptor_service_1 = require('core/services/http-interceptor.service');
var token_service_1 = require('core/services/token.service');
require('main.scss');
require('app.component.scss');
var template = require('./' + selectors_settings_1.APP_SELECTOR + '.component.html');
var AppComponent = (function () {
    function AppComponent(_Http, _TokenService) {
        _Http.get('/services/oauthtoken')
            .map(function (response) { return response.json(); })
            .subscribe(function (tokenResponse) { return _TokenService.setToken(tokenResponse.token); });
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: selectors_settings_2.SELECTOR_PREFIX + selectors_settings_2.SELECTOR_SEPARATOR + selectors_settings_1.APP_SELECTOR,
            template: template,
        }), 
        __metadata('design:paramtypes', [http_interceptor_service_1.HttpInterceptorService, token_service_1.TokenService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUE2QyxlQUFlLENBQUMsQ0FBQTtBQUc3RCxtQ0FBeUMsa0NBQWtDLENBQUMsQ0FBQTtBQUM1RSxtQ0FBb0Qsa0NBQWtDLENBQUMsQ0FBQTtBQUl2Rix5Q0FBdUMsd0NBQXdDLENBQUMsQ0FBQTtBQUNoRiw4QkFBNkIsNkJBQTZCLENBQUMsQ0FBQTtBQU0zRCxRQUFPLFdBQVcsQ0FBQyxDQUFBO0FBS25CLFFBQU8sb0JBQW9CLENBQUMsQ0FBQTtBQUs1QixJQUFNLFFBQVEsR0FBVyxPQUFPLENBQUMsSUFBSSxHQUFHLGlDQUFRLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQWF0RTtJQVNJLHNCQUFZLEtBQTZCLEVBQUUsYUFBMkI7UUFDbEUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQzthQUM1QixHQUFHLENBQUMsVUFBQyxRQUFrQixJQUFLLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQzthQUM1QyxTQUFTLENBQ04sVUFBQyxhQUE0QixJQUFLLE9BQUEsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQTNDLENBQTJDLENBQ2hGLENBQUM7SUFDVixDQUFDO0lBekJMO1FBQUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxvQ0FBZSxHQUFHLHVDQUFrQixHQUFHLGlDQUFRO1lBQ3pELFFBQVEsRUFBRSxRQUFRO1NBQ3JCLENBQUM7O29CQUFBO0lBdUJGLG1CQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQWhCWSxvQkFBWSxlQWdCeEIsQ0FBQSJ9