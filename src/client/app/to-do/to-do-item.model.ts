import { UtilsService } from 'core/services/utils.service';


/**
 * Describes a to-do item.
 *
 * @interface
 */
export interface IToDoItem {
    done?: Date;
    due?: Date;
    id?: number;
    label: string;
}


/**
 * To-Do Item.
 * Implements a to-do item.
 */
export class ToDoItem implements IToDoItem {
    /**
     * The date the to-do item has been done.
     *
     * @type {Date}
     * @public
     */
    public done: Date;

    /**
     * The due date of the to-do item.
     *
     * @type {Date}
     * @public
     */
    public due: Date;

    /**
     * The unique identifier of the to-do item.
     *
     * @type {number}
     * @public
     */
    public id: number;

    /**
     * The label (or name) of the to-do item.
     *
     * @type {string}
     * @public
     */
    public label: string;


    /**
     * Construct a new to-do item.
     *
     * @param {string} label   The label of the to-do item.
     * @param {Date}   [done]  The date the to-do item has been done.
     * @param {Date}   [due]   The limit date the to-do item has to be done.
     */
    constructor(label: string, done?: Date, due?: Date) {
        this.label = label;
        this.done = done;
        this.due = due;

        this.id = undefined;
    }


    /**
     * Mark the to-do item as done.
     *
     * @return {Date} The date the to-do item has been done.
     * @public
     */
    public do(): Date {
        if (UtilsService.isUndefinedOrEmpty(this.done)) {
            this.done = new Date();
        }

        return this.done;
    }

    /**
     * Toggle the do-to item between the done and not done state.
     *
     * @return {Date} The date the to-do item was done (if toggling to not done) or the date the to-do item has been
     *                done (if toggling to done).
     * @public
     */
    public toggle(): Date {
        if (UtilsService.isDefinedAndFilled(this.done)) {
            return this.unDo();
        } else {
            return this.do();
        }
    }

    /**
     * Display a string representation of the to-do item.
     *
     * @return {string} The string representation of the to-do item.
     * @public
     */
    public toString(): string {
        let stringRep: string = `[${this.id}] - ${this.label}`;

        if (UtilsService.isDefinedAndFilled(this.due)) {
            stringRep = `${stringRep} (due ${this.due})`;
        }
        if (UtilsService.isDefinedAndFilled(this.done)) {
            stringRep = `${stringRep} - done (${this.done})`;
        }

        return stringRep;
    }

    /**
     * Mark the to-do item as not done.
     *
     * @return {Date} The date the to-do item was done.
     * @public
     */
    public unDo(): Date {
        const wasDone: Date = this.done;

        this.done = undefined;

        return wasDone;
    }
}
