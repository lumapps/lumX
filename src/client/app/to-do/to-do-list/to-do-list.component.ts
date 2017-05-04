import { Component } from '@angular/core';

import { TO_DO_LIST_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoStore } from 'to-do/to-do.store';


/**
 * To-do list Component.
 * Display the list of to-do items.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./to-do-list.component.scss'],
    templateUrl: './to-do-list.component.html',
})
export class ToDoListComponent {
    /**
     * Construct a new ToDoList component.
     *
     * @param {ToDoStore} ToDoStore The store that stores all of our to-do items.
     */
    constructor(public ToDoStore: ToDoStore) {}
}
