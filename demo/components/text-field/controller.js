import { mdiMagnify } from '@lumx/icons';

/////////////////////////////

function DemoTextFieldController() {
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
    vm.icons = {
        mdiMagnify,
    };

    /**
     * The model of the text fields in the demo page.
     *
     * @type {Object}
     */
    vm.textFields = {
        model: {
            value: 'Value',
            validValue: 'Valid value',
            invalidValue: 'Invalid value',
            empty: '',
        },
    };
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoTextFieldController', DemoTextFieldController);

/////////////////////////////

export { DemoTextFieldController };
