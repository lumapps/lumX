(function() {
    'use strict';

    angular
        .module('lumx.progress')
        .service('LxProgressService', LxProgressService);

    LxProgressService.$inject = ['$compile', '$rootScope', '$timeout'];

    function LxProgressService($compile, $rootScope, $timeout)
    {
        var service = {
            circular: {
                show: showProgressCircular,
                hide: hideProgressCircular
            },
            linear: {
                show: showProgressLinear,
                hide: hideProgressLinear
            }
        };

        var _progressCircular;
        var _progressCircularIsShown = false;
        var _progressLinear;
        var _progressLinearIsShown = false;

        return service;

        //
        // PUBLIC METHODS
        //

        /**
         * Hide circular progress
         */
        function hideProgressCircular()
        {
            if (_progressCircularIsShown)
            {
                _progressCircularIsShown = false;
                _progressCircular.remove();
            }
        }

        /**
         * Hide linear progress
         */
        function hideProgressLinear()
        {
            if (_progressLinearIsShown)
            {
                _progressLinearIsShown = false;
                _progressLinear.remove();
            }
        }

        /**
         * Show circular progress
         */
        function showProgressCircular(color, container)
        {
            if (!_progressCircularIsShown)
            {
                var progressCircularColor = angular.isDefined(color) ? color : 'primary';
                var progressCircularContainer = angular.isDefined(container) ? container : 'body';

                _progressCircular = $compile('<lx-progress lx-type="circular" lx-color="' + progressCircularColor + '"></lx-progress>')($rootScope);

                $timeout(function()
                {
                    angular.element(progressCircularContainer).append(_progressCircular[0]);

                    _progressCircularIsShown = true;
                });
            }
        }

        /**
         * Show linear progress
         */
        function showProgressLinear(color, container)
        {
            if (!_progressLinearIsShown)
            {
                var progressLinearColor = angular.isDefined(color) ? color : 'primary';
                var progressLinearContainer = angular.isDefined(container) ? container : 'body';

                _progressLinear = $compile('<lx-progress lx-type="linear" lx-color="' + progressLinearColor + '"></lx-progress>')($rootScope);

                $timeout(function()
                {
                    angular.element(progressLinearContainer).append(_progressLinear[0]);

                    _progressLinearIsShown = true;
                });
            }
        }
    }
})();
