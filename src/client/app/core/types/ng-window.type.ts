/**
 * Describes the "ng" object in the window.
 *
 * @interface
 */
export interface INgObject {
    coreTokens: {};
    probe: {};
}

/**
 * Describes a special window object to store the "ng" object.
 *
 * @interface
 */
export interface INgWindow extends Window {
    ng: INgObject;
}
