(function()
{
    'use strict';

    angular
        .module('lumx.progress')
        .directive('lxProgress', lxProgress);

    function lxProgress()
    {
        return {
            restrict: 'E',
            templateUrl: 'progress.html',
            scope:
            {
                lxColor: '@?',
                lxDiameter: '@?',
                lxType: '@',
                lxValue: '@'
            },
            controller: LxProgressController,
            controllerAs: 'lxProgress',
            bindToController: true,
            replace: true
        };
    }

    function LxProgressController()
    {
        var lxProgress = this;

        lxProgress.getCircularProgressValue = getCircularProgressValue;
        lxProgress.getLinearProgressValue = getLinearProgressValue;
        lxProgress.getProgressDiameter = getProgressDiameter;

        init();

        ////////////

        function getCircularProgressValue()
        {
            if (angular.isDefined(lxProgress.lxValue))
            {
                return {
                    'stroke-dasharray': lxProgress.lxValue * 1.26 + ',200'
                };
            }
        }

        function getLinearProgressValue()
        {
            if (angular.isDefined(lxProgress.lxValue))
            {
                return {
                    'transform': 'scale(' + lxProgress.lxValue / 100 + ', 1)'
                };
            }
        }

        function getProgressDiameter()
        {
            if (lxProgress.lxType === 'circular')
            {
                return {
                    'transform': 'scale(' + parseInt(lxProgress.lxDiameter) / 100 + ')'
                };
            }

            return;
        }

        function init()
        {
            lxProgress.lxDiameter = angular.isDefined(lxProgress.lxDiameter) ? lxProgress.lxDiameter : 100;
            lxProgress.lxColor = angular.isDefined(lxProgress.lxColor) ? lxProgress.lxColor : 'primary';
        }
    }
})();