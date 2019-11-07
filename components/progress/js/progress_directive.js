import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/progress.html';

/////////////////////////////

function ProgressController() {
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
        theme: 'light',
        variant: 'circular',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get checkbox classes.
     *
     * @return {Array} The list of checkbox classes.
     */
    function getClasses() {
        const classes = [];

        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        const variant = lx.variant ? lx.variant : _DEFAULT_PROPS.variant;

        classes.push(`${CSS_PREFIX}-progress--theme-${theme}`);
        classes.push(`${CSS_PREFIX}-progress--variant-${variant}`);

        if (lx.customColors) {
            classes.push(`${CSS_PREFIX}-custom-colors`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function ProgressDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lxCustomColors',
            theme: '@?lxTheme',
            variant: '@?lxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.progress').directive('lxProgress', ProgressDirective);

/////////////////////////////

export { ProgressDirective };
