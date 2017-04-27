import _ from 'lodash';

import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';

import { TokenActions } from 'core/constants/actions';
import { ITokenState } from 'core/reducers/token.reducer';
import { UtilsService } from 'core/services/utils.service';


/**
 * Responsible of managing the OAuth token of our application through a ReduxStore.
 */
@Injectable()
export class TokenService {
    /**
     * The OAuth token (as an observable).
     *
     * @type {Observable<ITokenState>}
     *
     * @public
     */
    public token: Observable<ITokenState>;


    /**
     * Construct a new Token service and initialize the token store.
     *
     * @constructs TokenService
     *
     * @param {Store<ITokenState>} _Store The ReduxStore that will store our token state.
     */
    constructor(private _Store: Store<ITokenState>) {
        this.token = this._Store.select<ITokenState>((token: ITokenState) => token);
    }

    /**
     * Clear the token.
     * Completely remove the token value and the 'needed' information.
     *
     * @public
     */
    public clearToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_CLEARED,
        });
    }

    /**
     * Get the token value.
     *
     * @return {string} The token value.
     *
     * @public
     */
    public getToken(): string {
        let currentToken: string;

        this.token.subscribe((token: ITokenState) => {
            if (UtilsService.isDefinedAndFilled(_.get(token, 'value', ''))) {
                currentToken = token.value;
            }
        }).unsubscribe();

        return currentToken;
    }

    /**
     * Check if the token is still valid or need to be refreshed.
     *
     * @return {boolean} If the token needs to be refreshed or not.
     *
     * @public
     */
    public isValid(): boolean {
        let isValid: boolean = false;

        this.token.subscribe((token: ITokenState) => {
            if (UtilsService.isDefined(_.get(token, 'needed', undefined))) {
                isValid = !token.needed;
            }
        }).unsubscribe();

        return isValid;
    }

    /**
     * Set the token has needing refresh.
     * Leave the value as is, but set the 'needed' indicator.
     *
     * @public
     */
    public refreshToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_NEEDED,
        });
    }

    /**
     * Update the token value.
     *
     * @param {string} token The token value.
     *
     * @public
     */
    public setToken(token: string): void {
        if (UtilsService.isDefinedAndFilled(token)) {
            this._Store.dispatch({
                payload: token,
                type: TokenActions.TOKEN_RECEIVED,
            });
        }
    }
}
