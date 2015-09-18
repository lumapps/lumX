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
            controllerAs: 'vm',
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
        }
    }

    function LxFabController()
    {
        var vm = this;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        vm.setFabDirection = setFabDirection;

        //
        // PUBLIC METHODS
        //

        function setFabDirection(direction)
        {
            vm.lxDirection = direction;
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
