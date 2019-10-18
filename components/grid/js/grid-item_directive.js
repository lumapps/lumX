import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function GridItemController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get grid item classes.
     *
     * @return {Array} The list of grid item classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isDefined(lx.align)) {
            classes.push(`${CSS_PREFIX}-grid-item--align-${lx.align}`);
        }

        if (angular.isDefined(lx.order)) {
            classes.push(`${CSS_PREFIX}-grid-item--order-${lx.order}`);
        }

        if (angular.isDefined(lx.width)) {
            classes.push(`${CSS_PREFIX}-grid-item--width-${lx.width}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function GridItemDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: GridItemController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
            order: '@?lxOrder',
            width: '@?lxWidth',
        },
        template: '<div class="lumx-grid-item" ng-class="lx.getClasses()" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.grid').directive('lxGridItem', GridItemDirective);

/////////////////////////////

export { GridItemDirective };
