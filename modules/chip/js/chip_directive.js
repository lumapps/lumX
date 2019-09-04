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

        const defaultProps = {
            color: 'dark',
        };

        if (!attrs.lxColor) {
            el.addClass(`${CSS_PREFIX}-chip--color-${defaultProps.color}`);
        }

        attrs.$observe('lxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*chip--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-chip--color-${color}`);
        });
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
