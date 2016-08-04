export interface NgObject {
    probe: Object;
    coreTokens: Object;
}

export interface NgWindow extends Window {
    ng: NgObject;
}
