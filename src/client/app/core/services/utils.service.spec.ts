/* tslint:disable:no-unused-expression max-file-line-count */

import * as _ from 'lodash';

import { TestBed } from '@angular/core/testing';
import { expect } from 'core/testing/chai-unit.utils';

import { CoreModule } from 'core/modules/core.module';


import { UtilsService } from 'core/services/utils.service';


describe('Utils Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],

            imports: [
                CoreModule,
            ],
        });
    });


    it('should be defined', () => {
        expect(UtilsService).to.exist;
    });

    describe('Allowed "methods"', () => {
        it('should allow only `every` and `some` as method name', () => {
            expect(UtilsService).itself.to.respondTo('isAllowedMethod');

            expect(UtilsService.isAllowedMethod('some')).to.be.true;
            expect(UtilsService.isAllowedMethod('every')).to.be.true;

            expect(UtilsService.isAllowedMethod('forEach')).to.be.false;
            expect(UtilsService.isAllowedMethod('anythingElse')).to.be.false;
        });

        it('should invert `every` to `some` and `some` to `every`', () => {
            expect(UtilsService).itself.to.respondTo('invertMethodName');

            expect(UtilsService.invertMethodName('some')).to.equal('every');
            expect(UtilsService.invertMethodName('every')).to.equal('some');

            expect(UtilsService.invertMethodName('forEach')).to.be.undefined;
            expect(UtilsService.invertMethodName('anythingElse')).to.be.undefined;
        });
    });

    describe('`isDefined`', () => {
        it('should be callable', () => {
            expect(UtilsService).itself.to.respondTo('isDefined');
        });

        it('should return false if value is `undefined`', () => {
            expect(UtilsService.isDefined(undefined)).to.be.false;
        });

        it('should return false if value is `null`', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefined(null)).to.be.false;
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefined(null, undefined, false)).to.be.false;
        });

        it('should return true if value is `null` but `null` is allowed', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefined(null, undefined, true)).to.be.true;
        });

        it('should return true if value is a valid string', () => {
            expect(UtilsService.isDefined('Winter is coming')).to.be.true;
        });

        it('should return true even if value is empty', () => {
            expect(UtilsService.isDefined('')).to.be.true;
            expect(UtilsService.isDefined([])).to.be.true;
            expect(UtilsService.isDefined({})).to.be.true;

            const mySet: Set<string> = new Set();
            expect(UtilsService.isDefined(mySet)).to.be.true;

            const myMap: Map<string, string> = new Map();
            expect(UtilsService.isDefined(myMap)).to.be.true;

            expect(UtilsService.isDefined(new UtilsService())).to.be.true;
        });

        it('should return true if value is a non-empty array-like', () => {
            expect(UtilsService.isDefined(['Winter', 'is', 'coming'])).to.be.true;

            const mySet: Set<string> = new Set();
            mySet.add('Winter is coming');
            expect(UtilsService.isDefined(mySet)).to.be.true;

            expect(UtilsService.isDefined(document.body.children)).to.be.true;
        });

        it('should return true if value is a non-empty object-like', () => {
            expect(UtilsService.isDefined({ lastName: 'Stark' })).to.be.true;

            const myMap: Map<string, string> = new Map();
            myMap.set('Ned', 'Stark');
            expect(UtilsService.isDefined(myMap)).to.be.true;

            expect(UtilsService.isDefined(UtilsService)).to.be.true;

        });

        it('should return true if value is a function', () => {
            expect(UtilsService.isDefined(_.noop)).to.be.true;
        });

        it('should return true if value is a number', () => {
            expect(UtilsService.isDefined(42)).to.be.true;
        });

        it('should return true if value is `NaN`', () => {
            expect(UtilsService.isDefined(NaN)).to.be.true;
        });

        it('should return true if value is a boolean', () => {
            expect(UtilsService.isDefined(true)).to.be.true;
            expect(UtilsService.isDefined(false)).to.be.true;
        });

        it('should return true if value is a date', () => {
            expect(UtilsService.isDefined(new Date())).to.be.true;
        });

        it('should return true if value is a regular expression', () => {
            expect(UtilsService.isDefined(new RegExp(''))).to.be.true;

            const myRegExp: RegExp = /ab+c/i;
            expect(UtilsService.isDefined(myRegExp)).to.be.true;
        });

        it('should only apply a "method" if value is an array', () => {
            /* tslint:disable:no-null-keyword */
            // Object.
            expect(UtilsService.isDefined({ first: 'first', second: null }, 'some')).to.be.true;
            expect(UtilsService.isDefined({ first: 'first', second: null }, 'every')).to.be.true;
            expect(UtilsService.isDefined({ first: 'first', second: null }, 'forEach')).to.be.true;
            expect(UtilsService.isDefined({ first: 'first', second: null }, 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined({ first: 'first', second: null }, null)).to.be.true;

            expect(UtilsService.isDefined({ first: null, second: null }, 'some')).to.be.true;
            expect(UtilsService.isDefined({ first: null, second: null }, 'every')).to.be.true;
            expect(UtilsService.isDefined({ first: null, second: null }, 'forEach')).to.be.true;
            expect(UtilsService.isDefined({ first: null, second: null }, 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined({ first: null, second: null }, null)).to.be.true;

            // Array.
            expect(UtilsService.isDefined(['first', null], 'some')).to.be.true;
            expect(UtilsService.isDefined(['first', null], 'every')).to.be.false;
            expect(UtilsService.isDefined(['first', null], 'forEach')).to.be.true;
            expect(UtilsService.isDefined(['first', null], 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined(['first', null], null)).to.be.true;

            expect(UtilsService.isDefined([null, null], 'some')).to.be.false;
            expect(UtilsService.isDefined([null, null], 'every')).to.be.false;
            expect(UtilsService.isDefined([null, null], 'forEach')).to.be.true;
            expect(UtilsService.isDefined([null, null], 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined([null, null], null)).to.be.true;
            /* tslint:enable:no-null-keyword */
        });

        it('should only apply a "method" if it is either `some` or `every`', () => {
            /* tslint:disable:no-null-keyword */
            expect(UtilsService.isDefined(['first', null], 'every')).to.be.false;
            expect(UtilsService.isDefined(['first', null], 'some')).to.be.true;
            expect(UtilsService.isDefined(['first', null], 'forEach')).to.be.true;
            expect(UtilsService.isDefined(['first', null], 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined(['first', null], null)).to.be.true;

            expect(UtilsService.isDefined([null, null], 'every')).to.be.false;
            expect(UtilsService.isDefined([null, null], 'some')).to.be.false;
            expect(UtilsService.isDefined([null, null], 'forEach')).to.be.true;
            expect(UtilsService.isDefined([null, null], 'anythingElse')).to.be.true;
            expect(UtilsService.isDefined([null, null], null)).to.be.true;
            /* tslint:enable:no-null-keyword */
        });
    });

    describe('`isDefinedAndFilled`', () => {
        it('should be callable', () => {
            expect(UtilsService).itself.to.respondTo('isDefinedAndFilled');
        });

        it('should return false if value is `undefined`', () => {
            expect(UtilsService.isDefinedAndFilled(undefined)).to.be.false;
        });

        it('should return false if value is `null`', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefinedAndFilled(null)).to.be.false;
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefinedAndFilled(null, undefined, true, false)).to.be.false;
        });

        it('should return true if value is `null` but `null` is allowed', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isDefinedAndFilled(null, undefined, true, true)).to.be.true;
        });

        it('should return false if value is empty', () => {
            expect(UtilsService.isDefinedAndFilled('')).to.be.false;
            expect(UtilsService.isDefinedAndFilled([])).to.be.false;
            expect(UtilsService.isDefinedAndFilled({})).to.be.false;

            const mySet: Set<string> = new Set();
            expect(UtilsService.isDefinedAndFilled(mySet)).to.be.false;

            const myMap: Map<string, string> = new Map();
            expect(UtilsService.isDefinedAndFilled(myMap)).to.be.false;

            expect(UtilsService.isDefinedAndFilled(new UtilsService())).to.be.false;
        });

        it("should trim string values before checking if it's `undefined`, `null` or empty", () => {
            expect(UtilsService.isDefinedAndFilled(' ', undefined, true)).to.be.false;
        });

        it("should allow to not trim strings before checking if it's `undefined`, `null` or empty", () => {
            expect(UtilsService.isDefinedAndFilled(' ', undefined, false)).to.be.true;
        });

        it('should default the trim parameter to `true`', () => {
            expect(UtilsService.isDefinedAndFilled(' ', undefined, true)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(' ', undefined, false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(' Winter is coming ', undefined, true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(' ')).to.be.false;
        });

        it('should return true if value is a valid string', () => {
            expect(UtilsService.isDefinedAndFilled('Winter is coming')).to.be.true;
        });

        it('should return true if value is a non-empty array-like', () => {
            expect(UtilsService.isDefinedAndFilled(['Winter', 'is', 'coming'])).to.be.true;

            const mySet: Set<string> = new Set();
            mySet.add('Winter is coming');
            expect(UtilsService.isDefinedAndFilled(mySet)).to.be.true;

            expect(UtilsService.isDefinedAndFilled(document.body.children)).to.be.true;
        });

        it('should return true if value is a non-empty object-like', () => {
            expect(UtilsService.isDefinedAndFilled({ lastName: 'Stark' })).to.be.true;

            const myMap: Map<string, string> = new Map();
            myMap.set('Ned', 'Stark');
            expect(UtilsService.isDefinedAndFilled(myMap)).to.be.true;

            expect(UtilsService.isDefinedAndFilled(UtilsService)).to.be.true;

        });

        it('should not support emptyness of WeakMap and/or WeakSet', () => {
            const myWeakMap: WeakMap<{}, string> = new WeakMap();
            myWeakMap.set({ name: 'Ned' }, 'Stark');
            expect(() => UtilsService.isDefinedAndFilled(myWeakMap)).to.throw('Unable to check emptyness of a WeakMap');

            const myWeakSet: WeakSet<{}> = new WeakSet();
            myWeakSet.add({ Winter: 'is coming' });
            expect(() => UtilsService.isDefinedAndFilled(myWeakSet)).to.throw('Unable to check emptyness of a WeakSet');
        });

        it('should return true if value is a function', () => {
            expect(UtilsService.isDefinedAndFilled(_.noop)).to.be.true;
        });

        it('should return true if value is a number', () => {
            expect(UtilsService.isDefinedAndFilled(42)).to.be.true;
        });

        it('should return false if value is `NaN`', () => {
            expect(UtilsService.isDefinedAndFilled(NaN)).to.be.false;
        });

        it('should return true if value is a boolean', () => {
            expect(UtilsService.isDefinedAndFilled(true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(false)).to.be.true;
        });

        it('should return true if value is a date', () => {
            expect(UtilsService.isDefinedAndFilled(new Date())).to.be.true;
        });

        it('should return true if value is a regular expression', () => {
            expect(UtilsService.isDefinedAndFilled(new RegExp(''))).to.be.true;

            const myRegExp: RegExp = /ab+c/i;
            expect(UtilsService.isDefinedAndFilled(myRegExp)).to.be.true;
        });

        it('should only apply a "method" if value is an array', () => {
            /* tslint:disable:no-null-keyword */
            // Object.
            expect(UtilsService.isDefinedAndFilled({ first: 'first', second: null }, 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: 'first', second: null }, 'every', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: 'first', second: null }, 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: 'first', second: null }, 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: 'first', second: null }, null, false)).to.be.true;

            expect(UtilsService.isDefinedAndFilled({ first: null, second: null }, 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: null, second: null }, 'every', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: null, second: null }, 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: null, second: null }, 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled({ first: null, second: null }, null, false)).to.be.true;

            // Array.
            expect(UtilsService.isDefinedAndFilled(['first', null], 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', null], 'every', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(['first', null], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', null], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', null], null, false)).to.be.true;

            expect(UtilsService.isDefinedAndFilled([null, null], 'some', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled([null, null], 'every', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled([null, null], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([null, null], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([null, null], null, false)).to.be.true;
            /* tslint:enable:no-null-keyword */
        });

        it('should only apply a "method" if it is either `some` or `every`', () => {
            /* tslint:disable:no-null-keyword */
            expect(UtilsService.isDefinedAndFilled(['first', ''], 'every', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(['first', ''], 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ''], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ''], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ''], null, false)).to.be.true;

            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'every', true)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'some', true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'forEach', true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'anythingElse', true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], null, true)).to.be.true;

            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'every', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['first', ' '], null, false)).to.be.true;

            expect(UtilsService.isDefinedAndFilled(['', null], 'every', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(['', null], 'some', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled(['', null], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['', null], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled(['', null], null, false)).to.be.true;

            expect(UtilsService.isDefinedAndFilled([' ', null], 'every', true)).to.be.false;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'some', true)).to.be.false;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'forEach', true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'anythingElse', true)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([' ', null], null, true)).to.be.true;

            expect(UtilsService.isDefinedAndFilled([' ', null], 'every', false)).to.be.false;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'some', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'forEach', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([' ', null], 'anythingElse', false)).to.be.true;
            expect(UtilsService.isDefinedAndFilled([' ', null], null, false)).to.be.true;
            /* tslint:enable:no-null-keyword */
        });
    });

    describe('`isUndefined`', () => {
        it('should be callable', () => {
            expect(UtilsService).itself.to.respondTo('isUndefined');
        });

        it('should return true if value is `undefined`', () => {
            expect(UtilsService.isUndefined(undefined)).to.be.true;
        });

        it('should return true if value is `null`', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefined(null)).to.be.true;
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefined(null, undefined, false)).to.be.true;
        });

        it('should return false if value is `null` but `null` is allowed', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefined(null, undefined, true)).to.be.false;
        });

        it('should return false if value is a valid string', () => {
            expect(UtilsService.isUndefined('Winter is coming')).to.be.false;
        });

        it('should return false if value is empty', () => {
            expect(UtilsService.isUndefined('')).to.be.false;
            expect(UtilsService.isUndefined([])).to.be.false;
            expect(UtilsService.isUndefined({})).to.be.false;

            const mySet: Set<string> = new Set();
            expect(UtilsService.isUndefined(mySet)).to.be.false;

            const myMap: Map<string, string> = new Map();
            expect(UtilsService.isUndefined(myMap)).to.be.false;

            expect(UtilsService.isUndefined(new UtilsService())).to.be.false;
        });

        it('should return false if value is a non-empty array-like', () => {
            expect(UtilsService.isUndefined(['Winter', 'is', 'coming'])).to.be.false;

            const mySet: Set<string> = new Set();
            mySet.add('Winter is coming');
            expect(UtilsService.isUndefined(mySet)).to.be.false;
        });

        it('should return false if value is a non-empty object-like', () => {
            expect(UtilsService.isUndefined({ lastName: 'Stark' })).to.be.false;

            const myMap: Map<string, string> = new Map();
            myMap.set('Ned', 'Stark');
            expect(UtilsService.isUndefined(myMap)).to.be.false;

            expect(UtilsService.isUndefined(document.body.children)).to.be.false;

            expect(UtilsService.isUndefined(UtilsService)).to.be.false;

        });

        it('should return false if value is a function', () => {
            expect(UtilsService.isUndefined(_.noop)).to.be.false;
        });

        it('should return false if value is a number', () => {
            expect(UtilsService.isUndefined(42)).to.be.false;
        });

        it('should return false if value is `NaN`', () => {
            expect(UtilsService.isUndefined(NaN)).to.be.false;
        });

        it('should return false if value is a boolean', () => {
            expect(UtilsService.isUndefined(true)).to.be.false;
            expect(UtilsService.isUndefined(false)).to.be.false;
        });

        it('should return false if value is a date', () => {
            expect(UtilsService.isUndefined(new Date())).to.be.false;
        });

        it('should return true if value is a regular expression', () => {
            expect(UtilsService.isUndefined(new RegExp(''))).to.be.false;

            const myRegExp: RegExp = /ab+c/i;
            expect(UtilsService.isUndefined(myRegExp)).to.be.false;
        });

        it('should only apply a "method" if value is an array', () => {
            /* tslint:disable:no-null-keyword */
            // Object.
            expect(UtilsService.isUndefined({ first: 'first', second: null }, 'some')).to.be.false;
            expect(UtilsService.isUndefined({ first: 'first', second: null }, 'every')).to.be.false;
            expect(UtilsService.isUndefined({ first: 'first', second: null }, 'forEach')).to.be.false;
            expect(UtilsService.isUndefined({ first: 'first', second: null }, 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined({ first: 'first', second: null }, null)).to.be.false;

            expect(UtilsService.isUndefined({ first: null, second: null }, 'some')).to.be.false;
            expect(UtilsService.isUndefined({ first: null, second: null }, 'every')).to.be.false;
            expect(UtilsService.isUndefined({ first: null, second: null }, 'forEach')).to.be.false;
            expect(UtilsService.isUndefined({ first: null, second: null }, 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined({ first: null, second: null }, null)).to.be.false;

            // Array.
            expect(UtilsService.isUndefined(['first', null], 'some')).to.be.true;
            expect(UtilsService.isUndefined(['first', null], 'every')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], 'forEach')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], null)).to.be.false;

            expect(UtilsService.isUndefined([null, null], 'some')).to.be.true;
            expect(UtilsService.isUndefined([null, null], 'every')).to.be.true;
            expect(UtilsService.isUndefined([null, null], 'forEach')).to.be.false;
            expect(UtilsService.isUndefined([null, null], 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined([null, null], null)).to.be.false;
            /* tslint:enable:no-null-keyword */
        });

        it('should only apply a "method" if it is either `some` or `every`', () => {
            /* tslint:disable:no-null-keyword */
            expect(UtilsService.isUndefined(['first', null], 'every')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], 'some')).to.be.true;
            expect(UtilsService.isUndefined(['first', null], 'forEach')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined(['first', null], null)).to.be.false;

            expect(UtilsService.isUndefined([null, null], 'every')).to.be.true;
            expect(UtilsService.isUndefined([null, null], 'some')).to.be.true;
            expect(UtilsService.isUndefined([null, null], 'forEach')).to.be.false;
            expect(UtilsService.isUndefined([null, null], 'anythingElse')).to.be.false;
            expect(UtilsService.isUndefined([null, null], null)).to.be.false;
            /* tslint:enable:no-null-keyword */
        });
    });

    describe('`isUndefinedOrEmpty`', () => {
        it('should be callable', () => {
            expect(UtilsService).itself.to.respondTo('isUndefinedOrEmpty');
        });

        it('should return true if value is `undefined`', () => {
            expect(UtilsService.isUndefinedOrEmpty(undefined)).to.be.true;
        });

        it('should return true if value is `null`', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefinedOrEmpty(null)).to.be.true;
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefinedOrEmpty(null, undefined, true, false)).to.be.true;
        });

        it('should return false if value is `null` but `null` is allowed', () => {
            // tslint:disable-next-line:no-null-keyword
            expect(UtilsService.isUndefinedOrEmpty(null, undefined, true, true)).to.be.false;
        });

        it('should return true if value is empty', () => {
            expect(UtilsService.isUndefinedOrEmpty('')).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([])).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty({})).to.be.true;

            const mySet: Set<string> = new Set();
            expect(UtilsService.isUndefinedOrEmpty(mySet)).to.be.true;

            const myMap: Map<string, string> = new Map();
            expect(UtilsService.isUndefinedOrEmpty(myMap)).to.be.true;

            expect(UtilsService.isUndefinedOrEmpty(new UtilsService())).to.be.true;
        });

        it("should trim string values before checking if it's `undefined`, `null` or empty", () => {
            expect(UtilsService.isUndefinedOrEmpty(' ', undefined, true)).to.be.true;
        });

        it("should allow to not trim strings before checking if it's `undefined`, `null` or empty", () => {
            expect(UtilsService.isUndefinedOrEmpty(' ', undefined, false)).to.be.false;
        });

        it('should default the trim parameter to `true`', () => {
            expect(UtilsService.isUndefinedOrEmpty(' ', undefined, true)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(' ', undefined, false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(' Winter is coming ', undefined, true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(' ')).to.be.true;
        });

        it('should return false if value is a valid string', () => {
            expect(UtilsService.isUndefinedOrEmpty('Winter is coming')).to.be.false;
        });

        it('should return false if value is a non-empty array-like', () => {
            expect(UtilsService.isUndefinedOrEmpty(['Winter', 'is', 'coming'])).to.be.false;

            const mySet: Set<string> = new Set();
            mySet.add('Winter is coming');
            expect(UtilsService.isUndefinedOrEmpty(mySet)).to.be.false;
        });

        it('should return false if value is a non-empty object-like', () => {
            expect(UtilsService.isUndefinedOrEmpty({ lastName: 'Stark' })).to.be.false;

            const myMap: Map<string, string> = new Map();
            myMap.set('Ned', 'Stark');
            expect(UtilsService.isUndefinedOrEmpty(myMap)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty(document.body.children)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty(UtilsService)).to.be.false;

        });

        it('should not support emptyness of WeakMap and/or WeakSet', () => {
            const myWeakMap: WeakMap<{}, string> = new WeakMap();
            myWeakMap.set({ name: 'Ned' }, 'Stark');
            expect(() => UtilsService.isUndefinedOrEmpty(myWeakMap)).to.throw('Unable to check emptyness of a WeakMap');

            const myWeakSet: WeakSet<{}> = new WeakSet();
            myWeakSet.add({ Winter: 'is coming' });
            expect(() => UtilsService.isUndefinedOrEmpty(myWeakSet)).to.throw('Unable to check emptyness of a WeakSet');
        });

        it('should return false if value is a function', () => {
            expect(UtilsService.isUndefinedOrEmpty(_.noop)).to.be.false;
        });

        it('should return false if value is a number', () => {
            expect(UtilsService.isUndefinedOrEmpty(42)).to.be.false;
        });

        it('should return true if value is `NaN`', () => {
            expect(UtilsService.isUndefinedOrEmpty(NaN)).to.be.true;
        });

        it('should return false if value is a boolean', () => {
            expect(UtilsService.isUndefinedOrEmpty(true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(false)).to.be.false;
        });

        it('should return false if value is a date', () => {
            expect(UtilsService.isUndefinedOrEmpty(new Date())).to.be.false;
        });

        it('should return true if value is a regular expression', () => {
            expect(UtilsService.isUndefinedOrEmpty(new RegExp(''))).to.be.false;

            const myRegExp: RegExp = /ab+c/i;
            expect(UtilsService.isUndefinedOrEmpty(myRegExp)).to.be.false;
        });

        it('should only apply a "method" if value is an array', () => {
            /* tslint:disable:no-null-keyword */
            // Object.
            expect(UtilsService.isUndefinedOrEmpty({ first: 'first', second: null }, 'some', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: 'first', second: null }, 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: 'first', second: null }, 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: 'first', second: null }, 'anythingElse', false))
                .to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: 'first', second: null }, null, false)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty({ first: null, second: null }, 'some', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: null, second: null }, 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: null, second: null }, 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: null, second: null }, 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty({ first: null, second: null }, null, false)).to.be.false;

            // Array.
            expect(UtilsService.isUndefinedOrEmpty(['first', null], 'some', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(['first', null], 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', null], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', null], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', null], null, false)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty([null, null], 'some', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([null, null], 'every', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([null, null], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([null, null], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([null, null], null, false)).to.be.false;
            /* tslint:enable:no-null-keyword */
        });

        it('should only apply a "method" if it is either `some` or `every`', () => {
            /* tslint:disable:no-null-keyword */
            expect(UtilsService.isUndefinedOrEmpty(['first', ''], 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ''], 'some', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(['first', ''], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ''], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ''], null, false)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'every', true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'some', true)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'forEach', true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'anythingElse', true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], null, true)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'some', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['first', ' '], null, false)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty(['', null], 'every', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(['', null], 'some', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty(['', null], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['', null], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty(['', null], null, false)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'every', true)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'some', true)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'forEach', true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'anythingElse', true)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], null, true)).to.be.false;

            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'every', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'some', false)).to.be.true;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'forEach', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], 'anythingElse', false)).to.be.false;
            expect(UtilsService.isUndefinedOrEmpty([' ', null], null, false)).to.be.false;
            /* tslint:enable:no-null-keyword */
        });
    });


    afterEach(() => {
        // Nothing to do here.
    });
});
