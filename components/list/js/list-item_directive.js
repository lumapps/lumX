import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/list-item.html';

/////////////////////////////

function ListItemController($element, $scope) {
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
     * Whether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasContent = false;

    /**
     * The parent controller (list).
     *
     * @type {Object}
     */
    lx.parentController = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Register item index as active index to the list.
     */
    function _registerIndex() {
        if (angular.isUndefined(lx.parentController)) {
            return;
        }

        lx.parentController.activeItemIndex = $element.index(`.${CSS_PREFIX}-list-item`);
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Register item index as active index to the list on focus.
     */
    $element.on('focus', _registerIndex);

    /**
     * Unbind event listener on destroy.
     */
    $scope.$on('$destroy', () => {
        $element.off('focus', _registerIndex);
    });
}

/////////////////////////////

function ListItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrls[0].hasBefore = true;
        }

        if (transclude.isSlotFilled('content')) {
            ctrls[0].hasContent = true;
        }

        if (transclude.isSlotFilled('after')) {
            ctrls[0].hasAfter = true;
        }

        if (angular.isDefined(ctrls[1]) && ctrls[1]) {
            // eslint-disable-next-line prefer-destructuring
            ctrls[0].parentController = ctrls[1];
        }
    }

    return {
        bindToController: true,
        controller: ListItemController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxListItem', '?^lxList'],
        restrict: 'E',
        scope: {
            isSelected: '=?lxIsSelected',
            size: '@?lxSize',
        },
        template,
        transclude: {
            after: '?lxListItemAfter',
            before: '?lxListItemBefore',
            content: '?lxListItemContent',
        },
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListItem', ListItemDirective);

/////////////////////////////

export { ListItemDirective };
