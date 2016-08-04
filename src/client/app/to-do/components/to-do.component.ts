import { Component } from '@angular/core';

import { SELECTOR_PREFIX } from 'core/settings/common.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


export const SELECTOR: string = 'to-do';


/**
 * To-do list Component
 * Display the list of to-dos
 */
@Component({
    selector: SELECTOR_PREFIX + '-' + SELECTOR,
    styles: [
        require('./' + SELECTOR + '.component.scss'),
    ],
    template: require('./' + SELECTOR + '.component.html'),
})
export class ToDoComponent {
    /**
     * Construct a new ToDo component
     *
     * @param {ToDoStore} toDoStore The store that stores all of our to-do items
     */
    constructor(toDoStore: ToDoStore) {
        toDoStore = toDoStore;

        toDoStore.add(new ToDoItem('Install Boilerplate', new Date()));
        toDoStore.add(new ToDoItem('Run a play with default Boilerplate', new Date()));
        toDoStore.add(new ToDoItem('Run Unit and E2E test on Boilerplate'));
    }
}
