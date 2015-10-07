(function() {
    'use strict';

    angular
        .module('lumx.fab', [])
        .directive('lxFab', lxFab)
        .directive('lxFabTrigger', lxFabTrigger)
        .directive('lxFabActions', lxFabActions);

    function lxFab()
    {
        var directive =
        {
            restrict: 'E',
            templateUrl: 'fab.html',
            scope: true,
            link: link,
            controller: LxFabController,
            controllerAs: 'lxFab',
            bindToController: true,
            transclude: true
        };

        return directive;

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('lxDirection', function(newDirection)
            {
                ctrl.setFabDirection(newDirection);
            });

            scope.$watch(attrs.lxFabProgress, function(isLoading)
            {
                ctrl.setFabProgress(isLoading);
            });

            if (angular.isUndefined(attrs.lxFabProgressColor))
            {
                ctrl.setFabProgressColor('primary');
            }

            attrs.$observe('lxFabProgressColor', function(newColor)
            {
                ctrl.setFabProgressColor(newColor);
            });
        }
    }

    function LxFabController()
    {
        var lxFab = this;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        lxFab.setFabDirection = setFabDirection;
        lxFab.setFabProgress = setFabProgress;
        lxFab.setFabProgressColor = setFabProgressColor;

        //
        // PUBLIC METHODS
        //

        function setFabDirection(direction)
        {
            lxFab.lxDirection = direction;
        }

        function setFabProgress(isLoading)
        {
            lxFab.lxFabProgress = isLoading;
        }

        function setFabProgressColor(color)
        {
            lxFab.lxFabProgressColor = color;
        }
    }

    function lxFabTrigger()
    {
        var directive =
        {
            restrict: 'E',
            require: '^lxFab',
            templateUrl: 'fab-trigger.html',
            transclude: true,
            replace: true
        };

        return directive;
    }

    function lxFabActions()
    {
        var directive =
        {
            restrict: 'E',
            require: '^lxFab',
            templateUrl: 'fab-actions.html',
            link: link,
            transclude: true,
            replace: true
        };

        return directive;

        function link(scope, element, attrs, ctrl)
        {
            scope.parentCtrl = ctrl;
        }
    }
})();
