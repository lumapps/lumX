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
            controllerAs: 'lxProgress',
            bindToController: true
        };

        return directive;
    }

    function LxProgressController()
    {
        var lxProgress = this;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public members
        lxProgress.getProgressDiameter = getProgressDiameter;

        //
        // PRIVATE METHODS
        //

        /**
         * Initialize the controller
         */
        function _init()
        {
            lxProgress.lxDiameter =  angular.isDefined(lxProgress.lxDiameter) ? lxProgress.lxDiameter : 50;
            lxProgress.lxColor =  angular.isDefined(lxProgress.lxColor) ? lxProgress.lxColor : 'primary';
        }

        //
        // PUBLIC METHODS
        //

        /**
         * Get circular progress diameter
         */
        function getProgressDiameter()
        {
            if (lxProgress.lxType === 'circular')
            {
                return { 'transform': 'scale(' + parseInt(lxProgress.lxDiameter) / 100 + ')' };
            }

            return;
        }

        //
        // INITIALIZATION
        //

        _init();
    }
})();
