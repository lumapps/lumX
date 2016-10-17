import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
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
        this.token = this._Store.select<ITokenState>('token');
    }


    clearToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_CLEARED,
        });
    }

    getToken(): string {
        let currentToken: string;

        this.token.take(1).subscribe((token: ITokenState) => {
            if (token !== undefined) {
                currentToken = token.value;
            }
        });

        return currentToken;
    }

    refreshToken(): void {
        this._Store.dispatch({
            type: TokenActions.TOKEN_NEEDED,
        });
    }

    setToken(token: string): void {
        this._Store.dispatch({
            payload: token,
            type: TokenActions.TOKEN_RECEIVED,
        });
    }
}
