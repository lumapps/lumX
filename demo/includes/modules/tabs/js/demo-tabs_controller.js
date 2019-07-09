(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoTabsController', DemoTabsController);

    function DemoTabsController()
    {
        var vm = this;
        var tabIndex = 4;

        vm.addTab = addTab;
        vm.removeFirstTab = removeFirstTab;
        vm.removeTab = removeTab;

        vm.activeTab = 1;
        vm.tabIsDisabled = false;
        vm.tabs = [
        {
            heading: 'Tab 1',
            content: 'Tab 1 content'
        },
        {
            heading: 'Tab 2',
            content: 'Tab 2 content'
        },
        {
            heading: 'Tab 3',
            content: 'Tab 3 content'
        }];

        ////////////

        function addTab()
        {
            vm.tabs.push(
            {
                heading: 'Tab ' + tabIndex,
                content: 'Tab ' + tabIndex + ' content'
            });

            ++tabIndex;
        }

        function removeFirstTab()
        {
            removeTab(0);
        }

        function removeTab(_idx)
        {
            if (vm.tabs.length > _idx)
            {
                vm.tabs.splice(_idx, 1);
            }
        }
    }
})();