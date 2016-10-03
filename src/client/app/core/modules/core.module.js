"use strict";
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var store_1 = require('@ngrx/store');
var token_reducer_1 = require('core/reducers/token.reducer');
var http_interceptor_service_1 = require('core/services/http-interceptor.service');
var token_service_1 = require('core/services/token.service');
var CoreModule = (function () {
    function CoreModule() {
    }
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule,
            providers: [
                http_interceptor_service_1.HttpInterceptorService,
                token_service_1.TokenService,
            ],
        };
    };
    CoreModule = __decorate([
        core_1.NgModule({
            exports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpModule,
            ],
            imports: [
                common_1.CommonModule,
                store_1.StoreModule.provideStore(token_reducer_1.tokenReducer, token_reducer_1.initialState),
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], CoreModule);
    return CoreModule;
}());
exports.CoreModule = CoreModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb3JlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELHNCQUE0QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzdDLHFCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUUzQyxzQkFBbUMsYUFBYSxDQUFDLENBQUE7QUFFakQsOEJBQTJDLDZCQUE2QixDQUFDLENBQUE7QUFDekUseUNBQXVDLHdDQUF3QyxDQUFDLENBQUE7QUFDaEYsOEJBQTZCLDZCQUE2QixDQUFDLENBQUE7QUFvQjNEO0lBQUE7SUFnQkEsQ0FBQztJQVZVLGtCQUFPLEdBQWQ7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsVUFBVTtZQUVwQixTQUFTLEVBQUU7Z0JBQ1AsaURBQXNCO2dCQUN0Qiw0QkFBWTthQUNmO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFoQ0w7UUFBQyxlQUFRLENBQUM7WUFDTixPQUFPLEVBQUU7Z0JBQ0wscUJBQVk7Z0JBQ1osbUJBQVc7Z0JBQ1gsaUJBQVU7YUFDYjtZQUVELE9BQU8sRUFBRTtnQkFDTCxxQkFBWTtnQkFDWixtQkFBVyxDQUFDLFlBQVksQ0FBQyw0QkFBWSxFQUFFLDRCQUFZLENBQUM7YUFDdkQ7U0FDSixDQUFDOztrQkFBQTtJQXNCRixpQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksa0JBQVUsYUFnQnRCLENBQUEifQ==