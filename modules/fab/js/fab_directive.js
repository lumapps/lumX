(function()
{
    'use strict';

    angular
        .module('lumx.fab')
        .directive('lxFab', lxFab)
        .directive('lxFabTrigger', lxFabTrigger)
        .directive('lxFabActions', lxFabActions);

    function lxFab()
    {
        return {
            restrict: 'E',
            templateUrl: 'fab.html',
            scope: true,
            link: link,
            controller: LxFabController,
            controllerAs: 'lxFab',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('lxDirection', function(newDirection)
            {
                ctrl.setFabDirection(newDirection);
            });

            attrs.$observe('lxTriggerOnClick', function(isTriggeredOnClick)
            {
                ctrl.setFabTriggerMethod(scope.$eval(isTriggeredOnClick));
            });
        }
    }

    function LxFabController()
    {
        var lxFab = this;

        lxFab.setFabDirection = setFabDirection;
        lxFab.setFabTriggerMethod = setFabTriggerMethod;
        lxFab.toggleState = toggleState;

        lxFab.isOpen = false;

        ////////////

        function setFabDirection(_direction)
        {
            lxFab.lxDirection = _direction;
        }

        function setFabTriggerMethod(_isTriggeredOnClick)
        {
            lxFab.lxTriggerOnClick = _isTriggeredOnClick;
        }

        function toggleState()
        {
            if (lxFab.lxTriggerOnClick)
            {
                lxFab.isOpen = !lxFab.isOpen;
            }
        }
    }

    function lxFabTrigger()
    {
        return {
            restrict: 'E',
            require: '^lxFab',
            templateUrl: 'fab-trigger.html',
            transclude: true,
            replace: true
        };
    }

    function lxFabActions()
    {
        return {
            restrict: 'E',
            require: '^lxFab',
            templateUrl: 'fab-actions.html',
            link: link,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.parentCtrl = ctrl;
        }
    }
})();
