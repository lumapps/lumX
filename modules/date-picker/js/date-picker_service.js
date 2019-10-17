function LxDatePickerService(LxDialogService) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given date picker.
     *
     * @param {string} datePickerId The date picker identifier.
     */
    function closeDatePicker(datePickerId) {
        LxDialogService.close(datePickerId);
    }

    /**
     * Close a given date picker.
     *
     * @param {string} datePickerId The date picker identifier.
     */
    function openDatePicker(datePickerId) {
        LxDialogService.open(datePickerId);
    }

    /////////////////////////////

    service.close = closeDatePicker;
    service.open = openDatePicker;
}

/////////////////////////////

angular.module('lumx.date-picker').service('LxDatePickerService', LxDatePickerService);

/////////////////////////////

export { LxDatePickerService };
