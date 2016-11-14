import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { DEMO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/*
 * Global styles
 */
import 'core/styles/_lumx2.scss';


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
 * Demo Component.
 * Top Level Component.
 */
export class DemoComponent implements AfterViewInit, OnInit {
    /**
     * A reference to the <body> element
     *
     * @type {Element}
     * @private
     */
    private bodyElement: Element;

    /**
     * Creates an instance of DemoComponent.
     *
     * @param {ElementRef} elementRef A reference to the current component element
     * @param {Router}     router     The application router
     *
     */
    constructor(private elementRef: ElementRef, private router: Router) {}

    ngOnInit(): void {
        // Listen to page navigation and update the <body> element accordingly
        this.router.events
            .filter((evt: Event) => evt instanceof NavigationEnd)
            .subscribe((evt: NavigationEnd) => {
                this.bodyElement.classList.toggle('home', evt.urlAfterRedirects === '/');
            });
    }

    ngAfterViewInit(): void {
        this.bodyElement = this.elementRef.nativeElement.parentNode;
    }
}
