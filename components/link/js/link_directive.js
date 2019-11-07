import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function LinkController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

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

        if (lx.color) {
            classes.push(`${CSS_PREFIX}-link--color-${lx.color}`);
        }

        if (lx.colorVariant) {
            classes.push(`${CSS_PREFIX}-link--color-variant-${lx.colorVariant}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function LinkDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: LinkController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
            colorVariant: '@?lxColorVariant',
        },
        template: `<a class="${CSS_PREFIX}-link" ng-class="lx.getClasses()" ng-transclude></a>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.link').directive('lxLink', LinkDirective);

/////////////////////////////

export { LinkDirective };
