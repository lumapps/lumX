import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ABOUT_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';


/**
 * About Component.
 * Display some info about the application.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./about.component.scss'],
    templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
    /**
     * The data of the route.
     *
     * @type {string}
     * @public
     */
    public data: string;

    /**
     * Create a new About component.
     *
     * @param {ActivatedRoute} route The activated route.
     */
    constructor(public route: ActivatedRoute) {}


    /**
     * Called when the component is beeing initialized.
     *
     * @public
     */
    public ngOnInit(): void {
        this.route.data.subscribe((data: { text: string }) => {
            // Your resolved data from route
            this.data = data.text;

            console.info('`About` component received: ', data);
        });

        console.info('`About` component initialization');
    }
}
