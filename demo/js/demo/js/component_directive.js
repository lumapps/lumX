(function()
{
    'use strict';

    angular
        .module('Directives')
        .directive('lxComponent', lxComponent)
        .directive('lxComponentAttributes', lxComponentAttributes);

    function lxComponent()
    {
        return {
            restrict: 'E',
            templateUrl: '/js/demo/views/component.html',
            scope: true,
            link: link,
            controller: LxComponentController,
            controllerAs: 'lxComponent',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            attrs.$observe('lxJsPath', function(newJsPath)
            {
                scope.lxComponent.jsPath = newJsPath;
            });

            attrs.$observe('lxPath', function(newPath)
            {
                scope.lxComponent.path = newPath;
            });

            attrs.$observe('lxTitle', function(newTitle)
            {
                scope.lxComponent.title = newTitle;
            });
        }
    }

    LxComponentController.$inject = ['$transclude'];

    function LxComponentController($transclude)
    {
        var lxComponent = this;

        lxComponent.toggle = toggle;

        lxComponent.isOpen = false;

        $transclude(function(clone)
        {
            if (clone.length)
            {
                lxComponent.hasTranscluded = true;
            }
        });

        ////////////

        function toggle()
        {
            lxComponent.isOpen = !lxComponent.isOpen;
        }
    }

    function lxComponentAttributes()
    {
        return {
            restrict: 'E',
            templateUrl: '/js/demo/views/component-attributes.html',
            transclude: true
        };
    }
})();