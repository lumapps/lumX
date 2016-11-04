import { Component } from '@angular/core';

import { MAIN_NAV_LINK_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './main-nav-link.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Main Navigation Link Component.
 */
export class MainNavigationLinkComponent {
    // @Input('lxContext') context:
}


// (function()
// {
//     'use strict';

//     angular
//         .module('Directives')
//         .directive('lxMainNavLink', lxMainNavLink);

//     function lxMainNavLink()
//     {
//         return {
//             restrict: 'E',
//             templateUrl: '/js/demo/main-nav/views/main-nav-link.html',
//             scope:
//             {
//                 context: '@lxContext',
//                 label: '@lxLabel',
//                 state: '@lxState',
//                 subNav: '@lxSubNav'
//             },
//             controller: LxMainNavLinkController,
//             controllerAs: 'lxMainNavLink',
//             bindToController: true
//         };
//     }

//     LxMainNavLinkController.$inject = ['$scope', '$state'];

//     function LxMainNavLinkController($scope, $state)
//     {
//         var lxMainNavLink = this;

//         lxMainNavLink.toggleSubNav = toggleSubNav;

//         $scope.$on('$stateChangeSuccess', function(_event, _toState)
//         {
//             lxMainNavLink.displaySubNav = _toState.name.indexOf(lxMainNavLink.state) > -1;
//         });

//         ////////////

//         function toggleSubNav(_event)
//         {
//             if (lxMainNavLink.context === 'mobile-nav')
//             {
//                 _event.preventDefault();
//                 _event.stopPropagation();

//                 lxMainNavLink.displaySubNav = !lxMainNavLink.displaySubNav;
//             }
//         }
//     }
// })();
