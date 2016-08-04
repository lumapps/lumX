import { Action, ActionReducer } from '@ngrx/store';

import { TokenActions } from 'core/constants/actions';


/**
 * Represent the state of the token in the reducer
 */
export interface TokenState {
    needed: boolean;
    value: string;
}

/**
 * Initial state of the token ReduxStore
 *
 * @type {Object}
 */
export const initialState: TokenState = {
    needed: false,
    value: undefined,
};

/**
 * Responsible to handle the state of our token store
 *
 * @type {ActionReducer}
 */
export const tokenReducer: ActionReducer<TokenState> = (state: TokenState = initialState, action: Action) => {
    switch (action.type) {
        case TokenActions.TOKEN_RECEIVED:
            return Object.assign({}, state, {
                needed: false,
                value: action.payload,
            });

        case TokenActions.TOKEN_NEEDED:
            return Object.assign({}, state, {
                needed: true,
            });

        case TokenActions.TOKEN_CLEARED:
            return Object.assign({});

        default:
            return state;
    }
};
