import { mdiChevronLeft, mdiDotsVertical, mdiMagnify, mdiMenuDown, mdiTranslate, mdiViewGrid } from '@lumx/icons';

/////////////////////////////

function DemoToolbarController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiChevronLeft,
        mdiDotsVertical,
        mdiMagnify,
        mdiMenuDown,
        mdiTranslate,
        mdiViewGrid,
    };

    /**
     * The search field model.
     *
     * @type {string}
     */
    vm.searchFieldModel = '';
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoToolbarController', DemoToolbarController);

/////////////////////////////

export { DemoToolbarController };
