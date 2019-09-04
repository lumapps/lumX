import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import template from '../views/side-navigation-item.html';

/////////////////////////////

function SideNavigationItemController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has children slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasChildren = false;

    /**
     * The side navigation item icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiChevronDown,
        mdiChevronUp,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Handle click event on side navigation item link.
     */
    function handleClick() {
        if (angular.isFunction(lx.onClick)) {
            lx.onClick();
        } else {
            lx.isOpen = !lx.isOpen;
        }
    }

    /////////////////////////////

    lx.handleClick = handleClick;
}

/////////////////////////////

function SideNavigationItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        transclude((clone) => {
            if (clone.length > 0) {
                ctrl.hasChildren = true;
            }
        });
    }

    return {
        bindToController: true,
        controller: SideNavigationItemController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            emphasis: '@?lxEmphasis',
            icon: '@?lxIcon',
            isOpen: '=?lxIsOpen',
            isSelected: '=?lxIsSelected',
            label: '@lxLabel',
            onClick: '&?lxOnClick',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.side-navigation').directive('lxSideNavigationItem', SideNavigationItemDirective);

/////////////////////////////

export { SideNavigationItemDirective };
