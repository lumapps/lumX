import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/table.html';

/////////////////////////////

function TableController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get table classes.
     *
     * @return {Array} The list of table classes.
     */
    function getClasses() {
        const classes = [];

        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-table--theme-${theme}`);

        if (lx.hasBefore) {
            classes.push(`${CSS_PREFIX}-table--has-before`);
        }

        if (lx.hasDividers) {
            classes.push(`${CSS_PREFIX}-table--has-dividers`);
        }

        if (lx.isClickable) {
            classes.push(`${CSS_PREFIX}-table--is-clickable`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function TableDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            hasBefore: '=?lxHasBefore',
            hasDividers: '=?lxHasDividers',
            isClickable: '=?lxIsClickable',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.table').directive('lxTable', TableDirective);

/////////////////////////////

export { TableDirective };
