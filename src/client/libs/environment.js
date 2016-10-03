"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var _decorateModuleRef = function (value) { return value; };
if (ENV === 'production') {
    platform_browser_1.disableDebugTools();
    core_1.enableProdMode();
}
else {
    _decorateModuleRef = function (moduleRef) {
        var appRef = moduleRef.injector.get(core_1.ApplicationRef);
        var cmpRef = appRef.components[0];
        var ng = window.ng;
        window.ng.probe = ng.probe;
        window.ng.coreTokens = ng.coreTokens;
        platform_browser_1.enableDebugTools(cmpRef);
        return moduleRef;
    };
}
exports.decorateModuleRef = _decorateModuleRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EscUJBQTBFLGVBQWUsQ0FBQyxDQUFBO0FBQzFGLGlDQUFvRCwyQkFBMkIsQ0FBQyxDQUFBO0FBYWhGLElBQUksa0JBQWtCLEdBQXVCLFVBQUksS0FBUSxJQUFRLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQztBQUV2RSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztJQUV2QixvQ0FBaUIsRUFBRSxDQUFDO0lBQ3BCLHFCQUFjLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBQUMsSUFBSSxDQUFDLENBQUM7SUFDSixrQkFBa0IsR0FBRyxVQUFDLFNBQTBCO1FBQzVDLElBQUksTUFBTSxHQUFtQixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBYyxDQUFDLENBQUM7UUFDcEUsSUFBSSxNQUFNLEdBQXFCLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxFQUFFLEdBQTBCLE1BQU8sQ0FBQyxFQUFFLENBQUM7UUFDL0IsTUFBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM1QixNQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBRWxELG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVZLHlCQUFpQixHQUF1QixrQkFBa0IsQ0FBQyJ9