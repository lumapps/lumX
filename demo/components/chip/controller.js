import { mdiCheck, mdiClose, mdiCloseCircle, mdiEmail, mdiFilterVariant } from '@lumx/icons';

/////////////////////////////

function DemoChipController(LxNotificationService) {
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
        mdiCheck,
        mdiClose,
        mdiCloseCircle,
        mdiEmail,
        mdiFilterVariant,
    };

    /**
     * Indicates if the chip is active or not.
     *
     * @type {Object}
     */
    vm.isSelected = {
        filter: [false],
        multiple: [false, false, false, false, false, false],
        unique: [false, false, false, false, false, false],
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * When the chip has been clicked, display a notification.
     */
    function clickCallback() {
        LxNotificationService.success('Callback');
    }

    /**
     * Toggle chip selected state.
     *
     * @param {string} kind  The chip kind.
     * @param {number} index The chip index.
     */
    function toggleSelected(kind, index) {
        vm.isSelected[kind][index] = !vm.isSelected[kind][index];

        if (kind === 'unique') {
            for (let i = 0, len = vm.isSelected.unique.length; i < len; i++) {
                if (i !== index) {
                    vm.isSelected.unique[i] = false;
                }
            }
        }
    }

    /**
     * Select chip.
     *
     * @param {string} kind  The chip kind.
     * @param {number} index The chip index.
     */
    function select(kind, index) {
        if (vm.isSelected[kind][index]) {
            return;
        }

        vm.isSelected[kind][index] = true;
    }

    /**
     * Unselect chip.
     *
     * @param {string} kind  The chip kind.
     * @param {number} index The chip index.
     */
    function unselect(kind, index) {
        if (!vm.isSelected[kind][index]) {
            return;
        }

        vm.isSelected[kind][index] = false;
    }

    /////////////////////////////

    vm.clickCallback = clickCallback;
    vm.toggleSelected = toggleSelected;
    vm.select = select;
    vm.unselect = unselect;
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoChipController', DemoChipController);

/////////////////////////////

export { DemoChipController };
