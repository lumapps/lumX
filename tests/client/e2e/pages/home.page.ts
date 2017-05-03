import { ElementArrayFinder, ElementFinder, by } from 'protractor';
import { By } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { APP_SELECTOR, NEW_TO_DO_SELECTOR, SELECTOR_PREFIX, SELECTOR_SEPARATOR, TO_DO_LIST_SELECTOR,
         TO_DO_SELECTOR } from '../../../../src/client/app/core/settings/selectors.settings';

import { UtilsService } from '../../../../src/client/app/core/services/utils.service';


/**
 * Home Page.
 * Home page descriptor to separate selectors from specs.
 */
export class HomePage {
    /* tslint:disable:completed-docs */
    /**
     * References all accessors needed for this page.
     *
     * @type {By}
     * @private
     */
    private _toDoItemDoneDateAccessor: By;
    private _toDoItemLabelAccessor: By;

    /**
     * References all classes needed for this page.
     *
     * @type {string}
     * @protected
     * @readonly
     * @constant
     * @default
     */
    protected addNewItemButtonClass: string = 'add-item__btn';
    protected newItemInputClass: string = 'new-item__input';
    protected toDoItemDoneDateClass: string = 'to-do__item-done-date';
    protected toDoItemLabelClass: string = 'to-do__item-label';
    protected toDoListClass: string = 'to-do__list';


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
    public section: ElementFinder;
    public title: ElementFinder;
    public toDo: ElementFinder;

    /**
     * References the class for an done To-Do Item.
     *
     * @type {string}
     * @public
     * @readonly
     * @constant
     * @default
     */
    public toDoItemDoneClass: string = 'to-do__item-label--is-done';

    /**
     * References all elements needed for this page.
     *
     * @type {ElementFinder|ElementArrayFinder}
     * @public
     */
    public toDoList: ElementFinder;
    public toDoListContainer: ElementFinder;
    public toDoListElements: ElementArrayFinder;
    /* tslint:enable:completed-docs */


    /**
     * Construct a new home page descriptor.
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page.
     */
    constructor(public userBrowser: UserBrowser) {
        this._toDoItemDoneDateAccessor = by.css(`.${this.toDoItemDoneDateClass}`);
        this._toDoItemLabelAccessor = by.css(`.${this.toDoItemLabelClass}`);

        this.app = this.userBrowser.element(by.tagName(SELECTOR_PREFIX + SELECTOR_SEPARATOR + APP_SELECTOR));
        this.toDo = this.app.element(by.tagName(SELECTOR_PREFIX + SELECTOR_SEPARATOR + TO_DO_SELECTOR));
        this.header = this.toDo.element(by.tagName('header'));
        this.title = this.header.element(by.tagName('h1'));
        this.section = this.toDo.element(by.tagName('section'));

        this.newToDo = this.section.element(by.tagName(SELECTOR_PREFIX + SELECTOR_SEPARATOR + NEW_TO_DO_SELECTOR));
        this.addNewItemButton = this.newToDo.element(by.css(`.${this.addNewItemButtonClass}`));
        this.newItemInput = this.newToDo.element(by.css(`.${this.newItemInputClass}`));
        this.newToDoDiv = this.newToDo.element(by.tagName('div'));

        this.toDoList = this.section.element(by.tagName(SELECTOR_PREFIX + SELECTOR_SEPARATOR + TO_DO_LIST_SELECTOR));
        this.toDoListContainer = this.toDoList.element(by.css(`.${this.toDoListClass}`));
        this.toDoListElements = this.toDoListContainer.all(by.tagName('li'));
    }


    /**
     * Add a new to-do item to the to-do list.
     *
     * @param {string} label The label of the new to-do item to add
     * @public
     */
    public addToDoItem(label: string): void {
        this.newItemInput.sendKeys(label);
        this.addNewItemButton.click();
    }

    /**
     * Get the element corresponding to the to-do item done date.
     *
     * @param  {ElementFinder} item The item in wich retrieve the done date.
     * @return {ElementFinder}      The done date of the to-do item (if any).
     * @public
     */
    public getDoneDate(item: ElementFinder): ElementFinder {
        return item.element(this._toDoItemDoneDateAccessor);
    }

    /**
     * Get the element corresponding to the to-do item label.
     *
     * @param  {ElementFinder} item The item in wich retrieve the label.
     * @return {ElementFinder}      The label of the to-do item.
     * @public
     */
    public getLabel(item: ElementFinder): ElementFinder {
        return item.element(this._toDoItemLabelAccessor);
    }

    /**
     * Get the element corresponding to the last to-do item of the to-do list.
     *
     * @return {ElementFinder} The last to-do item of the to-do list (if any).
     * @public
     */
    public getLastItem(): ElementFinder {
        return (UtilsService.isDefinedAndFilled(this.toDoListElements)) ? this.toDoListElements.last() : undefined;
    }

    /**
     * Toggle a to-do item state.
     *
     * @param  {ElementFinder} item The item to toggle
     * @public
     */
    public toggleItem(item: ElementFinder): void {
        item.click();
    }
}
