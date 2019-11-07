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

        let color;
        if (lx.color) {
            ({ color } = lx.color);
        } else if (angular.isDefined(lx.theme) && lx.theme) {
            color = lx.theme === 'light' ? 'dark' : 'light';
        } else {
            ({ color } = _DEFAULT_PROPS.color);
        }

        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;
        const state = lx.isSelected ? 'selected' : 'unselected';

        classes.push(`${CSS_PREFIX}-chip--color-${color}`);
        classes.push(`${CSS_PREFIX}-chip--size-${size}`);
        classes.push(`${CSS_PREFIX}-chip--is-${state}`);

        if (lx.hasAfter || lx.hasDropdownIndicator) {
            classes.push(`${CSS_PREFIX}-chip--has-after`);
        }

        if (lx.hasBefore) {
            classes.push(`${CSS_PREFIX}-chip--has-before`);
        }

        if (angular.isFunction(lx.onClick)) {
            classes.push(`${CSS_PREFIX}-chip--is-clickable`);
        }

        if (lx.isDisabled) {
            classes.push(`${CSS_PREFIX}-chip--is-disabled`);
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
