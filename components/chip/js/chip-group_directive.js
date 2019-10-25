import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ChipGroupController() {
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
        align: 'left',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get button classes.
     *
     * @return {Array} The list of button classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isDefined(lx.align) && lx.align) {
            classes.push(`${CSS_PREFIX}-chip-group--align-${lx.align}`);
        } else {
            classes.push(`${CSS_PREFIX}-chip-group--align-${_DEFAULT_PROPS.align}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function ChipGroupDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ChipGroupController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
        },
        template: `<div class="${CSS_PREFIX}-chip-group" ng-class="lx.getClasses()" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.chip').directive('lxChipGroup', ChipGroupDirective);

/////////////////////////////

export { ChipGroupDirective };
