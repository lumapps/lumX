import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { TokenActions } from 'core/constants/actions';
import { TokenState } from 'core/reducers/token.reducer';


/**
 * Responsible of managing the OAuth token of our application through a ReduxStore
 */
@Injectable()
export class TokenService {
    /**
     * The OAuth token (as an observable)
     *
     * @type       {Observable<TokenState>}
     * @visibility public
     */
    public token: Observable<TokenState>;


    /**
     * Construct a new Token service
     * Initialize the token store
     *
     * @param {Store<TokenState>} store The ReduxStore that will store our token state
     */
    constructor(private store: Store<TokenState>) {
        this.token = store.select<TokenState>('token');
    }


    clearToken(): void {
        this.store.dispatch({
            type: TokenActions.TOKEN_CLEARED,
        });
    }

    getToken(): string {
        let currentToken: string;

        this.token.take(1).subscribe((token: TokenState) => {
            if (token !== undefined) {
                currentToken = token.value;
            }
        });

        return currentToken;
    }

    refreshToken(): void {
        this.store.dispatch({
            type: TokenActions.TOKEN_NEEDED,
        });
    }

    setToken(token: string): void {
        this.store.dispatch({
            payload: token,
            type: TokenActions.TOKEN_RECEIVED,
        });
    }
}
