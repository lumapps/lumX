(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDropdownController', DemoDropdownController);

    DemoDropdownController.$inject = ['LxDropdownService'];

    function DemoDropdownController(LxDropdownService)
    {
        var vm = this;

        vm.openDropdown = openDropdown;

        vm.dropdownId = 'test-dropdown-menu';
        vm.dropdownTarget = 'test-dropdown-target';

        ////////////

        function openDropdown(_event)
        {
            _event.stopPropagation();

            LxDropdownService.open(vm.dropdownId, '#' + vm.dropdownTarget);
        }
    }
})();