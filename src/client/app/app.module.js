"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var hmr_1 = require('@angularclass/hmr');
var core_module_1 = require('core/modules/core.module');
var to_do_module_1 = require('to-do/to-do.module');
var app_component_1 = require('app.component');
var AppModule = (function () {
    function AppModule(_appRef) {
        this._appRef = _appRef;
    }
    AppModule.prototype.hmrAfterDestroy = function (_HmrStore) {
        _HmrStore.disposeOldHosts();
        delete _HmrStore.disposeOldHosts;
    };
    AppModule.prototype.hmrOnDestroy = function (_HmrStore) {
        var cmpLocation = this._appRef.components.map(function (cmp) {
            return cmp.location.nativeElement;
        });
        _HmrStore.disposeOldHosts = hmr_1.createNewHosts(cmpLocation);
        hmr_1.removeNgStyles();
    };
    AppModule.prototype.hmrOnInit = function (_HmrStore) {
        if (!_HmrStore || !_HmrStore.state) {
            return;
        }
        this._appRef.tick();
    };
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent,
            ],
            declarations: [
                app_component_1.AppComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                core_module_1.CoreModule.forRoot(),
                to_do_module_1.ToDoModule,
            ],
        }), 
        __metadata('design:paramtypes', [core_1.ApplicationRef])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUE0RCxlQUFlLENBQUMsQ0FBQTtBQUM1RSxpQ0FBOEIsMkJBQTJCLENBQUMsQ0FBQTtBQUUxRCxvQkFBK0MsbUJBQW1CLENBQUMsQ0FBQTtBQUVuRSw0QkFBMkIsMEJBQTBCLENBQUMsQ0FBQTtBQUd0RCw2QkFBMkIsb0JBQW9CLENBQUMsQ0FBQTtBQUVoRCw4QkFBNkIsZUFBZSxDQUFDLENBQUE7QUF1QjdDO0lBUUksbUJBQW9CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUcvQyxtQ0FBZSxHQUFmLFVBQWdCLFNBQW9CO1FBRWhDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QixPQUFPLFNBQVMsQ0FBQyxlQUFlLENBQUM7SUFDckMsQ0FBQztJQUVELGdDQUFZLEdBQVosVUFBYSxTQUFvQjtRQUM3QixJQUFJLFdBQVcsR0FBdUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBcUI7WUFDcEYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBR0gsU0FBUyxDQUFDLGVBQWUsR0FBRyxvQkFBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBR3hELG9CQUFjLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsNkJBQVMsR0FBVCxVQUFVLFNBQW9CO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQXRETDtRQUFDLGVBQVEsQ0FBQztZQUNOLFNBQVMsRUFBRTtnQkFDUCw0QkFBWTthQUNmO1lBRUQsWUFBWSxFQUFFO2dCQUNWLDRCQUFZO2FBQ2Y7WUFFRCxPQUFPLEVBQUU7Z0JBQ0wsZ0NBQWE7Z0JBQ2Isd0JBQVUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BCLHlCQUFVO2FBQ2I7U0FDSixDQUFDOztpQkFBQTtJQXlDRixnQkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksaUJBQVMsWUFtQ3JCLENBQUEifQ==