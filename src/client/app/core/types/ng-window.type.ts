/**
 * Represent the "ng" object in the window
 */
export interface NgObject {
    probe: Object;
    coreTokens: Object;
}

/**
 * Represent a special window object to store the "ng" object
 */
export interface NgWindow extends Window {
    ng: NgObject;
}
