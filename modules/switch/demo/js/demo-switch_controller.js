(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoSwitchController', DemoSwitchController);

    function DemoSwitchController()
    {
        var vm = this;

        vm.switches = {
            basic:
            {
                checked: true,
                unchecked: false
            },
            states:
            {
                disabled: false
            },
            colors:
            {
                blue: true,
                green: true,
                orange: true,
                red: true
            }
        };
    }
})();