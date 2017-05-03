/* tslint:disable:no-unused-expression */

import { TestBed, inject } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.module';

import { CoreModule } from 'core/modules/core.module';

import { TokenActions } from 'core/constants/actions';
import { TokenService } from 'core/services/token.service';
import { FAKE_TOKEN } from 'core/settings/common.settings';


describe('Token Service', () => {
    /**
     * The Token Service.
     *
     * @type {TokenService}
     */
    let _TokenService: TokenService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                CoreModule,
            ],

            providers: [
                TokenActions,
                TokenService,
            ],
        });

        _TokenService = TestBed.get(TokenService);

        _TokenService.setToken(FAKE_TOKEN);
    });


    it('should be defined', () => {
        expect(_TokenService).to.exist;
        expect(_TokenService).to.be.instanceOf(TokenService);
    });

    it('should have defined actions', inject([TokenActions], (_TokenActions: TokenActions) => {
        expect(TokenActions).to.exist;

        expect(_TokenActions).to.exist;
        expect(_TokenActions).to.be.instanceOf(TokenActions);

        expect(TokenActions).to.have.property('TOKEN_CLEARED', 'TOKEN_CLEARED');
        expect(TokenActions).to.have.property('TOKEN_NEEDED', 'TOKEN_NEEDED');
        expect(TokenActions).to.have.property('TOKEN_RECEIVED', 'TOKEN_RECEIVED');
    }));

    it('should be able to refresh the token', () => {
        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;

        _TokenService.refreshToken();

        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.false;
    });

    it('should be able to clear the token', () => {
        expect(_TokenService.getToken()).to.exist;
        expect(_TokenService.isValid()).to.be.true;

        _TokenService.clearToken();

        expect(_TokenService.getToken()).to.be.undefined;
        expect(_TokenService.isValid()).to.be.false;
    });

    it('should not set an undefined or empty token', () => {
        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;

        _TokenService.setToken(undefined);

        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;

        _TokenService.setToken('');

        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;
    });

    it('should set a token', () => {
        expect(_TokenService.getToken()).to.equal(FAKE_TOKEN);
        expect(_TokenService.isValid()).to.be.true;

        const newToken: string = 'toto';
        _TokenService.setToken(newToken);

        expect(_TokenService.getToken()).to.equal(newToken);
        expect(_TokenService.isValid()).to.be.true;
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
