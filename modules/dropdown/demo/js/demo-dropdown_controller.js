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

        ////////////

        function openDropdown(_event, _dropdown, _target)
        {
            _event.stopPropagation();

            LxDropdownService.open(_dropdown, _target);
        }
    }
})();