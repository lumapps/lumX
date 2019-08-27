import { DOWN_KEY_CODE, ENTER_KEY_CODE } from '@lumx/core/js/constants';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMagnify, mdiMenuDown } from '@lumx/icons';

import template from '../views/select.html';

/////////////////////////////

function SelectController($document, $interpolate, $sce, $scope, $timeout, LxDropdownService, LxUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The choice template.
     *
     * @type {string}
     */
    let _choiceTemplate;

    /**
     * The model controller.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _modelController;

    /**
     * The selected template.
     *
     * @type {string}
     */
    // eslint-disable-next-line one-var
    let _selectedTemplate;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the select is focus or not.
     *
     * @type {boolean}
     */
    lx.isFocus = false;

    /**
     * Whether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lx.isOpen = false;

    /**
     * The dropdown unique identifier.
     *
     * @type {string}
     */
    lx.dropdownUuid = LxUtilsService.generateUUID();

    /**
     * The filter model.
     *
     * @type {string}
     */
    lx.filterModel = undefined;

    /**
     * The select icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
        mdiClose,
        mdiCloseCircle,
        mdiMagnify,
        mdiMenuDown,
    };

    /**
     * The dropdown target unique identifier.
     *
     * @type {string}
     */
    lx.targetUuid = LxUtilsService.generateUUID();

    /**
     * The model view value.
     *
     * @type {string}
     */
    lx.viewValue = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Returns the object index in an array.
     *
     * @param  {Array}  arr The array to check in.
     * @param  {Object} obj The object to check.
     * @return {number} The object index.
     */
    function _arrayObjectIndexOf(arr, obj) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (angular.equals(obj, arr[i])) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Init view value.
     */
    function _initViewValue() {
        if (angular.isDefined(lx.modelToSelection)) {
            if (lx.multiple) {
                lx.viewValue = [];

                angular.forEach(_modelController.$viewValue, (item) => {
                    lx.modelToSelection({
                        // eslint-disable-next-line id-blacklist
                        callback(response) {
                            lx.viewValue.push(response);
                        },
                        // eslint-disable-next-line id-blacklist
                        data: item,
                    });
                });
            } else {
                lx.modelToSelection({
                    // eslint-disable-next-line id-blacklist
                    callback(response) {
                        lx.viewValue = response;
                    },
                    // eslint-disable-next-line id-blacklist
                    data: _modelController.$viewValue,
                });
            }
        } else {
            lx.viewValue = _modelController.$viewValue;
        }
    }

    /**
     * Select item synchronously (no selectiontoModel).
     *
     * @param {Object} choice The choice object.
     */
    function _updateModel(choice) {
        let updatedModel;

        if (lx.multiple) {
            updatedModel = angular.copy(_modelController.$viewValue);

            const choiceIndex = _arrayObjectIndexOf(_modelController.$viewValue, choice);

            if (choiceIndex === -1) {
                updatedModel.push(choice);
            } else {
                updatedModel.splice(choiceIndex, 1);
            }
        } else {
            updatedModel = choice;
        }

        _modelController.$setViewValue(updatedModel);
    }

    /**
     * Update view value on select.
     *
     * @param {Object} choice The choice object.
     */
    function _updateViewValue(choice) {
        if (lx.multiple) {
            const choiceIndex = _arrayObjectIndexOf(lx.viewValue, choice);

            if (choiceIndex === -1) {
                lx.viewValue.push(choice);
            } else {
                lx.viewValue.splice(choiceIndex, 1);
            }
        } else {
            lx.viewValue = choice;
        }
    }

    /**
     * Handle key events on input wrapper focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if ((evt.keyCode === DOWN_KEY_CODE || evt.keyCode === ENTER_KEY_CODE) && !lx.isOpen) {
            lx.openDropdown();

            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Clear the model on clear button click.
     *
     * @param {Event} [evt] The event that triggered the function.
     */
    function clearModel(evt) {
        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        if (lx.multiple) {
            _modelController.$setViewValue([]);
            lx.viewValue.length = 0;
        } else {
            _modelController.$setViewValue(undefined);
            lx.viewValue = undefined;
        }
    }

    /**
     * Close the dropdown menu.
     */
    function closeDropdown() {
        LxDropdownService.close(lx.dropdownUuid);
    }

    /**
     * Disable key events on input wrapper blur.
     */
    function disableKeyEvents() {
        lx.isFocus = false;
        $document.off('keydown keypress', _onKeyPress);
    }

    /**
     * Display the choice according to the choice template.
     *
     * @param  {Object} choice The choice object.
     * @return {string} The choice label.
     */
    function displayChoice(choice) {
        const choiceScope = {
            $choice: choice,
        };

        const interpolatedChoice = $interpolate(_choiceTemplate)(choiceScope);

        return $sce.trustAsHtml(interpolatedChoice);
    }

    /**
     * Display the selected item according to the selected template.
     *
     * @param  {Object} [selected] The selected object.
     * @return {string} The selected label.
     */
    function displaySelected(selected) {
        const selectedScope = {
            $selected: angular.isDefined(selected) ? selected : lx.viewValue,
        };

        const interpolatedSelected = $interpolate(_selectedTemplate)(selectedScope);

        return $sce.trustAsHtml(interpolatedSelected);
    }

    /**
     * Enable key events on input wrapper focus.
     */
    function enableKeyEvents() {
        lx.isFocus = true;
        $document.on('keydown keypress', _onKeyPress);
    }

    /**
     * Check if the model is empty.
     *
     * @return {boolean} Whether the model is empty or not.
     */
    function isModelEmpty() {
        if (lx.multiple) {
            return _modelController.$viewValue.length === 0;
        }

        return angular.isUndefined(_modelController.$viewValue);
    }

    /**
     * Check if a choice is selected.
     *
     * @param  {Object}  choice The choice object.
     * @return {boolean} Whether the choice is selected or not.
     */
    function isSelected(choice) {
        if (lx.multiple) {
            return _arrayObjectIndexOf(lx.viewValue, choice) !== -1;
        }

        return angular.equals(choice, lx.viewValue);
    }

    /**
     * Open the dropdown menu on input wrapper click.
     */
    function openDropdown() {
        LxDropdownService.open(lx.dropdownUuid, { target: `#${lx.targetUuid}` });
    }

    /**
     * Register the choice template.
     *
     * @param {string} choiceTemplate The choice template.
     */
    function registerChoiceTemplate(choiceTemplate) {
        _choiceTemplate = choiceTemplate;
    }

    /**
     * Select the selected template.
     *
     * @param {string} selectedTemplate The choice template.
     */
    function registerSelectedTemplate(selectedTemplate) {
        _selectedTemplate = selectedTemplate;
    }

    /**
     * Select a choice.
     *
     * @param {Object} choice The choice object.
     * @param {Event}  [evt]  The event that triggered the function.
     */
    function select(choice, evt) {
        if (angular.isDefined(evt) && lx.multiple) {
            evt.stopPropagation();
        }

        if (
            lx.multiple &&
            !lx.isSelected(choice) &&
            angular.isDefined(lx.max) &&
            _modelController.$viewValue.length >= parseInt(lx.max, 10)
        ) {
            return;
        }

        if (angular.isDefined(lx.selectionToModel)) {
            lx.selectionToModel({
                // eslint-disable-next-line id-blacklist
                callback(response) {
                    _updateModel(response);
                    _updateViewValue(choice);
                },
                // eslint-disable-next-line id-blacklist
                data: choice,
            });
        } else {
            _updateModel(choice);
            _updateViewValue(choice);
        }

        if (lx.multiple) {
            $timeout(() => {
                LxDropdownService.updateActiveDropdownPosition();
            });
        }
    }

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;

        _modelController.$render = _initViewValue;
    }

    /**
     * Update choices list according to filter model.
     */
    function updateFilter() {
        if (angular.isDefined(lx.filter)) {
            lx.filter({
                newValue: lx.filterModel,
            });
        }
    }

    /////////////////////////////

    lx.clearModel = clearModel;
    lx.closeDropdown = closeDropdown;
    lx.disableKeyEvents = disableKeyEvents;
    lx.displayChoice = displayChoice;
    lx.displaySelected = displaySelected;
    lx.enableKeyEvents = enableKeyEvents;
    lx.isModelEmpty = isModelEmpty;
    lx.isSelected = isSelected;
    lx.openDropdown = openDropdown;
    lx.registerChoiceTemplate = registerChoiceTemplate;
    lx.registerSelectedTemplate = registerSelectedTemplate;
    lx.select = select;
    lx.setModelController = setModelController;
    lx.updateFilter = updateFilter;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Add focus class to input wrapper on dropdown open.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {Object} dropdownId The dropdown identifier.
     */
    $scope.$on('lx-dropdown__open', (evt, dropdownId) => {
        if (dropdownId === lx.dropdownUuid) {
            lx.isOpen = true;
        }
    });

    /**
     * Remove focus class to input wrapper on dropdown close.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {Object} dropdownId The dropdown identifier.
     */
    $scope.$on('lx-dropdown__close', (evt, dropdownId) => {
        if (dropdownId === lx.dropdownUuid) {
            lx.isOpen = false;
        }
    });
}

/////////////////////////////

function SelectDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        ctrls[0].setModelController(ctrls[1]);

        transclude(
            scope,
            (clone) => {
                let choiceTemplate = '';

                for (let i = 0; i < clone.length; i++) {
                    choiceTemplate += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerChoiceTemplate(choiceTemplate);
            },
            null,
            'choices',
        );

        transclude(
            scope,
            (clone) => {
                let selectedTemplate = '';

                for (let i = 0; i < clone.length; i++) {
                    selectedTemplate += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerSelectedTemplate(selectedTemplate);
            },
            null,
            'selected',
        );
    }

    return {
        bindToController: true,
        controller: SelectController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxSelect', 'ngModel'],
        restrict: 'E',
        scope: {
            choices: '=lxChoices',
            filter: '&?lxFilter',
            hasError: '=?lxError',
            hasFilter: '=?lxDisplayFilter',
            hasHelper: '=?lxHelper',
            helper: '@?lxHelperMessage',
            isClearable: '=?lxAllowClear',
            isDisabled: '=?ngDisabled',
            isLoading: '=?lxLoading',
            isValid: '=?lxValid',
            label: '@?lxLabel',
            max: '=?lxMax',
            modelToSelection: '&?lxModelToSelection',
            multiple: '=?lxMultiple',
            placeholder: '@?lxPlaceholder',
            selectionToModel: '&?lxSelectionToModel',
            theme: '@?lxTheme',
            variant: '@?lxVariant',
        },
        template,
        transclude: {
            choices: 'lxSelectChoices',
            selected: 'lxSelectSelected',
        },
    };
}

/////////////////////////////

angular.module('lumx.select').directive('lxSelect', SelectDirective);

/////////////////////////////

export { SelectDirective };
