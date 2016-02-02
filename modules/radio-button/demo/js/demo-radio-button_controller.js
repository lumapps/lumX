(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoRadioButtonController', DemoRadioButtonController);

    function DemoRadioButtonController()
    {
        var vm = this;

        vm.radioButtons = {
            basic:
            {
                test1: 'ipsum',
                test2: 'lorem'
            },
            states:
            {
                test3: 'dolor'
            },
            colors:
            {
                test4: 'lorem'
            }
        };
    }
})();