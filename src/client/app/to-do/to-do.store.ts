import * as _ from 'lodash';

import { ToDoItem } from './to-do-item.model';


/**
 * To-do Store
 * Stores the to-do items of our list.
 */
export class ToDoStore {
    /**
     * The id of the next to-do item.
     *
     * @type {number}
     * @default
     * @private
     */
    private _nextId: number = 0;

    /**
     * The list of to-do items.
     *
     * @type {ToDoItem[]}
     * @public
     */
    public items: ToDoItem[];


    /**
     * Construct a new to-do items store.
     * Initialize the items array and set the next id to 0.
     */
    constructor() {
        this.reset();
    }


    /**
     * Add a new to-do item in the store.
     *
     * @param  {ToDoItem} newItem The new item to add.
     * @return {number}   The id of the newly added to-do item.
     * @public
     */
    public add(newItem: ToDoItem): number {
        newItem.id = this._nextId++;
        this.items.push(newItem);

        return newItem.id;
    }

    /**
     * Check if the list of to-do items is empty.
     *
     * @return {boolean} If the list of to-do items is empty or not.
     */
    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * Remove a to-do item from the store.
     *
     * @param  {number}   id The id of the to-do item to remove.
     * @return {ToDoItem} The removed to-do item.
     * @public
     */
    public remove(id: number): ToDoItem {
        let splice: ToDoItem[] = [];

        const index: number = _.findIndex(this.items, {
            id,
        });
        if (index > -1) {
            splice = this.items.splice(index, 1);
        }

        return _.get(splice, '[0]', undefined);
    }

    /**
     * Reset the store.
     * Empty the to-do items and reset the next id to 0.
     *
     * @public
     */
    public reset(): void {
        this.items = [];
        this._nextId = this.items.length;
    }
}
