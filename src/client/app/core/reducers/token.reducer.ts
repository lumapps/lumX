import { Action, ActionReducer } from '@ngrx/store';

import { TokenActions } from 'core/constants/actions';


/**
 * Represent the state of the token in the reducer.
 *
 * @interface
 */
export interface ITokenState {
    needed: boolean;
    value: string;
}

/**
 * Initial state of the token ReduxStore.
 *
 * @readonly
 */
export const initialState: ITokenState = {
    /**
     * Indicates if the token is needed.
     *
     * @type {boolean}
     * @default false
     */
    needed: false,

    /**
     * The value of the token.
     *
     * @type {string}
     * @default undefined
     */
    value: undefined,
};

/**
 * Responsible to handle the state of our token store.
 *
 * @param  {ITokenState} state  The updated state of the token.
 * @param  {Action}      action The action to execute.
 *                              See {@link TokenActions} for allowed value
 * @return {ITokenState}        The new state of the token
 */
export const tokenReducer: ActionReducer<ITokenState> = (state: ITokenState, action: Action) => {
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
