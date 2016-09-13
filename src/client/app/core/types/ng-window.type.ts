/**
 * Represent the "ng" object in the window
 */
export interface INgObject {
    probe: Object;
    coreTokens: Object;
}

/**
 * Represent a special window object to store the "ng" object
 */
export interface INgWindow extends Window {
    ng: INgObject;
}
