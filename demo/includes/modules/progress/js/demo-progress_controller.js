(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoProgressController', DemoProgressController);

    DemoProgressController.$inject = ['$interval'];

    function DemoProgressController($interval)
    {
        var vm = this;
        var determinateCircularProgressInterval;
        var determinateLinearProgressInterval;

        vm.toggleDeterminateCircularProgress = toggleDeterminateCircularProgress;
        vm.toggleDeterminateLinearProgress = toggleDeterminateLinearProgress;
        vm.toggleIndeterminateCircularProgress = toggleIndeterminateCircularProgress;
        vm.toggleIndeterminateLinearProgress = toggleIndeterminateLinearProgress;

        vm.determinateCircularProgressValue = 0;
        vm.determinateLinearProgressValue = 0;
        vm.showDeterminateCircularProgress = false;
        vm.showDeterminateLinearProgress = false;
        vm.showIndeterminateCircularProgress = false;
        vm.showIndeterminateLinearProgress = false;

        ////////////

        function toggleDeterminateCircularProgress()
        {
            vm.showDeterminateCircularProgress = !vm.showDeterminateCircularProgress;

            if (vm.showDeterminateCircularProgress)
            {
                vm.determinateCircularProgressValue = 0;

                determinateCircularProgressInterval = $interval(function()
                {
                    if (vm.determinateCircularProgressValue < 100)
                    {
                        vm.determinateCircularProgressValue += 1;
                    }
                    else
                    {
                        $interval.cancel(determinateCircularProgressInterval);
                    }
                }, 100);
            }
            else
            {
                $interval.cancel(determinateCircularProgressInterval);
            }
        }

        function toggleDeterminateLinearProgress()
        {
            vm.showDeterminateLinearProgress = !vm.showDeterminateLinearProgress;

            if (vm.showDeterminateLinearProgress)
            {
                vm.determinateLinearProgressValue = 0;

                determinateLinearProgressInterval = $interval(function()
                {
                    if (vm.determinateLinearProgressValue < 100)
                    {
                        vm.determinateLinearProgressValue += 1;
                    }
                    else
                    {
                        $interval.cancel(determinateLinearProgressInterval);
                    }
                }, 100);
            }
            else
            {
                $interval.cancel(determinateLinearProgressInterval);
            }
        }

        function toggleIndeterminateCircularProgress()
        {
            vm.showIndeterminateCircularProgress = !vm.showIndeterminateCircularProgress;
        }

        function toggleIndeterminateLinearProgress()
        {
            vm.showIndeterminateLinearProgress = !vm.showIndeterminateLinearProgress;
        }
    }
})();