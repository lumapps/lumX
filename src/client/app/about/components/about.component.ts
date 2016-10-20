import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ABOUT_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


console.log('`About` component has been loaded!');

/*
 * Component template
 */
 const template: string = require('./' + SELECTOR + '.component.html');


 @Component({
     selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
     styles: [
         require('./' + SELECTOR + '.component.scss'),
     ],
     template: template,
 })
/**
 * About Component.
 *
 * Display some info.
 */
export class AboutComponent implements OnInit {
    /**
     * The data of the route
     *
     * @type {string}
     * @public
     */
    public data: string;

    /**
     * The activated route.
     *
     * @type {ActivatedRoute}
     * @public
     */
    public route: ActivatedRoute;

    /**
     * Construct a new About component.
     *
     * @constructs AboutComponent
     *
     * @param {ActivatedRoute} route The activated route.
     */
    constructor(route: ActivatedRoute) {
        this.route = route;
    }


    /**
     * Called when the component is beeing initialized.
     */
    ngOnInit(): void {
        this.route.data.subscribe((data: { text: string }) => {
            // Your resolved data from route
            this.data = data.text;
            console.log('`About` component received: ', data);
        });

        console.log('`About` component initialization');
    }
}
