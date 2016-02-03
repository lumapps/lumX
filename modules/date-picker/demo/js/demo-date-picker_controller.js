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
            date: new Date(),
            dateFormatted: moment().locale(vm.locale).format('LL'),
            minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
            maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate())
        };
        vm.datePickerId = 'date-picker';

        ////////////

        function datePickerCallback(_newdate)
        {
            vm.datePicker.date = _newdate;
            vm.datePicker.dateFormatted = moment(_newdate).locale(vm.locale).format('LL');
        }

        function openDatePicker(_pickerId)
        {
            LxDatePickerService.open(_pickerId);
        }
    }
})();