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
     * Get grid classes.
     *
     * @return {Array} The list of grid classes.
     */
    function getClasses() {
        const classes = [];

        const orientation = lx.orientation ? lx.orientation : _DEFAULT_PROPS.orientation;
        const wrap = lx.wrap ? lx.wrap : _DEFAULT_PROPS.wrap;

        classes.push(`${CSS_PREFIX}-grid--orientation-${orientation}`);
        classes.push(`${CSS_PREFIX}-grid--wrap-${wrap}`);

        if (lx.gutter) {
            classes.push(`${CSS_PREFIX}-grid--gutter-${lx.gutter}`);
        }

        if (lx.hAlign) {
            classes.push(`${CSS_PREFIX}-grid--h-align-${lx.hAlign}`);
        }

        if (lx.vAlign) {
            classes.push(`${CSS_PREFIX}-grid--v-align-${lx.vAlign}`);
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
