import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function GridController() {
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
        orientation: 'horizontal',
        wrap: 'nowrap',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get link classes.
     *
     * @return {Array} The list of link classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isDefined(lx.gutter)) {
            classes.push(`${CSS_PREFIX}-grid--gutter-${lx.gutter}`);
        }

        if (angular.isDefined(lx.hAlign)) {
            classes.push(`${CSS_PREFIX}-grid--h-align-${lx.hAlign}`);
        }

        if (angular.isUndefined(lx.orientation)) {
            classes.push(`${CSS_PREFIX}-grid--orientation-${_DEFAULT_PROPS.orientation}`);
        } else {
            classes.push(`${CSS_PREFIX}-grid--orientation-${lx.orientation}`);
        }

        if (angular.isDefined(lx.vAlign)) {
            classes.push(`${CSS_PREFIX}-grid--v-align-${lx.vAlign}`);
        }

        if (angular.isUndefined(lx.wrap)) {
            classes.push(`${CSS_PREFIX}-grid--wrap-${_DEFAULT_PROPS.wrap}`);
        } else {
            classes.push(`${CSS_PREFIX}-grid--wrap-${lx.wrap}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function GridDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: GridController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            gutter: '@?lxGutter',
            hAlign: '@?lxHAlign',
            orientation: '@?lxOrientation',
            vAlign: '@?lxVAlign',
            wrap: '@?lxWrap',
        },
        template: '<div class="lumx-grid" ng-class="lx.getClasses()" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.grid').directive('lxGrid', GridDirective);

/////////////////////////////

export { GridDirective };
