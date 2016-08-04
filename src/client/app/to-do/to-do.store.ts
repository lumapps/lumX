import { ToDoItem } from 'to-do/to-do-item.model.ts';

/**
 * Stores the to-do items of our list
 */
export class ToDoStore {
    /**
     * The list of to-do items
     *
     * @type {ToDoItem[]}
     * @visibility public
     */
    public items: ToDoItem[];

    /**
     * The id of the next to-do item
     *
     * @type {number}
     * @visibility private
     */
    private nextId: number = 0;


    /**
     * Construct a new to-do items store
     * Initialize the items array and set the next id to 0
     */
    constructor() {
        this.reset();
    }


    /**
     * Add a new to-do item in the store
     *
     * @param  {ToDoItem} newItem The new item to add
     * @return {number}           The id of the newly added to-do item
     */
    add(newItem: ToDoItem): number {
        newItem.id = this.nextId++;
        this.items.push(newItem);

        return newItem.id;
    }

    /**
     * Remove a to-do item from the store
     *
     * @param  {number}   id The id of the to-do item to remove
     * @return {ToDoItem}    The removed to-do item
     */
    remove(id: number): ToDoItem {
        let splice: ToDoItem[] = [];
        if (id >= 0 && id < this.items.length) {
            splice = this.items.splice(id, 1);
        }

        return (splice[0] !== undefined) ? splice[0] : undefined;
    }

    /**
     * Reset the store
     * Empty the to-do items and reset the next id to 0
     */
    reset(): void {
        this.items = [];
        this.nextId = this.items.length;
    }
}
