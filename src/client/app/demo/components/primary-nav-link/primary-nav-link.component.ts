import { Component, Input } from '@angular/core';

import { ILink } from 'demo/types/link.type';

import { PRIMARY_NAV_LINK_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component template
 */
const template: string = require(`./${SELECTOR}.component.html`);


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styles: [
        require(`./${SELECTOR}.component.scss`),
    ],
    template: template,
})
/**
 * Primary Navigation Link Component.
 */
export class PrimaryNavLinkComponent {
    @Input('lx-context') context: string;
    @Input('lx-link') link: ILink;

    private displaySubNav: boolean = false;

// $scope.$on('$stateChangeSuccess', function(_event, _toState)
// {
//     lxMainNavLink.displaySubNav = _toState.name.indexOf(lxMainNavLink.state) > -1;
// });


    public toggleSubNav(_event: Event): void {
        if (this.context === 'mobile-nav') {
            _event.preventDefault();
            _event.stopPropagation();

            this.displaySubNav = !this.displaySubNav;
        }
    }
}



//     function lxMainNavLink()
//     {
//         return {
//             restrict: 'E',
//             templateUrl: '/js/demo/main-nav/views/main-nav-link.html',
//             scope:
//             {
//                 state: '@lxState',
//                 subNav: '@lxSubNav'
//             },
//         };
//     }
