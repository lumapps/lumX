import { TestBed } from '@angular/core/testing';

import { CoreModule } from 'core/modules/core.module';
import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';


describe('Token Service', () => {
    const _TokenService: TokenService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            exports: [
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                TokenService,
            ],
        });

        _TokenService = TestBed.get(TokenService);

        _TokenService.setToken(FAKE_TOKEN);
    });


    it('should be able to refresh the token', () => {
        expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
        expect(_TokenService.isValid()).toBeTrue();

        _TokenService.refreshToken();

        expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
        expect(_TokenService.isValid()).toBeFalse();
    });

    it('should be able to clear the token', () => {
        expect(_TokenService.getToken()).toBeDefined();
        expect(_TokenService.isValid()).toBe(true);

        _TokenService.clearToken();

        expect(_TokenService.getToken()).toBeUndefined();
        expect(_TokenService.isValid()).toBeFalse();
    });

    it('should not set an undefined or empty token', () => {
        expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
        expect(_TokenService.isValid()).toBeTrue();

        _TokenService.setToken();

        expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
        expect(_TokenService.isValid()).toBeTrue();

        _TokenService.setToken('');

        expect(_TokenService.getToken()).toBe(FAKE_TOKEN);
        expect(_TokenService.isValid()).toBeTrue();
    });
});
