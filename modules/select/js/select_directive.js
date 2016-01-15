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
                choices: '=lxChoices',
                customStyle: '@?lxCustomStyle',
                displayFilter: '=lxDisplayFilter',
                error: '=?lxError',
                filter: '&?lxFilter',
                fixedLabel: '=?lxFixedLabel',
                helper: '=?lxHelper',
                helperMessage: '@?lxHelperMessage',
                label: '@lxLabel',
                loading: '=?lxLoading',
                modelToSelection: '&?lxModelToSelection',
                multiple: '=?lxMultiple',
                ngChange: '&?',
                ngDisabled: '=?',
                ngModel: '=',
                selectionToModel: '&?lxSelectionToModel',
                valid: '=?lxValid'
            },
            controller: LxSelectController,
            controllerAs: 'lxSelect',
            bindToController: true,
            replace: true,
            transclude: true
        };
    }

    LxSelectSelectedController.$inject = ['$interpolate', '$sce'];

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
            if (angular.isDefined(lxSelect.modelToSelection) || angular.isDefined(lxSelect.selectionToModel))
            {
                lxSelect.selectionToModel()(_choice, function(resp)
                {
                    if (lxSelect.multiple)
                    {
                        lxSelect.ngModel.push(resp);
                    }
                    else
                    {
                        lxSelect.ngModel = resp;
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
            if (angular.isDefined(lxSelect.modelToSelection) || angular.isDefined(lxSelect.selectionToModel))
            {
                lxSelect.selectionToModel()(_choice, function(resp)
                {
                    lxSelect.ngModel.splice(lxSelect.ngModel.indexOf(resp), 1);
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

    LxSelectSelectedController.$inject = ['$scope'];

    function LxSelectChoicesController($scope)
    {
        var lxSelectChoices = this;

        lxSelectChoices.isArray = isArray;
        lxSelectChoices.isSelected = isSelected;
        lxSelectChoices.setParentController = setParentController;
        lxSelectChoices.toggleChoice = toggleChoice;
        lxSelectChoices.updateFilter = updateFilter;

        lxSelectChoices.filterModel = undefined;

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
                if (newModel !== oldModel && angular.isDefined(lxSelectChoices.parentCtrl.ngChange))
                {
                    lxSelectChoices.parentCtrl.ngChange()(newModel, oldModel);
                }

                if (angular.isDefined(lxSelectChoices.parentCtrl.modelToSelection) || angular.isDefined(lxSelectChoices.parentCtrl.selectionToModel))
                {
                    toSelection();
                }
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
                    lxSelectChoices.parentCtrl.modelToSelection()(item, function(resp)
                    {
                        lxSelectChoices.parentCtrl.unconvertedModel.push(resp);
                    });
                });
            }
            else
            {
                lxSelectChoices.parentCtrl.modelToSelection()(lxSelectChoices.parentCtrl.ngModel, function(resp)
                {
                    lxSelectChoices.parentCtrl.unconvertedModel = resp;
                });
            }
        }

        function updateFilter()
        {
            if (angular.isDefined(lxSelectChoices.parentCtrl.filter))
            {
                lxSelectChoices.parentCtrl.filter()(lxSelectChoices.filterModel);
            }
        }
    }
})();