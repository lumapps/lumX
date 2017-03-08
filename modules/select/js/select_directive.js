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
                customStyle: '=?lxCustomStyle',
                displayFilter: '=?lxDisplayFilter',
                error: '=?lxError',
                filter: '&?lxFilter',
                fixedLabel: '=?lxFixedLabel',
                helper: '=?lxHelper',
                helperMessage: '@?lxHelperMessage',
                label: '@?lxLabel',
                loading: '=?lxLoading',
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
        }
    }

    LxSelectController.$inject = ['$interpolate', '$element', '$filter', '$sce', 'LxDropdownService', 'LxUtils'];

    function LxSelectController($interpolate, $element, $filter, $sce, LxDropdownService, LxUtils)
    {
        var lxSelect = this;
        var choiceTemplate;
        var selectedTemplate;

        lxSelect.displayChoice = displayChoice;
        lxSelect.displaySelected = displaySelected;
        lxSelect.displaySubheader = displaySubheader;
        lxSelect.getFilteredChoices = getFilteredChoices;
        lxSelect.getSelectedModel = getSelectedModel;
        lxSelect.isSelected = isSelected;
        lxSelect.keyEvent = keyEvent;
        lxSelect.registerChoiceTemplate = registerChoiceTemplate;
        lxSelect.registerSelectedTemplate = registerSelectedTemplate;
        lxSelect.select = select;
        lxSelect.toggleChoice = toggleChoice;
        lxSelect.unselect = unselect;
        lxSelect.updateFilter = updateFilter;
        lxSelect.helperDisplayable = helperDisplayable;

        lxSelect.activeChoiceIndex = -1;
        lxSelect.activeSelectedIndex = -1;
        lxSelect.uuid = LxUtils.generateUUID();
        lxSelect.filterModel = undefined;
        lxSelect.ngModel = angular.isUndefined(lxSelect.ngModel) && lxSelect.multiple ? [] : lxSelect.ngModel;
        lxSelect.unconvertedModel = lxSelect.multiple ? [] : undefined;
        lxSelect.viewMode = angular.isUndefined(lxSelect.viewMode) ? 'field' : 'chips';

        ////////////
        
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

        function displayChoice(_choice)
        {
            var choiceScope = {
                $choice: _choice
            };

            return $sce.trustAsHtml($interpolate(choiceTemplate)(choiceScope));
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
            return $sce.trustAsHtml(_subheader);
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

        function keyEvent(_event)
        {
            if (_event.keyCode !== 8)
            {
                lxSelect.activeSelectedIndex = -1;
            }

            if (!LxDropdownService.isOpen('dropdown-' + lxSelect.uuid))
            {
                lxSelect.activeChoiceIndex = -1;
            }

            switch (_event.keyCode) {
                case 8:
                    keyRemove();
                    break;

                case 13:
                    keySelect();
                    _event.preventDefault();
                    break;

                case 38:
                    keyUp();
                    _event.preventDefault();
                    break;

                case 40:
                    keyDown();
                    _event.preventDefault();
                    break;
            }
        }

        function keyDown()
        {
            var filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

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

        function keyRemove()
        {
            if (lxSelect.filterModel || !lxSelect.getSelectedModel().length)
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

        function keySelect()
        {
            var filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

            if (filteredChoices.length && filteredChoices[lxSelect.activeChoiceIndex])
            {
                toggleChoice(filteredChoices[lxSelect.activeChoiceIndex]);
            }
            else if (lxSelect.filterModel && lxSelect.allowNewValue)
            {
                if (angular.isArray(getSelectedModel()))
                {
                    var value = angular.isFunction(lxSelect.newValueTransform) ? lxSelect.newValueTransform(lxSelect.filterModel) : lxSelect.filterModel;
                    var identical = getSelectedModel().some(function (item) {
                        return angular.equals(item, value);
                    });
                    
                    if (!identical)
                    {
                        getSelectedModel().push(value);
                    }
                }
                
                lxSelect.filterModel = undefined;
                
                LxDropdownService.close('dropdown-' + lxSelect.uuid);
            }
        }

        function keyUp()
        {
            var filteredChoices = $filter('filterChoices')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

            if (filteredChoices.length)
            {
                lxSelect.activeChoiceIndex -= 1;

                if (lxSelect.activeChoiceIndex < 0)
                {
                    lxSelect.activeChoiceIndex = filteredChoices.length - 1;
                }
            }

            if (lxSelect.autocomplete)
            {
                LxDropdownService.open('dropdown-' + lxSelect.uuid, '#lx-select-selected-wrapper-' + lxSelect.uuid);
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

        function select(_choice)
        {
            if (lxSelect.multiple && angular.isUndefined(lxSelect.ngModel))
            {
                lxSelect.ngModel = [];
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
            }
        }

        function toggleChoice(_choice, _event)
        {
            if (lxSelect.multiple && !lxSelect.autocomplete)
            {
                _event.stopPropagation();
            }

            if (lxSelect.multiple && isSelected(_choice))
            {
                unselect(_choice);
            }
            else
            {
                select(_choice);
            }

            if (lxSelect.autocomplete)
            {
                lxSelect.activeChoiceIndex = -1;
                lxSelect.filterModel = undefined;

                LxDropdownService.close('dropdown-' + lxSelect.uuid);
            }
        }

        function unselect(_choice)
        {
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
            }
        }

        function updateFilter()
        {
            if (angular.isDefined(lxSelect.filter))
            {
                lxSelect.filter(
                {
                    newValue: lxSelect.filterModel
                });
            }

            if (lxSelect.autocomplete)
            {
                lxSelect.activeChoiceIndex = -1;

                if (lxSelect.filterModel)
                {
                    LxDropdownService.open('dropdown-' + lxSelect.uuid, '#lx-select-selected-wrapper-' + lxSelect.uuid);
                }
                else
                {
                    LxDropdownService.close('dropdown-' + lxSelect.uuid);
                }
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
                return !Object.keys(choices).length;
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

    LxSelectChoicesController.$inject = ['$scope', '$timeout'];

    function LxSelectChoicesController($scope, $timeout)
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

        function isArray()
        {
            return angular.isArray(lxSelectChoices.parentCtrl.choices);
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
