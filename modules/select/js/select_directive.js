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
                choices: '=?lxChoices',
                customStyle: '@?lxCustomStyle',
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
                valid: '=?lxValid'
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

    LxSelectController.$inject = ['$interpolate', '$sce'];

    function LxSelectController($interpolate, $sce)
    {
        var lxSelect = this;
        var choiceTemplate;
        var selectedTemplate;

        lxSelect.displayChoice = displayChoice;
        lxSelect.displaySelected = displaySelected;
        lxSelect.displaySubheader = displaySubheader;
        lxSelect.getSelectedModel = getSelectedModel;
        lxSelect.registerChoiceTemplate = registerChoiceTemplate;
        lxSelect.registerSelectedTemplate = registerSelectedTemplate;
        lxSelect.select = select;
        lxSelect.unselect = unselect;

        lxSelect.ngModel = angular.isUndefined(lxSelect.ngModel) && lxSelect.multiple ? [] : lxSelect.ngModel;
        lxSelect.unconvertedModel = lxSelect.multiple ? [] : undefined;

        ////////////

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
                        lxSelect.ngModel.splice(lxSelect.ngModel.indexOf(resp), 1);
                    }
                });

                lxSelect.unconvertedModel.splice(lxSelect.unconvertedModel.indexOf(_choice), 1);
            }
            else
            {
                lxSelect.ngModel.splice(lxSelect.ngModel.indexOf(_choice), 1);
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
                    template += clone[i].outerHTML || '';
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
                    template += clone[i].outerHTML || '';
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
        lxSelectChoices.isSelected = isSelected;
        lxSelectChoices.setParentController = setParentController;
        lxSelectChoices.toggleChoice = toggleChoice;
        lxSelectChoices.updateFilter = updateFilter;

        lxSelectChoices.filterModel = undefined;

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

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

        function isArray()
        {
            return angular.isArray(lxSelectChoices.parentCtrl.choices);
        }

        function isSelected(_choice)
        {
            if (lxSelectChoices.parentCtrl.multiple && angular.isDefined(lxSelectChoices.parentCtrl.getSelectedModel()))
            {
                return arrayObjectIndexOf(lxSelectChoices.parentCtrl.getSelectedModel(), _choice) !== -1;
            }
            else if (angular.isDefined(lxSelectChoices.parentCtrl.getSelectedModel()))
            {
                return angular.equals(lxSelectChoices.parentCtrl.getSelectedModel(), _choice);
            }
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

        function toggleChoice(_choice, _event)
        {
            if (lxSelectChoices.parentCtrl.multiple)
            {
                _event.stopPropagation();
            }

            if (lxSelectChoices.parentCtrl.multiple && isSelected(_choice))
            {
                lxSelectChoices.parentCtrl.unselect(_choice);
            }
            else
            {
                lxSelectChoices.parentCtrl.select(_choice);
            }
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

        function updateFilter()
        {
            if (angular.isDefined(lxSelectChoices.parentCtrl.filter))
            {
                lxSelectChoices.parentCtrl.filter(
                {
                    newValue: lxSelectChoices.filterModel
                });
            }
        }
    }
})();
