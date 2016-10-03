"use strict";
var testing_1 = require('@angular/core/testing');
var http_1 = require('@angular/http');
var testing_2 = require('@angular/http/testing');
var http_interceptor_service_1 = require('core/services/http-interceptor.service');
var token_service_1 = require('core/services/token.service');
var app_module_1 = require('app.module');
describe('Application startup', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_module_1.AppModule,
            ],
            providers: [
                http_interceptor_service_1.HttpInterceptorService,
                { provide: http_1.XHRBackend, useClass: testing_2.MockBackend },
                token_service_1.TokenService,
            ],
        });
        testing_1.TestBed.compileComponents().catch(function (error) { return console.error(error); });
    });
    it('should request a token', testing_1.inject([http_1.XHRBackend, token_service_1.TokenService], function (backend, tokenService) {
        var generatedToken = 'Generated Test Token';
        var mockedResponse = new http_1.ResponseOptions({
            body: {
                token: generatedToken,
            },
        });
        backend.connections.subscribe(function (connection) {
            if (connection.request.url === '/services/oauthtoken') {
                connection.mockRespond(new http_1.Response(mockedResponse));
            }
        });
        tokenService.token.subscribe(function (token) {
            if (token && !token.needed) {
                expect(token.value).toBe(generatedToken);
            }
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQWdDLHVCQUF1QixDQUFDLENBQUE7QUFDeEQscUJBQW1GLGVBQWUsQ0FBQyxDQUFBO0FBQ25HLHdCQUE0Qyx1QkFBdUIsQ0FBQyxDQUFBO0FBR3BFLHlDQUF1Qyx3Q0FBd0MsQ0FBQyxDQUFBO0FBQ2hGLDhCQUE2Qiw2QkFBNkIsQ0FBQyxDQUFBO0FBRTNELDJCQUEwQixZQUFZLENBQUMsQ0FBQTtBQUd2QyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDNUIsVUFBVSxDQUFDO1FBQ1AsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztZQUMzQixPQUFPLEVBQUU7Z0JBQ0wsc0JBQVM7YUFDWjtZQUVELFNBQVMsRUFBRTtnQkFDUCxpREFBc0I7Z0JBQ3RCLEVBQUUsT0FBTyxFQUFFLGlCQUFVLEVBQUUsUUFBUSxFQUFFLHFCQUFXLEVBQUU7Z0JBQzlDLDRCQUFZO2FBQ2Y7U0FDSixDQUFDLENBQUM7UUFFSCxpQkFBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBYSxJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFLGdCQUFNLENBQUMsQ0FBQyxpQkFBVSxFQUFFLDRCQUFZLENBQUMsRUFDMUIsVUFBQyxPQUFvQixFQUFFLFlBQTBCO1FBQ2pGLElBQU0sY0FBYyxHQUFXLHNCQUFzQixDQUFDO1FBQ3RELElBQU0sY0FBYyxHQUFvQixJQUFJLHNCQUFlLENBQUM7WUFDeEQsSUFBSSxFQUFFO2dCQUNGLEtBQUssRUFBRSxjQUFjO2FBQ3hCO1NBQ0osQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQ3pCLFVBQUMsVUFBMEI7WUFDdkIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksZUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQztRQUNMLENBQUMsQ0FDSixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBQyxLQUFrQjtZQUM1QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDN0MsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNSLENBQUMsQ0FBQyxDQUFDIn0=