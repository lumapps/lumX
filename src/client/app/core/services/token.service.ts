import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Rx';

import { TokenActions } from 'core/constants/actions';
import { ITokenState } from 'core/reducers/token.reducer';


@Injectable()
/**
 * Responsible of managing the OAuth token of our application through a ReduxStore.
 */
export class TokenService {
    /**
     * The OAuth token (as an observable).
     *
     * @type {Observable<ITokenState>}
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
     */
    clearToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_CLEARED,
        });
    }

    /**
     * Get the token value.
     *
     * @return {string} The token value.
     */
    getToken(): string {
        let currentToken: string;

        this.token.subscribe((token: ITokenState) => {
            if (token !== undefined && token.value !== undefined) {
                currentToken = token.value;
            }
        }).unsubscribe();

        return currentToken;
    }

    /**
     * Check if the token is still valid or need to be refreshed.
     *
     * @return {boolean} If the token needs to be refreshed or not.
     */
    isValid(): boolean {
        let isValid: boolean = false;

        this.token.subscribe((token: ITokenState) => {
            if (token !== undefined && token.needed !== undefined) {
                isValid = !token.needed;
            }
        }).unsubscribe();

        return isValid;
    }

    /**
     * Set the token has needing refresh.
     * Leave the value as is, but set the 'needed' indicator.
     */
    refreshToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_NEEDED,
        });
    }

    /**
     * Update the token value.
     *
     * @param {string} token The token value/
     */
    setToken(token: string): void {
        if (token !== undefined && token.length > 0) {
            this._Store.dispatch({
                payload: token,
                type: TokenActions.TOKEN_RECEIVED,
            });
        }
    }
}
