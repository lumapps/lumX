(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDatePickerController', DemoDatePickerController);

    DemoDatePickerController.$inject = ['LxDatePickerService'];

    function DemoDatePickerController(LxDatePickerService)
    {
        var vm = this;

        vm.datePickerCallback = datePickerCallback;
        vm.openDatePicker = openDatePicker;

        vm.locale = 'en';
        vm.datePicker = {
            basic:
            {
                date: new Date(),
                dateFormatted: moment().locale(vm.locale).format('LL'),
                minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
                maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate())
            },
            input:
            {
                date: new Date(),
                dateFormatted: moment().locale(vm.locale).format('LL')
            }
        };
        vm.datePickerId = 'date-picker';

        ////////////

        function datePickerCallback(_newdate)
        {
            vm.datePicker.basic.date = _newdate;
            vm.datePicker.basic.dateFormatted = moment(_newdate).locale(vm.locale).format('LL');
        }

        function openDatePicker(_pickerId)
        {
            LxDatePickerService.open(_pickerId);
        }
    }
})();