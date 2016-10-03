"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var token_service_1 = require('core/services/token.service');
var HttpInterceptorService = (function () {
    function HttpInterceptorService(_Http, _TokenService) {
        this._Http = _Http;
        this._TokenService = _TokenService;
        this._loginAttempts = 0;
    }
    HttpInterceptorService.prototype.delete = function (url, options) {
        return this.intercept(this._Http.delete(url, this.getRequestOptionArgs(options)), 'delete', url, undefined, undefined, options);
    };
    HttpInterceptorService.prototype.get = function (url, options) {
        return this.intercept(this._Http.get(url, this.getRequestOptionArgs(options, true)), 'get', url, undefined, undefined, options);
    };
    HttpInterceptorService.prototype.getRequestOptionArgs = function (options, isGet) {
        if (isGet === void 0) { isGet = false; }
        if (!options) {
            options = new http_1.RequestOptions();
        }
        options.headers = new http_1.Headers();
        options.headers.append('Content-Type', 'application/json');
        this._TokenService.token.subscribe(function (token) {
            if (token && !token.needed) {
                options.headers.append('Authorization', 'Bearer ' + token.value);
            }
        });
        if (isGet) {
            options.body = '';
        }
        return options;
    };
    HttpInterceptorService.prototype.intercept = function (observable, method, url, request, body, options) {
        var _this = this;
        return observable.catch(function (initialError) {
            if (initialError.status === 401) {
                if (_this._loginAttempts === 5) {
                    return Rx_1.Observable.empty();
                }
                else {
                    _this._loginAttempts++;
                    _this._TokenService.refreshToken();
                    return _this._TokenService.token.switchMap(function (token) {
                        if (!token.needed) {
                            switch (method) {
                                case 'request':
                                    return _this.request(request, _this.getRequestOptionArgs(options));
                                case 'get':
                                    return _this.get(url, _this.getRequestOptionArgs(options));
                                case 'post':
                                    return _this.post(url, body, _this.getRequestOptionArgs(options));
                                case 'put':
                                    return _this.put(url, body, _this.getRequestOptionArgs(options));
                                case 'delete':
                                    return _this.delete(url, _this.getRequestOptionArgs(options));
                                default:
                                    break;
                            }
                        }
                        else {
                            return Rx_1.Observable.empty();
                        }
                    });
                }
            }
            else {
                console.error("/!\\ ERROR - " + initialError.status + " - " + initialError.statusText + " - " + method + ": " + url);
                return Rx_1.Observable.throw(initialError);
            }
        });
    };
    HttpInterceptorService.prototype.post = function (url, body, options) {
        return this.intercept(this._Http.post(url, body, this.getRequestOptionArgs(options)), 'post', url, undefined, body, options);
    };
    HttpInterceptorService.prototype.put = function (url, body, options) {
        return this.intercept(this._Http.put(url, body, this.getRequestOptionArgs(options)), 'put', url, undefined, body, options);
    };
    HttpInterceptorService.prototype.request = function (url, options) {
        return this.intercept(this._Http.request(url, this.getRequestOptionArgs(options)), 'request', undefined, url, undefined, options);
    };
    HttpInterceptorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, token_service_1.TokenService])
    ], HttpInterceptorService);
    return HttpInterceptorService;
}());
exports.HttpInterceptorService = HttpInterceptorService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1pbnRlcmNlcHRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cC1pbnRlcmNlcHRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MscUJBQXFGLGVBQWUsQ0FBQyxDQUFBO0FBR3JHLG1CQUEyQixTQUFTLENBQUMsQ0FBQTtBQUdyQyw4QkFBNkIsNkJBQTZCLENBQUMsQ0FBQTtBQVMzRDtJQW9CSSxnQ0FBb0IsS0FBVyxFQUFVLGFBQTJCO1FBQWhELFVBQUssR0FBTCxLQUFLLENBQU07UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQVo1RCxtQkFBYyxHQUFXLENBQUMsQ0FBQztJQVlvQyxDQUFDO0lBVXhFLHVDQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsT0FBNEI7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUNwRixTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQVNELG9DQUFHLEdBQUgsVUFBSSxHQUFXLEVBQUUsT0FBNEI7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFDcEYsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFXRCxxREFBb0IsR0FBcEIsVUFBcUIsT0FBNEIsRUFBRSxLQUFzQjtRQUF0QixxQkFBc0IsR0FBdEIsYUFBc0I7UUFDckUsRUFB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