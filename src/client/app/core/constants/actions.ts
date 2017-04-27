/**
 * All valid actions for the token ReduxStore.
 *
 * @enum {string}
 * @readonly
 */
export class TokenActions {
    /**
     * The action for clearing the token.
     *
     * @type {string}
     *
     * @public
     * @static
     */
    public static TOKEN_CLEARED: string = 'TOKEN_CLEARED';

    /**
     * The action for marking the token as needed.
     *
     * @type {string}
     *
     * @public
     * @static
     */
    public static TOKEN_NEEDED: string = 'TOKEN_NEEDED';

    /**
     * The action for marking the token as received.
     *
     * @type {string}
     *
     * @public
     * @static
     */
    public static TOKEN_RECEIVED: string = 'TOKEN_RECEIVED';
}
