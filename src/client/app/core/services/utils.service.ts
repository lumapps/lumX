import _ from 'lodash';


/**
 * Misc utilities.
 */
export class UtilsService {
    /**
     * The function we can use in `isDefined` and `isUndefined` over each values.
     *
     * @type Array[string]
     *
     * @private
     * @static
     */
    private static ALLOWED_METHOD_NAMES: string[] = ['every', 'some'];


    /**
     * Invert a method name for defined/undefined check.
     *
     * @param  {string} [methodName] The method name we want to invert.
     *                               Possible values are: 'some' or 'every'.
     * @return {string} The opposite method name.
     *                  Respective possible values are: 'every' or 'some'.
     *
     * @public
     * @static
     */
    public static invertMethodName(methodName?: string): string {
        let invertedMethodName: string;

        if (methodName === 'some') {
            invertedMethodName = 'every';
        } else if (methodName === 'every') {
            invertedMethodName = 'some';
        } else {
            invertedMethodName = undefined;
        }

        return invertedMethodName;
    }

    /**
     * Check if a method name is allowed.
     *
     * @param  {string}  methodName The method name to check.
     * @return {boolean} If the method is allowed or not.
     *
     * @public
     * @static
     */
    public static isAllowedMethod(methodName: string): boolean {
        return _.includes(UtilsService.ALLOWED_METHOD_NAMES, methodName);
    }

    /**
     * Determines if value(s) is(are) defined (and not null).
     *
     * @param  {*}       value             The value(s) to check if defined (and not null).
     * @param  {string}  [methodName]      The name of the method to apply to the values of the array (if value is an
     *                                     array).
     *                                     Possible values are 'some' or 'every'.
     * @param  {boolean} [allowNull=false] Indicates if we want to consider `null` as defined.
     * @return {boolean} If the value(s) is(are) defined (and not null).
     *
     * @public
     * @static
     */
    // tslint:disable-next-line:no-any
    public static isDefined(value: any, methodName?: string, allowNull: boolean = false): boolean {
        return !UtilsService.isUndefined(value, UtilsService.invertMethodName(methodName), allowNull);
    }

    /**
     * Determines if value(s) is(are) defined (and not null) and filled with a value.
     * Are considered as empty values: empty arrays/(weak)map/(weak)set/buffer/elements/args/..., object without any
     * properties, empty strings, empty dates, empty regexp and NaN.
     *
     * @param  {*}       value             The value(s) to check if defined (and not null) and filled.
     * @param  {string}  [methodName]      The name of the method to apply to the values of the array (if value is an
     *                                     array).
     *                                     Possible values are 'some' or 'every'.
     * @param  {boolean} [trimStrings]     Indicates if we want strings to be trimed before checking their emptyness.
     * @param  {boolean} [allowNull=false] Indicates if we want to consider `null` as defined.
     * @return {boolean} If the value(s) is(are) defined (and not null) and filled.
     *
     * @public
     * @static
     */
    // tslint:disable-next-line:no-any
    public static isDefinedAndFilled(value: any, methodName?: string, trimStrings: boolean = true,
                                     allowNull: boolean = false): boolean {
        return !UtilsService.isUndefinedOrEmpty(
            value, UtilsService.invertMethodName(methodName), trimStrings, allowNull,
        );
    }

    /**
     * Determines if value(s) is(are) undefined (or null).
     *
     * @param  {*}       value             The value(s) to check if undefined (or null).
     * @param  {string}  [methodName]      The name of the method to apply to the values of the array (if value is an
     *                                     array).
     *                                     Possible values are 'some' or 'every'.
     * @param  {boolean} [allowNull=false] Indicates if we want to consider `null` as defined.
     * @return {boolean} If the value(s) is(are) undefined (or null).
     *
     * @public
     * @static
     */
    // tslint:disable-next-line:no-any
    public static isUndefined(value: any, methodName?: string, allowNull: boolean = false): boolean {
        if (_.isArray(value) && _.includes(UtilsService.ALLOWED_METHOD_NAMES, methodName) &&
            _.isFunction(value[methodName])) {
            // tslint:disable-next-line:no-any
            return value[methodName]((item: any) => UtilsService.isUndefined(item, methodName, allowNull));
        }

        return _.isUndefined(value) || (!allowNull && _.isNull(value));
    }

    /**
     * Determines if value(s) is(are) undefined (or null) and not filled with any value.
     * Are considered as empty values: empty arrays/(weak)map/(weak)set/buffer/elements/args/..., object without any
     * properties, empty strings, empty dates, empty regexp and NaN.
     *
     * @param  {*}       value             The value(s) to check if undefined (or null) or empty.
     * @param  {string}  [methodName]      The name of the method to apply to the values of the array (if value is an
     *                                     array).
     *                                     Possible values are 'some' or 'every'.
     * @param  {boolean} [trimStrings]     Indicates if we want strings to be trimed before checking their emptyness.
     * @param  {boolean} [allowNull=false] Indicates if we want to consider `null` as defined.
     * @return {boolean} If the value(s) is(are) undefined (or null) or empty.
     *
     * @public
     * @static
     */
    // tslint:disable-next-line:no-any cyclomatic-complexity
    public static isUndefinedOrEmpty(value: any, methodName?: string, trimStrings: boolean = true,
                                     allowNull: boolean = false): boolean {
        value = (trimStrings && _.isString(value) && _.isFunction(value.trim)) ? value.trim() : value;

        if (_.isArray(value) && _.includes(UtilsService.ALLOWED_METHOD_NAMES, methodName) &&
            _.isFunction(value[methodName])) {
            // tslint:disable-next-line:no-any
            return value[methodName]((item: any) =>
                UtilsService.isUndefinedOrEmpty(item, methodName, trimStrings, allowNull));
        }

        const isUndefined: boolean = UtilsService.isUndefined(value, methodName, allowNull);

        if (!isUndefined && _.isWeakSet(value)) {
            throw new Error('Unable to check emptyness of a WeakSet');
        }
        if (!isUndefined && _.isWeakMap(value)) {
            throw new Error('Unable to check emptyness of a WeakMap');
        }

        return isUndefined ||
            ((_.isArrayLike(value) || _.isMap(value) || _.isWeakMap(value) || _.isSet(value) ||
              (_.isObjectLike(value) && !_.isDate(value) && !_.isRegExp(value))) && _.isEmpty(value)) ||
            (_.isDate(value) && _.isEmpty(value.toString())) ||
            (_.isRegExp(value) && (value.toString.length - 2) === 0) ||
            (_.isNaN(value));
    }
}
