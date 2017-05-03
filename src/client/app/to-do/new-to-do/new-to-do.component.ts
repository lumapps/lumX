import { Component } from '@angular/core';

import { NEW_TO_DO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


/**
 * New To-do Component.
 * Allow to add a new to-do item.
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['new-to-do.component.scss'],
    templateUrl: './new-to-do.component.html',
})
export class NewToDoComponent {
    /**
     * The label of the new to-do item to add.
     *
     * @type {string}
     * @default
     * @public
     */
    public newItem: string = '';


    /**
     * Construct a new NewToDo component.
     *
     * @param {ToDoStore} _ToDoStore The store that stores all of our to-do items.
     */
    constructor(private _ToDoStore: ToDoStore) {}


    /**
     * Add a new to-do item in the store and empty the new to-do item input.
     *
     * @return {number} The id of the newly added item.
     * @public
     */
    public addItem(): number {
        const newItemId: number = this._ToDoStore.add(new ToDoItem(this.newItem));

        this.newItem = '';

        return newItemId;
    }
}
