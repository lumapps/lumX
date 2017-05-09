import { Component, OnInit } from '@angular/core';

import { TO_DO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


/**
 * To-do list Component.
 * Display the list of to-dos.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./to-do.component.scss'],
    templateUrl: './to-do.component.html',
})
export class ToDoComponent implements OnInit {
    /**
     * Construct a new ToDo component.
     *
     * @param {ToDoStore} _ToDoStore The store that stores all of our to-do items.
     */
    constructor(private _ToDoStore: ToDoStore) {}

    /**
     * Initialize the ToDo component.
     *
     * @public
     */
    public ngOnInit(): void {
        if (this._ToDoStore.isEmpty()) {
            this._ToDoStore.add(new ToDoItem('Install Boilerplate', new Date()));
            this._ToDoStore.add(new ToDoItem('Run a play with default Boilerplate', new Date()));
            this._ToDoStore.add(new ToDoItem('Run Unit and E2E test on Boilerplate'));
        }
    }
}
