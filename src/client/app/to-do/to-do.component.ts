import { Component } from '@angular/core';

import { TO_DO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


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
 * To-do list Component.

 * Display the list of to-dos.
 */
export class ToDoComponent {
    /**
     * Construct a new ToDo component.
     *
     * @constructs ToDoComponent
     *
     * @param {ToDoStore} _ToDoStore The store that stores all of our to-do items.
     */
    constructor(private _ToDoStore: ToDoStore) {
        _ToDoStore.add(new ToDoItem('Install Boilerplate', new Date()));
        _ToDoStore.add(new ToDoItem('Run a play with default Boilerplate', new Date()));
        _ToDoStore.add(new ToDoItem('Run Unit and E2E test on Boilerplate'));
    }
}
