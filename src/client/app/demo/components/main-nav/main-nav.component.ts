import { AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer } from '@angular/core';

import { MobileNavService } from 'demo/services/mobile-nav.service';

import { MAIN_NAV_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Component styles
 */
import './main-nav.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * Main Navigation Component.
 */
export class MainNavigationComponent implements AfterViewInit, OnDestroy {
    @Input('lx-context') context: string = 'header';

    private onMainNavClick: Function;


    constructor(private elementRef: ElementRef,
                private renderer: Renderer,
                private mobileNavService: MobileNavService) {
        /* Nothing here yet */
    }

    ngAfterViewInit(): void {
        // Listen events in the element and store it so we can destroy it later on
        this.onMainNavClick = this.renderer.listen(this.elementRef.nativeElement, 'click', () => {
            if (this.context === 'mobile-nav') {
                this.mobileNavService.closeMobileNav();
            }
        });
    }

    ngOnDestroy(): void {
        this.onMainNavClick();
    }
}
