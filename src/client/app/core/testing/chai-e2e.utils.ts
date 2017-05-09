/* tslint:disable:no-reference */
///<reference path="../../../../../node_modules/chai-smoothie/lib/chai-smoothie.d.ts" />
///<reference path="./chai-smoothie-typings.d.ts" />
/* tslint:enable:no-reference */

export { assert, expect, should } from './chai-common.utils';

import * as chai from 'chai';

// tslint:disable-next-line:no-var-requires typedef no-require-imports
const chaiSmoothie = require('chai-smoothie');

chai.use(chaiSmoothie);
