import { Component } from '@angular/core';

import { SELECTOR_PREFIX } from 'core/settings/common.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


export const SELECTOR: string = 'new-to-do';


/**
 * New To-do Component
 * Allow to add a new to-do item
 */
@Component({
    selector: SELECTOR_PREFIX + '-' + SELECTOR,
    styles: [
        require('./' + SELECTOR + '.component.scss'),
    ],
    template: require('./' + SELECTOR + '.component.html'),
})
export class NewToDoComponent {
    /**
     * The label of the new to-do item to add
     *
     * @type       {string}
     * @visibility public
     */
    public newItem: string = '';


    /**
     * Construct a new NewToDo component
     *
     * @param {ToDoStore} toDoStore The store that stores all of our to-do items
     */
    constructor(public toDoStore: ToDoStore) {}


    /**
     * Add a new to-do item in the store
     * And empty the new to-do item input
     *
     * @return {number} The id of the newly added item
     */
    addItem(): number {
        let newItemId: number = this.toDoStore.add(new ToDoItem(this.newItem));
        this.newItem = '';

        return newItemId;
    }
}
