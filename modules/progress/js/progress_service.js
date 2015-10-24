(function()
{
    'use strict';

    angular
        .module('lumx.progress')
        .service('LxProgressService', LxProgressService);

    LxProgressService.$inject = ['$compile', '$rootScope', '$timeout'];

    function LxProgressService($compile, $rootScope, $timeout)
    {
        var service = this;
        var progressCircular;
        var progressCircularIsShown = false;
        var progressLinear;
        var progressLinearIsShown = false;

        service.circular = {
            show: showProgressCircular,
            hide: hideProgressCircular
        };

        service.linear = {
            show: showProgressLinear,
            hide: hideProgressLinear
        };

        ////////////

        function hideProgressCircular()
        {
            if (progressCircularIsShown)
            {
                progressCircularIsShown = false;
                progressCircular.remove();
            }
        }

        function hideProgressLinear()
        {
            if (progressLinearIsShown)
            {
                progressLinearIsShown = false;
                progressLinear.remove();
            }
        }

        function showProgressCircular(_color, _container)
        {
            if (!progressCircularIsShown)
            {
                var progressCircularColor = angular.isDefined(_color) ? _color : 'primary';
                var progressCircularContainer = angular.isDefined(_container) ? _container : 'body';

                progressCircular = $compile('<lx-progress lx-type="circular" lx-color="' + progressCircularColor + '"></lx-progress>')($rootScope);

                $timeout(function()
                {
                    angular.element(progressCircularContainer).append(progressCircular[0]);

                    progressCircularIsShown = true;
                });
            }
        }

        function showProgressLinear(_color, _container)
        {
            if (!progressLinearIsShown)
            {
                var progressLinearColor = angular.isDefined(_color) ? _color : 'primary';
                var progressLinearContainer = angular.isDefined(_container) ? _container : 'body';

                progressLinear = $compile('<lx-progress lx-type="linear" lx-color="' + progressLinearColor + '"></lx-progress>')($rootScope);

                $timeout(function()
                {
                    angular.element(progressLinearContainer).append(progressLinear[0]);

                    progressLinearIsShown = true;
                });
            }
        }
    }
})();