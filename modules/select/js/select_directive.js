(function()
{
    'use strict';

    angular
        .module('lumx.select')
        .filter('filterChoices', filterChoices)
        .directive('lxSelect', lxSelect)
        .directive('lxSelectSelected', lxSelectSelected)
        .directive('lxSelectChoices', lxSelectChoices);

    filterChoices.$inject = ['$filter'];

    function filterChoices($filter)
    {
        return function(choices, externalFilter, textFilter)
        {
            if (externalFilter)
            {
                return choices;
            }

            var toFilter = [];

            if (!angular.isArray(choices))
            {
                if (angular.isObject(choices))
                {
                    for (var idx in choices)
                    {
                        if (angular.isArray(choices[idx]))
                        {
                            toFilter = toFilter.concat(choices[idx]);
                        }
                    }
                }
            }
            else
            {
                toFilter = choices;
            }

            return $filter('filter')(toFilter, textFilter);
        };
    }

    function lxSelect()
    {
        return {
            restrict: 'E',
            templateUrl: 'select.html',
            scope:
            {
                allowClear: '=?lxAllowClear',
                allowNewValue: '=?lxAllowNewValue',
                autocomplete: '=?lxAutocomplete',
                newValueTransform: '=?lxNewValueTransform',
                choices: '=?lxChoices',
                choicesCustomStyle: '=?lxChoicesCustomStyle',
                choicesViewMode: '@?lxChoicesViewMode',
                customStyle: '=?lxCustomStyle',
                displayFilter: '=?lxDisplayFilter',
                error: '=?lxError',
                filter: '&?lxFilter',
                filterFields: '=?lxFilterFields',
                fixedLabel: '=?lxFixedLabel',
                helper: '=?lxHelper',
                helperMessage: '@?lxHelperMessage',
                infiniteScroll: '&?lxInfiniteScroll',
                label: '@?lxLabel',
                loading: '=?lxLoading',
                max: '=?lxMax',
                modelToSelection: '&?lxModelToSelection',
                multiple: '=?lxMultiple',
                ngChange: '&?',
                ngDisabled: '=?',
                ngModel: '=',
                selectionToModel: '&?lxSelectionToModel',
                theme: '@?lxTheme',
                valid: '=?lxValid',
                viewMode: '@?lxViewMode'
            },
            link: link,
            controller: LxSelectController,
            controllerAs: 'lxSelect',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            var backwardOneWay = ['customStyle'];
            var backwardTwoWay = ['allowClear', 'choices', 'error', 'loading', 'multiple', 'valid'];

            angular.forEach(backwardOneWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    attrs.$observe(attribute, function(newValue)
                    {
                        scope.lxSelect[attribute] = newValue;
                    });
                }
            });

            angular.forEach(backwardTwoWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    scope.$watch(function()
                    {
                        return scope.$parent.$eval(attrs[attribute]);
                    }, function(newValue)
                    {
                        if (attribute === 'multiple' && angular.isUndefined(newValue))
                        {
                            scope.lxSelect[attribute] = true;
                        }
                        else
                        {
                            scope.lxSelect[attribute] = newValue;
                        }
                    });
                }
            });

            attrs.$observe('placeholder', function(newValue)
            {
                scope.lxSelect.label = newValue;
            });

            attrs.$observe('change', function(newValue)
            {
                scope.lxSelect.ngChange = function(data)
                {
                    return scope.$parent.$eval(newValue, data);
                };
            });

            attrs.$observe('filter', function(newValue)
            {
                scope.lxSelect.filter = function(data)
                {
                    return scope.$parent.$eval(newValue, data);
                };
                scope.lxSelect.displayFilter = true;
            });

            attrs.$observe('modelToSelection', function(newValue)
            {
                scope.lxSelect.modelToSelection = function(data)
                {
                    return scope.$parent.$eval(newValue, data);
                };
            });

            attrs.$observe('selectionToModel', function(newValue)
            {
                scope.lxSelect.selectionToModel = function(data)
                {
                    return scope.$parent.$eval(newValue, data);
                };
            });

            attrs.$observe('infiniteScroll', function(newValue) {
                scope.lxSelect.infiniteScroll = function(data) {
                    return scope.$parent.$eval(newValue, data);
                };
            });
        }
    }

    LxSelectController.$inject = ['$interpolate', '$element', '$filter', '$sce', '$scope', '$timeout', 'LxDepthService', 'LxDropdownService', 'LxUtils'];

    function LxSelectController($interpolate, $element, $filter, $sce, $scope, $timeout, LxDepthService, LxDropdownService, LxUtils)
    {
        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        var lxSelect = this;
        var choiceTemplate;
        var selectedTemplate;
        var toggledPanes = {};

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        lxSelect.activeChoiceIndex = -1;
        lxSelect.activeSelectedIndex = -1;
        lxSelect.uuid = LxUtils.generateUUID();
        lxSelect.filterModel = undefined;
        lxSelect.ngModel = angular.isUndefined(lxSelect.ngModel) && lxSelect.multiple ? [] : lxSelect.ngModel;
        lxSelect.unconvertedModel = lxSelect.multiple ? [] : undefined;
        lxSelect.viewMode = angular.isUndefined(lxSelect.viewMode) ? 'field' : lxSelect.viewMode;
        lxSelect.choicesViewMode = angular.isUndefined(lxSelect.choicesViewMode) ? 'list' : lxSelect.choicesViewMode;
        
        lxSelect.panes = [];
        lxSelect.matchingPaths = undefined;

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Close the given panes (and all of its children panes).
         *
         * @param {number} index The index of the pane to close.
         */
        function _closePane(index) {
            if (index === 0) {
                _closePanes();

                return;
            }

            if (angular.isUndefined(toggledPanes[index])) {
                return;
            }

            _closePane(index + 1);

            if (lxSelect.choicesViewSize === 'large') {
                lxSelect.panes.splice(toggledPanes[index].position, 1);
            } else {
                lxSelect.openedPanes.splice(toggledPanes[index].position, 1);
            }

            delete toggledPanes[index];
        }

        /**
         * Close all panes.
         */
        function _closePanes() {
            toggledPanes = {};

            if (lxSelect.choicesViewSize === 'large') {
                if (angular.isDefined(lxSelect.choices) && lxSelect.choices !== null) {
                    lxSelect.panes = [lxSelect.choices];
                } else {
                    lxSelect.panes = [];
                }
            } else {
                if (angular.isDefined(lxSelect.choices) && lxSelect.choices !== null) {
                    lxSelect.openedPanes = [lxSelect.choices];
                } else {
                    lxSelect.openedPanes = [];
                }
            }
        }

        /**
         * Find the index of an element in an array.
         *
         * @param  {Array}  haystack The array in which to search for the value.
         * @param  {*}      needle   The value to search in the array.
         * @return {number} The index of the value of the array, or -1 if not found.
         */
        function _findIndex(haystack, needle) {
            if (angular.isUndefined(haystack) || haystack.length === 0) {
                return -1;
            }

            for (var i = 0, len = haystack.length; i < len; i++) {
                if (haystack[i] === needle) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * Get the longest matching path containing the given string.
         *
         * @param {string} [containing] The string we want the matching path to contain.
         *                              If none given, just take the longest matching path of the first matching path.
         */
        function _getLongestMatchingPath(containing) {
            if (angular.isUndefined(lxSelect.matchingPaths) || lxSelect.matchingPaths.length === 0) {
                return undefined;
            }

            containing = containing || lxSelect.matchingPaths[0];

            var longest = lxSelect.matchingPaths[0];
            var longestSize = longest.split('.').length;
            for (var i = 1, len = lxSelect.matchingPaths.length; i < len; i++) {
                var matchingPath = lxSelect.matchingPaths[i];
                if (!matchingPath) {
                    continue;
                }

                if (matchingPath.indexOf(containing) === -1) {
                    break;
                }

                var size = matchingPath.split('.').length;
                if (size > longestSize) {
                    longest = matchingPath;
                    longestSize = size;
                }
            }

            return longest;
        }

        /**
         * When the down key is pressed, select the next item of the most right opened pane (the first one if we are at
         * the bottom).
         */
        function _keyDown()
        {
            var filteredChoices;

            if (lxSelect.choicesViewMode === 'panes') {
                filteredChoices = Object.keys(lxSelect.panes[(lxSelect.panes.length - 1)]);
            } else {
                filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);
            }

            if (filteredChoices.length)
            {
                lxSelect.activeChoiceIndex += 1;

                if (lxSelect.activeChoiceIndex >= filteredChoices.length)
                {
                    lxSelect.activeChoiceIndex = 0;
                }
            }

            if (lxSelect.autocomplete)
            {
                LxDropdownService.open('dropdown-' + lxSelect.uuid, '#lx-select-selected-wrapper-' + lxSelect.uuid);
            }
        }

        /**
         * When the left key is pressed and we are displaying the choices in pane mode, close the most right opened
         * pane.
         */
        function _keyLeft() {
            if (lxSelect.choicesViewMode !== 'panes' || lxSelect.panes.length < 2) {
                return;
            }

            var previousPaneIndex = lxSelect.panes.length - 2;

            lxSelect.activeChoiceIndex = (
                Object.keys(lxSelect.panes[previousPaneIndex]) || []
            ).indexOf(
                (toggledPanes[previousPaneIndex] || {}).key
            );

            _closePane(previousPaneIndex);
        }

        function _keyRemove()
        {
            if (lxSelect.filterModel || angular.isUndefined(lxSelect.getSelectedModel()) || !lxSelect.getSelectedModel().length)
            {
                return;
            }

            if (lxSelect.activeSelectedIndex === -1)
            {
                lxSelect.activeSelectedIndex = lxSelect.getSelectedModel().length - 1;
            }
            else
            {
                unselect(lxSelect.getSelectedModel()[lxSelect.activeSelectedIndex]);
            }
        }

        /**
         * When the right key is pressed and we are displaying the choices in pane mode, open the currently selected
         * pane.
         */
        function _keyRight() {
            if (lxSelect.choicesViewMode !== 'panes' || lxSelect.activeChoiceIndex === -1) {
                return;
            }

            var paneOpened = _openPane((lxSelect.panes.length - 1), lxSelect.activeChoiceIndex, true);

            if (paneOpened) {
                lxSelect.activeChoiceIndex = 0;
            } else {
                _keySelect();
            }
        }

        /**
         * When the enter key is pressed, select the currently active choice.
         */
        function _keySelect() {
            var filteredChoices;

            if (lxSelect.choicesViewMode === 'panes') {
                filteredChoices = lxSelect.panes[(lxSelect.panes.length - 1)];
                if (!lxSelect.isLeaf(filteredChoices[lxSelect.activeChoiceIndex])) {
                    return;
                }
            } else {
                filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);
            }

            if (filteredChoices.length && filteredChoices[lxSelect.activeChoiceIndex]) {
                lxSelect.toggleChoice(filteredChoices[lxSelect.activeChoiceIndex]);
            } else if (lxSelect.filterModel && lxSelect.allowNewValue) {
                if (angular.isArray(getSelectedModel())) {
                    var value = angular.isFunction(lxSelect.newValueTransform) ? lxSelect.newValueTransform(lxSelect.filterModel) : lxSelect.filterModel;
                    var identical = getSelectedModel().some(function (item) {
                        return angular.equals(item, value);
                    });

                    if (!identical) {
                        lxSelect.getSelectedModel().push(value);
                    }
                }

                lxSelect.filterModel = undefined;

                LxDropdownService.close('dropdown-' + lxSelect.uuid);
            }
        }

        /**
         * When the up key is pressed, select the previous item of the most right opened pane (the last one if we are at
         * the top).
         */
        function _keyUp() {
            var filteredChoices;

            if (lxSelect.choicesViewMode === 'panes') {
                filteredChoices = Object.keys(lxSelect.panes[(lxSelect.panes.length - 1)]);
            } else {
                filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);
            }

            if (filteredChoices.length) {
                lxSelect.activeChoiceIndex -= 1;

                if (lxSelect.activeChoiceIndex < 0) {
                    lxSelect.activeChoiceIndex = filteredChoices.length - 1;
                }
            }

            if (lxSelect.autocomplete) {
                LxDropdownService.open('dropdown-' + lxSelect.uuid, '#lx-select-selected-wrapper-' + lxSelect.uuid);
            }
        }

        /**
         * When a key is pressed, call the event handler in the angular context.
         *
         * @param {Event} evt The keydown event.
         */
        function _onKeyDown(evt) {
            $scope.$apply(function applyKeyEvent() {
                lxSelect.keyEvent(evt);
            });
        }

        /**
         * Open a pane.
         * If the pane is already opened, don't do anything.
         *
         * @param  {number}        parentIndex         The index of the parent of the pane to open.
         * @param  {number|string} indexOrKey          The index or the name of the pane to open.
         * @param  {boolean}       [checkIsLeaf=false] Check if the pane we want to open is in fact a leaf.
         *                                             In the case of a leaf, don't open it.
         * @return {boolean}       Indicates if the panel has been opened or not.
         */
        function _openPane(parentIndex, indexOrKey, checkIsLeaf) {
            if (angular.isDefined(toggledPanes[parentIndex])) {
                return false;
            }

            var pane = pane || lxSelect.choicesViewSize === 'large' ? lxSelect.panes[parentIndex] : lxSelect.openedPanes[parentIndex];

            if (angular.isUndefined(pane)) {
                return false;
            }

            var key = indexOrKey;
            if (angular.isObject(pane) && angular.isNumber(key)) {
                key = (Object.keys(pane) || [])[key];
            }

            if (checkIsLeaf && lxSelect.isLeaf(pane[key])) {
                return false;
            }

            if (lxSelect.choicesViewSize === 'large') {
                lxSelect.panes.push(pane[key]);
            } else {
                lxSelect.openedPanes.push(pane[key]);
            }

            toggledPanes[parentIndex] = {
                key: key,
                position: lxSelect.choicesViewSize === 'large' ? lxSelect.panes.length - 1 : lxSelect.openedPanes.length - 1,
                path: (parentIndex === 0) ? key : toggledPanes[parentIndex - 1].path + '.' + key,
            };

            return true;
        }

        /**
         * Search for any path in an object containing the given regexp as a key or as a value.
         *
         * @param  {*}      container               The container in which to search for the regexp.
         * @param  {RegExp} regexp                  The regular expression to search in keys or values of the object (nested)
         * @param  {string} previousKey             The path to the current object.
         * @param  {Array}  [limitToFields=Array()] The fields in which we want to look for the filter.
         *                                          If none give, then use all the fields of the object.
         * @return {Array}  The list of paths that have matching key or value.
         */
        function _searchPath(container, regexp, previousKey, limitToFields) {
            limitToFields = limitToFields || [];
            limitToFields = (angular.isArray(limitToFields)) ? limitToFields : [limitToFields];

            var results = [];

            angular.forEach(container, function forEachItemsInContainer(items, key) {
                if (limitToFields.length > 0 && limitToFields.indexOf(key) === -1) {
                    return;
                }

                var pathToMatching = (previousKey) ? previousKey + '.' + key : key;

                var previousKeyAdded = false;
                var isLeaf = lxSelect.isLeaf(items);

                if ((!isLeaf && angular.isString(key) && regexp.test(key)) || (angular.isString(items) && regexp.test(items))) {
                    if (!previousKeyAdded && previousKey) {
                        results.push(previousKey);
                    }

                    if (!isLeaf) {
                        results.push(pathToMatching);
                    }
                }

                if (angular.isArray(items) || angular.isObject(items)) {
                    var newPaths = _searchPath(items, regexp, pathToMatching, (isLeaf) ? lxSelect.filterFields : []);

                    if (angular.isDefined(newPaths) && newPaths.length > 0) {
                        if (previousKey) {
                            results.push(previousKey);
                            previousKeyAdded = true;
                        }

                        results = results.concat(newPaths);
                    }
                }
            });

            return results;
        }

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        function arrayObjectIndexOf(arr, obj)
        {
            for (var i = 0; i < arr.length; i++)
            {
                if (angular.equals(arr[i], obj))
                {
                    return i;
                }
            }

            return -1;
        }

        /**
         * Check if the choices dropdown is opened.
         *
         * @return {boolean} If the choices dropdown is opened or not.
         */
        function areChoicesOpened() {
            return LxDropdownService.isOpen('dropdown-' + lxSelect.uuid);
        }

        function displayChoice(_choice)
        {
            var choiceScope = {
                $choice: _choice
            };

            var interpolatedChoice = $interpolate(choiceTemplate)(choiceScope);
            interpolatedChoice = '<span>' + interpolatedChoice + '</span>';
            return $sce.trustAsHtml((lxSelect.matchingPaths) ?
                $filter('lxHighlight')(interpolatedChoice, lxSelect.filterModel, true) : interpolatedChoice
            );
        }

        function displaySelected(_selected)
        {
            var selectedScope = {};

            if (!angular.isArray(lxSelect.choices))
            {
                var found = false;

                for (var header in lxSelect.choices)
                {
                    if (found)
                    {
                        break;
                    }

                    if (lxSelect.choices.hasOwnProperty(header))
                    {
                        for (var idx = 0, len = lxSelect.choices[header].length; idx < len; idx++)
                        {
                            if (angular.equals(_selected, lxSelect.choices[header][idx]))
                            {
                                selectedScope.$selectedSubheader = header;

                                found = true;

                                break;
                            }
                        }
                    }
                }
            }

            if (angular.isDefined(_selected))
            {
                selectedScope.$selected = _selected;
            }
            else
            {
                selectedScope.$selected = getSelectedModel();
            }

            return $sce.trustAsHtml($interpolate(selectedTemplate)(selectedScope));
        }

        function displaySubheader(_subheader)
        {
            return $sce.trustAsHtml((lxSelect.matchingPaths) ?
                $filter('lxHighlight')(_subheader, lxSelect.filterModel, true) : _subheader
            );
        }

        function getFilteredChoices()
        {
            return $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);
        }

        function getSelectedModel()
        {
            if (angular.isDefined(lxSelect.modelToSelection) || angular.isDefined(lxSelect.selectionToModel))
            {
                return lxSelect.unconvertedModel;
            }
            else
            {
                return lxSelect.ngModel;
            }
        }

        /**
         * Check if an object is a leaf object.
         * A leaf object is an object that contains the `isLeaf` property or that has property that are anything else
         * than object or arrays.
         *
         * @param  {*}       obj The object to check if it's a leaf
         * @return {boolean} If the object is a leaf object.
         */
        function isLeaf(obj) {
            if (angular.isUndefined(obj)) {
                return false;
            }

            if (angular.isArray(obj)) {
                return false;
            }

            if (!angular.isObject(obj)) {
                return true;
            }

            if (obj.isLeaf) {
                return true;
            }

            var isLeaf = false;
            var keys = Object.keys(obj);
            for (var i = 0, len = keys.length; i < len; i++) {
                var property = keys[i];
                if (property.charAt(0) === '$') {
                    continue;
                }

                if (!angular.isArray(obj[property]) && !angular.isObject(obj[property])) {
                    isLeaf = true;
                    break;
                }
            }

            return isLeaf;
        }

        /**
         * Check if a pane is toggled.
         *
         * @param  {number}        parentIndex The parent index of the pane in which to check.
         * @param  {number|string} indexOrKey  The index or the name of the pane to check.
         * @return {boolean}       If the pane is toggled or not.
         */
        function isPaneToggled(parentIndex, indexOrKey) {
            var pane = lxSelect.choicesViewSize === 'large' ? lxSelect.panes[parentIndex] : lxSelect.openedPanes[parentIndex];

            if (angular.isUndefined(pane)) {
                return false;
            }

            var key = indexOrKey;
            if (angular.isObject(pane) && angular.isNumber(indexOrKey)) {
                key = (Object.keys(pane) || [])[indexOrKey];
            }

            return angular.isDefined(toggledPanes[parentIndex]) && toggledPanes[parentIndex].key === key;
        }

        /**
         * Check if a path of a pane is matching the filter.
         *
         * @param {number}        parentIndex The index of the pane.
         * @param {number|string} indexOrKey  The index or the name of the item to check.
         */
        function isMatchingPath(parentIndex, indexOrKey) {
            var pane = lxSelect.choicesViewSize === 'large' ? lxSelect.panes[parentIndex] : lxSelect.openedPanes[parentIndex];

            if (angular.isUndefined(pane)) {
                return;
            }

            var key = indexOrKey;
            if (angular.isObject(pane) && angular.isNumber(indexOrKey)) {
                key = (Object.keys(pane) || [])[indexOrKey];
            }

            if (parentIndex === 0) {
                return _findIndex(lxSelect.matchingPaths, key) !== -1;
            }

            var previous = toggledPanes[parentIndex - 1];
            if (angular.isUndefined(previous)) {
                return false;
            }

            return _findIndex(lxSelect.matchingPaths, previous.path + '.' + key) !== -1;
        }

        function isSelected(_choice)
        {
            if (lxSelect.multiple && angular.isDefined(getSelectedModel()))
            {
                return arrayObjectIndexOf(getSelectedModel(), _choice) !== -1;
            }
            else if (angular.isDefined(getSelectedModel()))
            {
                return angular.equals(getSelectedModel(), _choice);
            }
        }

        function isMaxSelected() {
            if (lxSelect.multiple && angular.isDefined(lxSelect.max))
            {
                return lxSelect.ngModel.length >= parseInt(lxSelect.max, 10);
            }

            return false;
        }

        /**
         * Handle a key press event
         *
         * @param {Event} evt The key press event.
         */
        function keyEvent(evt) {
            if (evt.keyCode !== 8) {
                lxSelect.activeSelectedIndex = -1;
            }

            if (!LxDropdownService.isOpen('dropdown-' + lxSelect.uuid)) {
                lxSelect.activeChoiceIndex = -1;
            }

            switch (evt.keyCode) {
                case 8:
                    _keyRemove();
                    break;

                case 13:
                    _keySelect();
                    evt.preventDefault();
                    break;

                case 37:
                    if (lxSelect.activeChoiceIndex > -1) {
                        _keyLeft();
                        evt.preventDefault();
                    }
                    break;

                case 38:
                    _keyUp();
                    evt.preventDefault();
                    break;

                case 39:
                    if (lxSelect.activeChoiceIndex > -1) {
                        _keyRight();
                        evt.preventDefault();
                    }
                    break;


                case 40:
                    _keyDown();
                    evt.preventDefault();
                    break;

                default:
                    break;
            }
        }

        function registerChoiceTemplate(_choiceTemplate)
        {
            choiceTemplate = _choiceTemplate;
        }

        function registerSelectedTemplate(_selectedTemplate)
        {
            selectedTemplate = _selectedTemplate;
        }

        function select(_choice, cb)
        {
            cb = cb || angular.noop;

            if (lxSelect.multiple)
            {
                if (angular.isUndefined(lxSelect.ngModel)) {
                    lxSelect.ngModel = [];
                }

                if (isMaxSelected()) {
                    cb();

                    return;
                }
            }

            if (angular.isDefined(lxSelect.selectionToModel))
            {
                lxSelect.selectionToModel(
                {
                    data: _choice,
                    callback: function(resp)
                    {
                        if (lxSelect.multiple)
                        {
                            lxSelect.ngModel.push(resp);
                        }
                        else
                        {
                            lxSelect.ngModel = resp;
                        }

                        if (lxSelect.autocomplete)
                        {
                            $element.find('.lx-select-selected__filter').focus();
                        }

                        if (lxSelect.choicesViewMode === 'panes' && lxSelect.displayFilter && lxSelect.multiple) {
                            $element.find('.lx-select-selected__filter input').focus();
                        }

                        if (angular.isFunction(cb)) {
                            $timeout(cb);
                        }
                    }
                });
            }
            else
            {
                if (lxSelect.multiple)
                {
                    lxSelect.ngModel.push(_choice);
                }
                else
                {
                    lxSelect.ngModel = _choice;
                }

                if (lxSelect.autocomplete)
                {
                    $element.find('.lx-select-selected__filter').focus();
                }

                if (lxSelect.choicesViewMode === 'panes' && lxSelect.displayFilter && lxSelect.multiple) {
                    $element.find('.lx-select-selected__filter input').focus();
                }

                if (angular.isFunction(cb)) {
                    $timeout(cb);
                }
            }
        }

        /**
         * Toggle the given choice. If it was selected, unselect it. If it wasn't selected, select it.
         *
         * @param {Object} choice The choice to toggle.
         * @param {Event}  [evt]  The event that triggered the function.
         */
        function toggleChoice(choice, evt) {
            if (lxSelect.multiple && !lxSelect.autocomplete && angular.isDefined(evt)) {
                evt.stopPropagation();
            }

            if (lxSelect.areChoicesOpened() && lxSelect.multiple) {
                var dropdownElement = angular.element(angular.element(evt.target).closest('.dropdown-menu--is-open')[0]);
                // If the dropdown element is scrollable, fix the content div height to keep the current scroll state.
                if (dropdownElement.scrollTop() > 0) {
                    var dropdownContentElement = angular.element(dropdownElement.find('.dropdown-menu__content')[0]);
                    var dropdownFilterElement = angular.element(dropdownContentElement.find('.lx-select-choices__filter')[0]);

                    var newHeight = dropdownContentElement.height();
                    newHeight -= (dropdownFilterElement.length) ? dropdownFilterElement.outerHeight() : 0;

                    var dropdownListElement = angular.element(dropdownContentElement.find('ul > div')[0]);
                    dropdownListElement.css('height', newHeight + 'px');

                    // This function is called when the ng-change attached to the filter input is called.
                    lxSelect.resetDropdownSize = function() {
                        dropdownListElement.css('height', 'auto');
                        lxSelect.resetDropdownSize = undefined;
                    }
                }
            }

            if (lxSelect.multiple && isSelected(choice)) {
                lxSelect.unselect(choice);
            } else {
                lxSelect.select(choice);
            }

            if (lxSelect.autocomplete) {
                lxSelect.activeChoiceIndex = -1;
                lxSelect.filterModel = undefined;
            }

            if (lxSelect.autocomplete || (lxSelect.choicesViewMode === 'panes' && !lxSelect.multiple)) {
                LxDropdownService.close('dropdown-' + lxSelect.uuid);
            }
        }

        /**
         * Toggle a pane.
         *
         * @param {Event}         evt               The click event that led to toggle the pane.
         * @param {number}        parentIndex       The index of the containing pane.
         * @param {number|string} indexOrKey        The index or the name of the pane to toggle.
         * @param {boolean}       [selectLeaf=true] Indicates if we want to select the choice if the pane to toggle is
         *                                          in fact a leaf.
         */
        function togglePane(evt, parentIndex, indexOrKey, selectLeaf) {
            selectLeaf = (angular.isUndefined(selectLeaf)) ? true : selectLeaf;
            var pane = lxSelect.choicesViewSize === 'large' ? lxSelect.panes[parentIndex] : lxSelect.openedPanes[parentIndex];

            if (angular.isUndefined(pane)) {
                return;
            }

            var key = indexOrKey;
            if (angular.isObject(pane) && angular.isNumber(indexOrKey)) {
                key = (Object.keys(pane) || [])[indexOrKey];
            }

            if (angular.isDefined(toggledPanes[parentIndex])) {
                var previousKey = toggledPanes[parentIndex].key;

                _closePane(parentIndex);

                if (previousKey === key) {
                    return;
                }
            }

            var isLeaf = lxSelect.isLeaf(pane[key]);
            if (isLeaf) {
                if (selectLeaf) {
                    lxSelect.toggleChoice(pane[key], evt);
                }

                return;
            }

            _openPane(parentIndex, key, false);
        }

        function unselect(_choice, cb)
        {
            cb = cb || angular.noop;

            if (angular.isDefined(lxSelect.selectionToModel))
            {
                lxSelect.selectionToModel(
                {
                    data: _choice,
                    callback: function(resp)
                    {
                        removeElement(lxSelect.ngModel, resp);

                        if (lxSelect.autocomplete)
                        {
                            $element.find('.lx-select-selected__filter').focus();
                            lxSelect.activeSelectedIndex = -1;
                        }

                        if (lxSelect.choicesViewMode === 'panes' && lxSelect.displayFilter &&
                            (lxSelect.ngModel.length === 0 || lxSelect.multiple)) {
                            $element.find('.lx-select-selected__filter input').focus();
                        }

                        if (angular.isFunction(cb)) {
                            $timeout(cb);
                        }
                    }
                });

                removeElement(lxSelect.unconvertedModel, _choice);
            }
            else
            {
                removeElement(lxSelect.ngModel, _choice);

                if (lxSelect.autocomplete)
                {
                    $element.find('.lx-select-selected__filter').focus();
                    lxSelect.activeSelectedIndex = -1;
                }

                if (lxSelect.choicesViewMode === 'panes' && lxSelect.displayFilter &&
                    (lxSelect.ngModel.length === 0 || lxSelect.multiple)) {
                    $element.find('.lx-select-selected__filter input').focus();
                }

                if (angular.isFunction(cb)) {
                    $timeout(cb);
                }
            }
        }

        /**
         * Update the filter.
         * Either filter the choices available or highlight the path to the matching elements.
         */
        function updateFilter() {
            if (angular.isFunction(lxSelect.resetDropdownSize)) {
                lxSelect.resetDropdownSize();
            }

            if (angular.isDefined(lxSelect.filter)) {
                lxSelect.matchingPaths = lxSelect.filter({
                    newValue: lxSelect.filterModel
                });
            } else if (lxSelect.choicesViewMode === 'panes') {
                lxSelect.matchingPaths = lxSelect.searchPath(lxSelect.filterModel);
                _closePanes();
            }

            if (lxSelect.autocomplete) {
                lxSelect.activeChoiceIndex = -1;

                if (lxSelect.filterModel) {
                    LxDropdownService.open('dropdown-' + lxSelect.uuid, '#lx-select-selected-wrapper-' + lxSelect.uuid);
                } else {
                    LxDropdownService.close('dropdown-' + lxSelect.uuid);
                }
            }

            if (lxSelect.choicesViewMode === 'panes' && angular.isDefined(lxSelect.matchingPaths) && lxSelect.matchingPaths.length > 0) {
                var longest = _getLongestMatchingPath();
                if (!longest) {
                    return;
                }

                var longestPath = longest.split('.');
                if (longestPath.length === 0) {
                    return;
                }

                angular.forEach(longestPath, function forEachPartOfTheLongestPath(part, index) {
                    _openPane(index, part, index === (longestPath.length - 1));
                });
            }
        }

        function helperDisplayable() {
            // If helper message is not defined, message is not displayed...
            if (angular.isUndefined(lxSelect.helperMessage))
            {
                return false;
            }

            // If helper is defined return it's state.
            if (angular.isDefined(lxSelect.helper))
            {
                return lxSelect.helper;
            }

            // Else check if there's choices.
            var choices = lxSelect.getFilteredChoices();

            if (angular.isArray(choices))
            {
                return !choices.length;
            }
            else if (angular.isObject(choices))
            {
                return !(Object.keys(choices) || []).length;
            }

            return true;
        }

        function removeElement(model, element)
        {
            var index = -1;
            for (var i = 0, len = model.length; i < len; i++)
            {
                if (angular.equals(element, model[i]))
                {
                    index = i;
                    break;
                }
            }

            if (index > -1)
            {
                model.splice(index, 1);
            }
        }

        /**
         * Search in the multipane select for the paths matching the search.
         *
         * @param {string} newValue The filter string.
         */
        function searchPath(newValue) {
            if (!newValue || newValue.length < 2) {
                return undefined;
            }

            var regexp = new RegExp(LxUtils.escapeRegexp(newValue), 'ig');

            return _searchPath(lxSelect.choices, regexp);
        }

        /////////////////////////////

        lxSelect.areChoicesOpened = areChoicesOpened;
        lxSelect.displayChoice = displayChoice;
        lxSelect.displaySelected = displaySelected;
        lxSelect.displaySubheader = displaySubheader;
        lxSelect.getFilteredChoices = getFilteredChoices;
        lxSelect.getSelectedModel = getSelectedModel;
        lxSelect.helperDisplayable = helperDisplayable;
        lxSelect.isLeaf = isLeaf;
        lxSelect.isMatchingPath = isMatchingPath;
        lxSelect.isPaneToggled = isPaneToggled;
        lxSelect.isSelected = isSelected;
        lxSelect.isMaxSelected = isMaxSelected;
        lxSelect.keyEvent = keyEvent;
        lxSelect.registerChoiceTemplate = registerChoiceTemplate;
        lxSelect.registerSelectedTemplate = registerSelectedTemplate;
        lxSelect.searchPath = searchPath;
        lxSelect.select = select;
        lxSelect.toggleChoice = toggleChoice;
        lxSelect.togglePane = togglePane;
        lxSelect.unselect = unselect;
        lxSelect.updateFilter = updateFilter;

        /////////////////////////////
        //                         //
        //        Watchers         //
        //                         //
        /////////////////////////////

        $scope.$watch(function watcherChoices() {
            return lxSelect.choices;
        }, function watchChoices(newChoices, oldChoices) {
            if (angular.isUndefined(lxSelect.choices) || lxSelect.choices === null) {
                lxSelect.panes = [];

                return;
            }

            lxSelect.panes = [lxSelect.choices];
            lxSelect.openedPanes = [lxSelect.choices];
        }, true);

        /////////////////////////////
        //                         //
        //          Events         //
        //                         //
        /////////////////////////////

        /**
         * When the choices dropdown closes, reset the toggled panels and the filter.
         *
         * @param {Event}  evt        The dropdown close event.
         * @param {string} dropdownId The id of the dropdown that ends to close.
         */
        $scope.$on('lx-dropdown__close-end', function onDropdownClose(evt, dropdownId) {
            if (lxSelect.choicesViewMode !== 'panes' || dropdownId !== 'dropdown-' + lxSelect.uuid) {
                return;
            }

            angular.element(document).off('keydown', _onKeyDown);

            lxSelect.filterModel = undefined;
            lxSelect.matchingPaths = undefined;
            lxSelect.activeChoiceIndex = -1;

            _closePanes();
        });

        /**
         * When the choices dropdown opens, focus the search filter.
         *
         * @param {Event}  evt        The dropdown open event.
         * @param {string} dropdownId The id of the dropdown that ends to close.
         */
        $scope.$on('lx-dropdown__open-start', function onDropdownOpen(evt, dropdownId) {
            if (lxSelect.choicesViewMode !== 'panes' || dropdownId !== 'dropdown-' + lxSelect.uuid) {
                return;
            }

            angular.element(document).on('keydown', _onKeyDown);

            $timeout(function delayFocusSearchFilter() {
                $element.find('.lx-select-selected__filter input').focus();
            });
        });

        /**
         * When the end of the dropdown is reached and infinite scroll is specified,
         * fetch new data.
         * 
         * @param {Event}  evt        The scroll event.
         * @param {string} dropdownId The id of the dropdown that scrolled to the end.
         */
        $scope.$on('lx-dropdown__scroll-end', function(evt, dropdownId) {
            if (typeof lxSelect.infiniteScroll !== 'function'
                || dropdownId !== 'dropdown-' + lxSelect.uuid 
                || lxSelect.loading
            ) {
                return;
            }

            lxSelect.infiniteScroll()()
                    .then(function fetchNewData(newData) {
                        if (newData && newData.length) {
                            lxSelect.choices = lxSelect.choices.concat(newData);
                        }
                    })
                    .catch(function() {
                        // Do nothing here, because error is supposed to be catched before.
                    });
        });
    }

    function lxSelectSelected()
    {
        return {
            restrict: 'E',
            require: ['lxSelectSelected', '^lxSelect'],
            templateUrl: 'select-selected.html',
            link: link,
            controller: LxSelectSelectedController,
            controllerAs: 'lxSelectSelected',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrls, transclude)
        {
            ctrls[0].setParentController(ctrls[1]);

            transclude(scope, function(clone)
            {
                var template = '';

                for (var i = 0; i < clone.length; i++)
                {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[1].registerSelectedTemplate(template);
            });
        }
    }

    function LxSelectSelectedController()
    {
        var lxSelectSelected = this;

        lxSelectSelected.clearModel = clearModel;
        lxSelectSelected.setParentController = setParentController;
        lxSelectSelected.removeSelected = removeSelected;

        ////////////

        function clearModel(_event)
        {
            _event.stopPropagation();

            lxSelectSelected.parentCtrl.ngModel = undefined;
            lxSelectSelected.parentCtrl.unconvertedModel = undefined;
        }

        function setParentController(_parentCtrl)
        {
            lxSelectSelected.parentCtrl = _parentCtrl;
        }

        function removeSelected(_selected, _event)
        {
            _event.stopPropagation();

            lxSelectSelected.parentCtrl.unselect(_selected);
        }
    }

    function lxSelectChoices()
    {
        return {
            restrict: 'E',
            require: ['lxSelectChoices', '^lxSelect'],
            templateUrl: 'select-choices.html',
            link: link,
            controller: LxSelectChoicesController,
            controllerAs: 'lxSelectChoices',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrls, transclude)
        {
            ctrls[0].setParentController(ctrls[1]);

            transclude(scope, function(clone)
            {
                var template = '';

                for (var i = 0; i < clone.length; i++)
                {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[1].registerChoiceTemplate(template);
            });
        }
    }

    LxSelectChoicesController.$inject = ['$scope', '$timeout', '$window'];

    function LxSelectChoicesController($scope, $timeout, $window)
    {
        var lxSelectChoices = this;
        var timer;

        lxSelectChoices.isArray = isArray;
        lxSelectChoices.setParentController = setParentController;

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

        ////////////

        function isArray(choices)
        {
            choices = (angular.isUndefined(choices)) ? lxSelectChoices.parentCtrl.choices : choices;

            return angular.isArray(choices);
        }

        function setParentController(_parentCtrl)
        {
            lxSelectChoices.parentCtrl = _parentCtrl;

            $scope.$watch(function()
            {
                return lxSelectChoices.parentCtrl.ngModel;
            }, function(newModel, oldModel)
            {
                timer = $timeout(function()
                {
                    if (newModel !== oldModel && angular.isDefined(lxSelectChoices.parentCtrl.ngChange))
                    {
                        lxSelectChoices.parentCtrl.ngChange(
                        {
                            newValue: newModel,
                            oldValue: oldModel
                        });
                    }

                    if (angular.isDefined(lxSelectChoices.parentCtrl.modelToSelection) || angular.isDefined(lxSelectChoices.parentCtrl.selectionToModel))
                    {
                        toSelection();
                    }
                });
            }, true);

            lxSelectChoices.parentCtrl.choicesViewSize = $window.innerWidth < 980 ? 'small' : 'large';

            angular.element($window).on('resize', function onResize(evt) {
                if (evt.target.innerWidth < 980) {
                    lxSelectChoices.parentCtrl.choicesViewSize = 'small';
                } else {
                    lxSelectChoices.parentCtrl.choicesViewSize = 'large';
                }
            });
        }

        function toSelection()
        {
            if (lxSelectChoices.parentCtrl.multiple)
            {
                lxSelectChoices.parentCtrl.unconvertedModel = [];

                angular.forEach(lxSelectChoices.parentCtrl.ngModel, function(item)
                {
                    lxSelectChoices.parentCtrl.modelToSelection(
                    {
                        data: item,
                        callback: function(resp)
                        {
                            lxSelectChoices.parentCtrl.unconvertedModel.push(resp);
                        }
                    });
                });
            }
            else
            {
                lxSelectChoices.parentCtrl.modelToSelection(
                {
                    data: lxSelectChoices.parentCtrl.ngModel,
                    callback: function(resp)
                    {
                        lxSelectChoices.parentCtrl.unconvertedModel = resp;
                    }
                });
            }
        }
    }
})();
