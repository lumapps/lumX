(function()
{
    'use strict';

    angular
        .module('Directives')
        .directive('lxMainNav', lxMainNav);

    function lxMainNav()
    {
        return {
            restrict: 'E',
            templateUrl: '/js/demo/main-nav/views/main-nav.html',
            scope:
            {
                context: '@lxContext'
            },
            controller: LxMainNavController,
            controllerAs: 'lxMainNav',
            bindToController: true
        };
    }

    LxMainNavController.$inject = ['$element', 'LayoutService'];

    function LxMainNavController($element, LayoutService)
    {
        var lxMainNav = this;

        if (lxMainNav.context === 'palm-nav')
        {
            $element.bind('click', function()
            {
                LayoutService.closePalmNav();
            });
        }
    }
})();