import { CSS_PREFIX } from '@lumx/core/js/constants';

import { mdiMenuDown } from '@lumx/icons';

import template from '../views/chip.html';

/////////////////////////////

function ChipController() {
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
        color: 'dark',
        size: 'm',
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has after slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasBefore = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasLabel = false;

    /**
     * The chip icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiMenuDown,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get chip classes.
     *
     * @return {Array} The list of chip classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isUndefined(lx.color)) {
            if (angular.isDefined(lx.theme) && lx.theme) {
                const chipColor = lx.theme === 'light' ? 'dark' : 'light';
                classes.push(`${CSS_PREFIX}-chip--color-${chipColor}`);
            } else {
                classes.push(`${CSS_PREFIX}-chip--color-${_DEFAULT_PROPS.color}`);
            }
        } else {
            classes.push(`${CSS_PREFIX}-chip--color-${lx.color}`);
        }

        if (lx.hasBefore) {
            classes.push(`${CSS_PREFIX}-chip--has-before`);
        }

        if (lx.hasAfter || lx.hasDropdownIndicator) {
            classes.push(`${CSS_PREFIX}-chip--has-after`);
        }

        if (angular.isUndefined(lx.isSelected) || !lx.isSelected) {
            classes.push(`${CSS_PREFIX}-chip--is-unselected`);
        }

        if (lx.isSelected) {
            classes.push(`${CSS_PREFIX}-chip--is-selected`);
        }

        if (angular.isFunction(lx.onClick)) {
            classes.push(`${CSS_PREFIX}-chip--is-clickable`);
        }

        if (lx.isDisabled) {
            classes.push(`${CSS_PREFIX}-chip--is-disabled`);
        }

        if (angular.isUndefined(lx.size)) {
            classes.push(`${CSS_PREFIX}-chip--size-${_DEFAULT_PROPS.size}`);
        } else {
            classes.push(`${CSS_PREFIX}-chip--size-${lx.size}`);
        }

        if (lx.customColors) {
            classes.push(`${CSS_PREFIX}-custom-colors`);
        }

        return classes;
    }

    /**
     * Handle given function on after area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnAfterClick(evt) {
        if (!angular.isFunction(lx.onAfterClick)) {
            return;
        }

        evt.stopPropagation();

        lx.onAfterClick();
    }

    /**
     * Handle given function on before area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnBeforeClick(evt) {
        if (!angular.isFunction(lx.onBeforeClick)) {
            return;
        }

        evt.stopPropagation();

        lx.onBeforeClick();
    }

    /**
     * Handle given function on the whole area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnClick(evt) {
        if (!angular.isFunction(lx.onClick)) {
            return;
        }

        lx.onClick({ $event: evt });
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.handleOnAfterClick = handleOnAfterClick;
    lx.handleOnBeforeClick = handleOnBeforeClick;
    lx.handleOnClick = handleOnClick;
}

/////////////////////////////

function ChipDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
        }

        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
        }
    }

    return {
        bindToController: true,
        controller: ChipController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
            customColors: '=?lxCustomColors',
            hasDropdownIndicator: '=?lxHasDropdownIndicator',
            isDisabled: '=?ngDisabled',
            isSelected: '=?lxIsSelected',
            onAfterClick: '&?lxOnAfterClick',
            onBeforeClick: '&?lxOnBeforeClick',
            onClick: '&?lxOnClick',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            after: '?lxChipAfter',
            before: '?lxChipBefore',
            label: 'lxChipLabel',
        },
    };
}

/////////////////////////////

angular.module('lumx.chip').directive('lxChip', ChipDirective);

/////////////////////////////

export { ChipDirective };
