(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoProgressController', DemoProgressController);

    function DemoProgressController()
    {
        var vm = this;

        vm.toggleCircularProgress = toggleCircularProgress;
        vm.toggleLinearProgress = toggleLinearProgress;

        vm.showCircularProgress = false;
        vm.showLinearProgress = false;

        ////////////

        function toggleCircularProgress()
        {
            vm.showCircularProgress = !vm.showCircularProgress;
        }

        function toggleLinearProgress()
        {
            vm.showLinearProgress = !vm.showLinearProgress;
        }
    }
})();