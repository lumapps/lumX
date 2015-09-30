(function() {
    'use strict';

    angular
        .module('lumx.progress', [])
        .directive('lxProgress', lxProgress);

    function lxProgress()
    {
        var directive =
        {
            restrict: 'E',
            templateUrl: 'progress.html',
            scope: {
                lxType: '@?',
                lxDiameter: '@?',
                lxColor: '@?',
            },
            controller: LxProgressController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    function LxProgressController()
    {
        var vm = this;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public members
        vm.getProgressDiameter = getProgressDiameter;

        //
        // PRIVATE METHODS
        //

        /**
         * Initialize the controller
         */
        function _init()
        {
            vm.lxDiameter =  angular.isDefined(vm.lxDiameter) ? vm.lxDiameter : 50;
            vm.lxColor =  angular.isDefined(vm.lxColor) ? vm.lxColor : 'primary';
        }

        //
        // PUBLIC METHODS
        //

        /**
         * Get circular progress diameter
         */
        function getProgressDiameter()
        {
            if (vm.lxType === 'circular')
            {
                return { 'transform': 'scale(' + parseInt(vm.lxDiameter) / 100 + ')' };
            }

            return;
        }

        //
        // INITIALIZATION
        //

        _init();
    }
})();
