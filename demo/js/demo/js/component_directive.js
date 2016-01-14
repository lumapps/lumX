(function()
{
    'use strict';

    angular
        .module('Directives', [])
        .directive('lxComponent', lxComponent)
        .directive('lxComponentAttributes', lxComponentAttributes);

    function lxComponent()
    {
        return {
            restrict: 'E',
            templateUrl: '/js/demo/views/component.html',
            scope:
            {
                title: '@lxTitle',
                path: '@lxPath',
                toolbar: '=?lxToolbar'
            },
            controller: LxComponentController,
            controllerAs: 'lxComponent',
            bindToController: true,
            transclude: true
        };
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