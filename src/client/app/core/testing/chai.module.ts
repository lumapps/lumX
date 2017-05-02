/* tslint:disable:no-reference */
///<reference path="./chai-arrays-typings.d.ts" />
/* tslint:enable:no-reference */

export { assert, expect, should } from 'chai';

import * as chai from 'chai';

import * as chaiArrays from 'chai-arrays';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiAssertType from 'chai-asserttype';
import * as chaiChange from 'chai-change';
import * as chaiCounting from 'chai-counting';
// tslint:disable-next-line:no-var-requires typedef no-require-imports
const chaiDatetime = require('chai-datetime');
import * as chaiDateString from 'chai-date-string';
import * as chaiInterface from 'chai-interface';
import * as chaiJSONSchema from 'chai-json-schema';
import * as chaiSorted from 'chai-sorted';
// tslint:disable-next-line:no-var-requires typedef no-require-imports
const chaiString = require('chai-string');

import * as sinonChai from 'sinon-chai';


chai.use(chaiArrays);
chai.use(chaiAsPromised);
chai.use(chaiAssertType);
chai.use(chaiChange);
chai.use(chaiCounting);
chai.use(chaiDatetime);
chai.use(chaiDateString);
chai.use(chaiInterface);
chai.use(chaiJSONSchema);
chai.use(chaiSorted);
chai.use(chaiString);

chai.use(sinonChai);
