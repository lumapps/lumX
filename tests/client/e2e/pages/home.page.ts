import { ElementArrayFinder, ElementFinder } from 'protractor';
import { Locator } from 'selenium-webdriver';

import { UserBrowser } from '../helpers/user-browser.class';

import { SELECTOR_PREFIX } from 'src/client/app/core/settings/common.settings';

import { SELECTOR as APP_SELECTOR } from 'src/client/app/app.component';
import { SELECTOR as NEW_TO_DO_SELECTOR } from 'src/client/app/to-do/components/new-to-do/new-to-do.component';
import { SELECTOR as TO_TO_LIST_SELECTOR } from 'src/client/app/to-do/components/to-do-list/to-do-list.component';


/**
 * Home page descriptor to separate selectors from specs
 */
export class HomePage {
    /**
     * References all classes needed for this page
     *
     * @type       {string}
     * @visibility public
     */
    public toDoItemDoneClass: string;
    public toDoItemDoneDateClass: string;
    public toDoItemLabelClass: string;

    /**
     * References all elements needed for this page
     *
     * @type       {ElementFinder|ElementArrayFinder}
     * @visibility public
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
     * References all accessors needed for this page
     *
     * @type       {Locator}
     * @visibility private
     */
    private toDoItemDoneDateAccessor: Locator;
    private toDoItemLabelAccessor: Locator;


    /**
     * Construct a new home page descriptor
     *
     * @param {UserBrowser} userBrowser The user helper object that will interact with the page
     */
    constructor(public userBrowser: UserBrowser) {
        this.toDoItemDoneClass = 'to-do__item-label--is-done';
        this.toDoItemDoneDateClass = 'to-do__item-done-date';
        this.toDoItemLabelClass = 'to-do__item-label';

        this.toDoItemDoneDateAccessor = by.css('.' + this.toDoItemDoneDateClass);
        this.toDoItemLabelAccessor = by.css('.' + this.toDoItemLabelClass);

        this.app = this.userBrowser.element(by.tagName(SELECTOR_PREFIX + '-' + APP_SELECTOR));
        this.header = this.userBrowser.element(by.tagName('header'));
        this.title = this.header.element(by.tagName('h1'));
        this.section = this.userBrowser.element(by.tagName('section'));
        this.toDo = this.section.element(by.tagName(SELECTOR_PREFIX + '-to-do'));

        this.newToDo = this.toDo.element(by.tagName(SELECTOR_PREFIX + '-' + NEW_TO_DO_SELECTOR));
        this.addNewItemButton = this.newToDo.element(by.css('.add-item__btn'));
        this.newItemInput = this.newToDo.element(by.css('.new-item__input'));
        this.newToDoDiv = this.newToDo.element(by.tagName('div'));

        this.toDoList = this.toDo.element(by.tagName(SELECTOR_PREFIX + '-' + TO_TO_LIST_SELECTOR));
        this.toDoListContainer = this.toDoList.element(by.css('to-do__list'));
        this.toDoListElements = this.toDoListContainer.all(by.tagName('li'));
    }


    /**
     * Add a new to-do item to the to-do list
     *
     * @param {string} label [description]
     */
    addToDoItem(label: string): void {
        this.newItemInput.sendKeys(label);
        this.addNewItemButton.click();
    }

    /**
     * Get the element corresponding to the to-do item done date
     *
     * @param  {ElementFinder} item The item in wich retrieve the done date
     * @return {ElementFinder}      The done date of the to-do item (if any)
     */
    getDoneDate(item: ElementFinder): ElementFinder {
        return item.element(this.toDoItemDoneDateAccessor);
    }

    /**
     * Get the element corresponding to the to-do item label
     *
     * @param  {ElementFinder} item The item in wich retrieve the label
     * @return {ElementFinder}      The label of the to-do item
     */
    getLabel(item: ElementFinder): ElementFinder {
        return item.element(this.toDoItemLabelAccessor);
    }

    /**
     * Get the element corresponding to the last to-do item of the to-do list
     *
     * @return {ElementFinder} The last to-do item of the to-do list (if any)
     */
    getLastItem(): ElementFinder {
        return this.toDoListElements && this.toDoListElements.last();
    }

    /**
     * Toggle
     *
     * @param  {ElementFinder} item The item in wich retrieve the done date
     * @return {ElementFinder}      The done date (if any)
     */
    toggleItem(item: ElementFinder): void {
        item.click();
    }
};
