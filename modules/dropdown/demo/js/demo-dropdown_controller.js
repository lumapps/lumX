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

        vm.closeDropdown = closeDropdown;
        vm.openDropdown = openDropdown;

        vm.dropdownId = 'test-dropdown-menu';
        vm.dropdownTarget = 'test-dropdown-target';

        ////////////

        function closeDropdown(_event)
        {
            _event.stopPropagation();

            LxDropdownService.close(vm.dropdownId);
        }

        function openDropdown(_event)
        {
            _event.stopPropagation();

            LxDropdownService.open(vm.dropdownId, '#' + vm.dropdownTarget);
        }
    }
})();