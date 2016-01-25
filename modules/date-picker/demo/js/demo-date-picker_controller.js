(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDatePickerController', DemoDatePickerController);

    /* @ngInject */
    function DemoDatePickerController()
    {
        var vm = this;

        vm.datePicker = {
            date1: new Date(),
            date2: new Date(),
            emptyDate: undefined,
            minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
            maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate())
        };
    }
})();