"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var hmr_1 = require('@angularclass/hmr');
var environment_1 = require('./libs/environment');
var app_module_1 = require('app.module');
var _main = function () {
    return platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
        .then(environment_1.decorateModuleRef)
        .catch(function (error) { return console.error(error); });
};
hmr_1.bootloader(_main);
exports.main = _main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlDQUF1QyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRTNFLG9CQUEyQixtQkFBbUIsQ0FBQyxDQUFBO0FBRS9DLDRCQUFrQyxvQkFBb0IsQ0FBQyxDQUFBO0FBRXZELDJCQUEwQixZQUFZLENBQUMsQ0FBQTtBQU12QyxJQUFJLEtBQUssR0FBc0I7SUFDM0IsTUFBTSxDQUFDLGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLHNCQUFTLENBQUM7U0FDMUIsSUFBSSxDQUFDLCtCQUFpQixDQUFDO1NBQ3ZCLEtBQUssQ0FBQyxVQUFDLEtBQWEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQUNuRixDQUFDLENBQUM7QUFFRixnQkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRUwsWUFBSSxHQUFzQixLQUFLLENBQUMifQ==