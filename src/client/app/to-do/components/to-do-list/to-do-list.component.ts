import { Component } from '@angular/core';

import { TO_DO_LIST_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoStore } from 'to-do/to-do.store';


/*
 * Component styles
 */
import './to-do-list.component.scss';


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: require('./' + SELECTOR + '.component.html'),
})
/**
 * To-do list Component.
 *
 * Display the list of to-do items.
 */
export class ToDoListComponent {
    /**
     * Construct a new ToDoList component.
     *
     * @constructs ToDoListComponent
     *
     * @param {ToDoStore} _ToDoStore The store that stores all of our to-do items.
     */
    constructor(private _ToDoStore: ToDoStore) {}
}
