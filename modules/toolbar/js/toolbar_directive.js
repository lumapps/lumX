import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/toolbar.html';

/////////////////////////////

function ToolbarController() {
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
}

/////////////////////////////

function ToolbarDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-before`);
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-label`);
        }

        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-after`);
        }
    }

    return {
        bindToController: true,
        controller: ToolbarController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        template,
        transclude: {
            after: '?lxToolbarAfter',
            before: '?lxToolbarBefore',
            label: '?lxToolbarLabel',
        },
    };
}

/////////////////////////////

angular.module('lumx.toolbar').directive('lxToolbar', ToolbarDirective);

/////////////////////////////

export { ToolbarDirective };
