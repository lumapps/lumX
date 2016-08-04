import { Component } from '@angular/core';

import { SELECTOR_PREFIX } from 'core/settings/common.settings';

import { ToDoStore } from 'to-do/to-do.store';


export const SELECTOR: string = 'to-do-list';


/**
 * To-do list Component
 * Display the list of to-do items
 */
@Component({
    selector: SELECTOR_PREFIX + '-' + SELECTOR,
    styles: [
        require('./' + SELECTOR + '.component.scss'),
    ],
    template: require('./' + SELECTOR + '.component.html'),
})
export class ToDoListComponent {
    /**
     * Construct a new ToDoList component
     *
     * @param {ToDoStore} toDoStore The store that stores all of our to-do items
     */
    constructor(public toDoStore: ToDoStore) {}
}
