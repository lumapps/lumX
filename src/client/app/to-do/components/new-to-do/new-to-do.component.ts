import { Component } from '@angular/core';

import { NEW_TO_DO_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

import { ToDoItem } from 'to-do/to-do-item.model';
import { ToDoStore } from 'to-do/to-do.store';


/*
 * Component styles
 */
import './new-to-do.component.scss';

/*
 * Component template
 */
const template: string = require('./' + SELECTOR + '.component.html');


@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    template: template,
})
/**
 * New To-do Component.

 * Allow to add a new to-do item.
 */
export class NewToDoComponent {
    /**
     * The label of the new to-do item to add.
     *
     * @type {string}
     * @public
     */
    public newItem: string = '';


    /**
     * Construct a new NewToDo component.
     *
     * @constructs NewToDoComponent
     *
     * @param {ToDoStore} _ToDoStore The store that stores all of our to-do items.
     */
    constructor(private _ToDoStore: ToDoStore) {}


    /**
     * Add a new to-do item in the store and empty the new to-do item input.
     *
     * @return {number} The id of the newly added item.
     */
    addItem(): number {
        let newItemId: number = this._ToDoStore.add(new ToDoItem(this.newItem));
        this.newItem = '';

        return newItemId;
    }
}
