/**
 * Describes the HMR Store.
 *
 * @interface
 */
export interface IHmrStore {
    disposeOldHosts?: Function;
    // tslint:disable-next-line:no-any
    state?: any;
}
