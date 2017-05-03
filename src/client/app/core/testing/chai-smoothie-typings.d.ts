// Type definitions for chai-smoothie 0.2
// Project: https://github.com/jan-molak/chai-smoothie
// Definitions by: Clément Prévot <https://github.com/clementprevot/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference types="chai" />

declare global {
    namespace Chai {
        interface PromisedAssertion {
            displayed: PromisedAssertion;
            enabled: PromisedAssertion;
            present: PromisedAssertion;
            selected: PromisedAssertion;
        }
    }
}

declare function chaiSmoothie(chai: any, utils: any): void;
export = chaiSmoothie;
