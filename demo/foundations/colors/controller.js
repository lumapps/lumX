import { COLOR_VARIANTS } from '../../constants';

function DemoColorsController() {
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
     * @constant
     * @readonly
     */
    vm.colors = COLOR_VARIANTS;
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoColorsController', DemoColorsController);

/////////////////////////////

export { DemoColorsController };
