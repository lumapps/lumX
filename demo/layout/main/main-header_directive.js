import { mdiReact } from '@lumx/icons';

import template from './main-header.html';

/////////////////////////////

function mainHeaderController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const mainHeader = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The main header icons.
     *
     * @type {Object}
     */
    mainHeader.icons = {
        mdiReact,
    };
}

/////////////////////////////

function mainHeaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: mainHeaderController,
        controllerAs: 'mainHeader',
        replace: true,
        restrict: 'E',
        scope: {
            category: '@',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx-demo').directive('mainHeader', mainHeaderDirective);

/////////////////////////////

export { mainHeaderDirective };
