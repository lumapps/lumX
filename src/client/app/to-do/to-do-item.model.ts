/**
 * Represents a to-do item
 */
export interface ToDoItemInterface {
    done?: Date;
    due?: Date;
    id?: number;
    label: string;
};

/**
 * Implements a to-do item
 */
export class ToDoItem implements ToDoItemInterface {
    /**
     * The date the to-do item has been done
     *
     * @type       {Date}
     * @visibility public
     */
    public done: Date;
    /**
     * The due date of the to-do item
     *
     * @type       {Date}
     * @visibility public
     */
    public due: Date;
    /**
     * The unique identifier of the to-do item
     *
     * @type       {number}
     * @visibility public
     */
    public id: number;
    /**
     * The label (or name) of the to-do item
     *
     * @type       {string}
     * @visibility public
     */
    public label: string;


    /**
     * Construct a new to-do item
     *
     * @param {string} label The label of the to-do item
     * @param {Date}   done  The date the to-do item has been done
     * @param {Date}   due   The limit date the to-do item has to be done
     */
    constructor(label: string, done?: Date, due?: Date) {
        this.label = label;
        this.done = done;
        this.due = due;
    }


    /**
     * Mark the to-do item as done
     *
     * @return {Date} The date the to-do item has been done
     */
    do(): Date {
        this.done = new Date();

        return this.done;
    }

    /**
     * Toggle the do-to item between the done and not done state
     *
     * @return {Date} The date the to-do item was done (if toggling to not done) or the date the to-do item has been
     *                done (if toggling to done)
     */
    toggle(): Date {
        if (this.done) {
            return this.unDo();
        } else {
            return this.do();
        }
    }

    /**
     * Display a string representation of the to-do item
     *
     * @return {string} The string representation of the to-do item
     */
    toString(): string {
        let stringRep: string = `[${this.id}] - ${this.label}`;

        if (this.due) {
            stringRep = `${stringRep} (due ${this.due})`;
        }
        if (this.done) {
            stringRep = `${stringRep} - done (${this.done})`;
        }

        return stringRep;
    }

    /**
     * Mark the to-do item as not done
     *
     * @return {Date} The date the to-do item was done
     */
    unDo(): Date {
        let wasDone: Date = this.done;

        this.done = undefined;

        return wasDone;
    }
}
