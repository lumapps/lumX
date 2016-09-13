import { ElementArrayFinder, ElementFinder } from 'protractor';
import { Locator } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { APP_SELECTOR, NEW_TO_DO_SELECTOR, SELECTOR_PREFIX, TO_DO_LIST_SELECTOR, TO_DO_SELECTOR }
    from '../../../../src/client/app/core/settings/selectors.settings';


/**
 * Home page descriptor to separate selectors from specs.
 */
export class HomePage {
    /**
     * References all classes needed for this page.
     *
     * @type {string}
     * @public
     */
    public addNewItemButtonClass: string = '.add-item__btn';
    public newItemInputClass: string = '.new-item__input';
    public toDoItemDoneClass: string = 'to-do__item-label--is-done';
    public toDoItemDoneDateClass: string = 'to-do__item-done-date';
    public toDoItemLabelClass: string = 'to-do__item-label';
    public toDoListClass: string = '.to-do__list';

    /**
     * References all elements needed for this page.
     *
     * @type {ElementFinder|ElementArrayFinder}
     * @public
     */
    public addNewItemButton: ElementFinder;
    public app: ElementFinder;
    public header: ElementFinder;
    public newItemInput: ElementFinder;
    public newToDo: ElementFinder;
    public newToDoDiv: ElementFinder;
    public title: ElementFinder;
    public toDo: ElementFinder;
    public toDoList: ElementFinder;
    public toDoListContainer: ElementFinder;
    public toDoListElements: ElementArrayFinder;
    public section: ElementFinder;

    /**
     * References all accessors needed for this page.
     *
     * @type {Locator}
     * @private
     */
    private _toDoItemDoneDateAccessor: Locator;
    private _toDoItemLabelAccessor: Locator;


    /**
     * Construct a new home page descriptor.
     *
     * @constructs HomePage
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page.
     */
    constructor(public userBrowser: UserBrowser) {
        this._toDoItemDoneDateAccessor = by.css('.' + this.toDoItemDoneDateClass);
        this._toDoItemLabelAccessor = by.css('.' + this.toDoItemLabelClass);

        this.app = this.userBrowser.element(by.tagName(SELECTOR_PREFIX + '-' + APP_SELECTOR));
        this.toDo = this.app.element(by.tagName(SELECTOR_PREFIX + '-' + TO_DO_SELECTOR));
        this.header = this.toDo.element(by.tagName('header'));
        this.title = this.header.element(by.tagName('h1'));
        this.section = this.toDo.element(by.tagName('section'));

        this.newToDo = this.section.element(by.tagName(SELECTOR_PREFIX + '-' + NEW_TO_DO_SELECTOR));
        this.addNewItemButton = this.newToDo.element(by.css(this.addNewItemButtonClass));
        this.newItemInput = this.newToDo.element(by.css(this.newItemInputClass));
        this.newToDoDiv = this.newToDo.element(by.tagName('div'));

        this.toDoList = this.section.element(by.tagName(SELECTOR_PREFIX + '-' + TO_DO_LIST_SELECTOR));
        this.toDoListContainer = this.toDoList.element(by.css(this.toDoListClass));
        this.toDoListElements = this.toDoListContainer.all(by.tagName('li'));
    }


    /**
     * Add a new to-do item to the to-do list.
     *
     * @param {string} label The label of the new to-do item to add
     */
    addToDoItem(label: string): void {
        this.newItemInput.sendKeys(label);
        this.addNewItemButton.click();
    }

    /**
     * Get the element corresponding to the to-do item done date.
     *
     * @param  {ElementFinder} item The item in wich retrieve the done date.
     * @return {ElementFinder}      The done date of the to-do item (if any).
     */
    getDoneDate(item: ElementFinder): ElementFinder {
        return item.element(this._toDoItemDoneDateAccessor);
    }

    /**
     * Get the element corresponding to the to-do item label.
     *
     * @param  {ElementFinder} item The item in wich retrieve the label.
     * @return {ElementFinder}      The label of the to-do item.
     */
    getLabel(item: ElementFinder): ElementFinder {
        return item.element(this._toDoItemLabelAccessor);
    }

    /**
     * Get the element corresponding to the last to-do item of the to-do list.
     *
     * @return {ElementFinder} The last to-do item of the to-do list (if any).
     */
    getLastItem(): ElementFinder {
        return this.toDoListElements && this.toDoListElements.last();
    }

    /**
     * Toggle a to-do item state.
     *
     * @param  {ElementFinder} item The item to toggle
     */
    toggleItem(item: ElementFinder): void {
        item.click();
    }
}
