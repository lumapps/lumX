import { CSS_PREFIX } from '@lumx/core/js/constants';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import template from '../views/side-navigation-item.html';

/////////////////////////////

function SideNavigationItemController() {
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
        emphasis: 'medium',
    };

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
     * Get side navigation item classes.
     *
     * @return {Array} The list of side navigation item classes.
     */
    function getClasses() {
        const classes = [];

        const emphasis = lx.emphasis ? lx.emphasis : _DEFAULT_PROPS.emphasis;

        classes.push(`${CSS_PREFIX}-side-navigation-item--emphasis-${emphasis}`);

        if (lx.isSelected) {
            classes.push(`${CSS_PREFIX}-side-navigation-item--is-selected`);
        }

        return classes;
    }

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

    lx.getClasses = getClasses;
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
