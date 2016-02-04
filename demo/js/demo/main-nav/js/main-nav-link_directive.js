(function()
{
    'use strict';

    angular
        .module('Directives')
        .directive('lxMainNavLink', lxMainNavLink);

    function lxMainNavLink()
    {
        return {
            restrict: 'E',
            templateUrl: '/js/demo/main-nav/views/main-nav-link.html',
            scope:
            {
                context: '@lxContext',
                label: '@lxLabel',
                state: '@lxState',
                subNav: '@lxSubNav'
            },
            controller: LxMainNavLinkController,
            controllerAs: 'lxMainNavLink',
            bindToController: true
        };
    }

    LxMainNavLinkController.$inject = ['$scope', '$state'];

    function LxMainNavLinkController($scope, $state)
    {
        var lxMainNavLink = this;

        lxMainNavLink.toggleSubNav = toggleSubNav;

        $scope.$on('$stateChangeSuccess', function(_event, _toState)
        {
            lxMainNavLink.displaySubNav = _toState.name.indexOf(lxMainNavLink.state) > -1;
        });

        ////////////

        function toggleSubNav(_event)
        {
            if (lxMainNavLink.context === 'palm-nav')
            {
                _event.preventDefault();
                _event.stopPropagation();

                lxMainNavLink.displaySubNav = !lxMainNavLink.displaySubNav;
            }
        }
    }
})();