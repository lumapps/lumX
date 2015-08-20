/* global angular */
'use strict'; // jshint ignore:line

angular.module('lumx.select', [])
    .filter('filterChoices', ['$filter', function($filter)
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
    }])
    .controller('LxSelectController', ['$scope', '$filter', '$interpolate', '$sce', '$timeout',
                                       function($scope, $filter, $interpolate, $sce, $timeout)
    {
        var newModel = false,
            newSelection = true,
            newScope;

        $scope.lxSelectData = {
            filter: '',
            selected: [],
            loading: false
        };

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


        // Link methods
        this.registerTransclude = function(transclude)
        {
            $scope.lxSelectData.selectedTransclude = transclude;
        };

        this.getScope = function()
        {
            return $scope;
        };

        // Selection management
        function select(choice)
        {
            newSelection = false;
            if ($scope.lxSelectMultiple)
            {
                if (arrayObjectIndexOf($scope.lxSelectData.selected, choice) === -1)
                {
                    $scope.lxSelectData.selected.push(choice);
                }
            }
            else
            {
                $scope.lxSelectData.selected = [choice];
            }
        }

        function unselect(element, event, stopEvent)
        {
            newSelection = false;
            if (!$scope.lxSelectAllowClear && !$scope.lxSelectMultiple)
            {
                return;
            }

            if (angular.isDefined(event) && (!$scope.lxSelectMultiple || stopEvent))
            {
                event.stopPropagation();
            }

            var index = arrayObjectIndexOf($scope.lxSelectData.selected, element);
            if (index !== -1)
            {
                $scope.lxSelectData.selected.splice(index, 1);
            }
        }

        function toggle(choice, event)
        {
            if (angular.isDefined(event) && $scope.lxSelectMultiple)
            {
                event.stopPropagation();
            }

            if ($scope.lxSelectMultiple && isSelected(choice))
            {
                unselect(choice);
            }
            else
            {
                select(choice);
            }
        }

        // Getters
        function isSelected(choice)
        {
            return angular.isDefined($scope.lxSelectData.selected) && arrayObjectIndexOf($scope.lxSelectData.selected, choice) !== -1;
        }

        function hasNoResults()
        {
            return angular.isUndefined($scope.lxSelectChoices()) || $filter('filterChoices')($scope.lxSelectChoices(), $scope.lxSelectFilter, $scope.lxSelectData.filter).length === 0;
        }

        function filterNeeded()
        {
            return angular.isDefined($scope.lxSelectMinLength) && angular.isDefined($scope.lxSelectData.filter) && $scope.lxSelectData.filter.length < $scope.lxSelectMinLength;
        }

        function isHelperVisible()
        {
            return $scope.lxSelectLoading !== 'true' && (filterNeeded() || (hasNoResults() && !filterNeeded()));
        }

        function isChoicesVisible()
        {
            return $scope.lxSelectLoading !== 'true' && !hasNoResults() && !filterNeeded();
        }

        function isChoicesArray()
        {
            return angular.isArray($scope.lxSelectChoices());
        }

        function trust(data)
        {
            return $sce.trustAsHtml(data);
        }

        /**
         * Return the array of selected elements. Always return an array (ie. returns an empty array in case
         * selected list is undefined in the scope).
         */
        function getSelectedElements()
        {
            return angular.isDefined($scope.lxSelectData.selected) ? $scope.lxSelectData.selected : [];
        }

        function convertValue(newValue, conversion, callback)
        {
            var convertedData = $scope.lxSelectMultiple ? [] : undefined;
            var loading = [];

            if (!newValue || ($scope.lxSelectMultiple && newValue.length === 0))
            {
                callback(convertedData);
                return;
            }

            $scope.lxSelectData.loading = true;
            if ($scope.lxSelectMultiple)
            {
                if (angular.isDefined(conversion))
                {
                    var callbackCalled = false;
                    var convertionCallback = function(idx)
                    {
                        return function(data)
                        {
                            // Timeout to be sure for the callbacks to be executed after the for loop is finished
                            $timeout(function()
                            {
                                // Add the result in the selected list and remove the index from the loading list
                                if (data !== undefined)
                                {
                                    convertedData.splice(idx, 0, data);
                                }
                                loading.splice(loading.indexOf(idx), 1);

                                // If the loading list is empty, update the $scope and stop the loading animation
                                if (loading.length === 0 && !callbackCalled)
                                {
                                    callbackCalled = true;
                                    $scope.lxSelectData.loading = false;
                                    callback(convertedData);
                                }
                            });
                        };
                    };

                    for (var idx in newValue)
                    {
                        loading.push(idx);

                        // Call the method
                        conversion(newValue[idx], convertionCallback(idx));
                    }
                }
                else
                {
                    callback(newValue);
                }
            }
            else
            {
                if (angular.isDefined(conversion))
                {
                    $scope.lxSelectData.loading = true;
                    conversion(newValue, function(data)
                    {
                        $scope.lxSelectData.loading = false;
                        callback(data);
                    });
                }
                else
                {
                    callback(newValue);
                }
            }
        }

        // Watchers
        $scope.$watch('lxSelectNgModel.$modelValue', function(newValue)
        {
            if (newModel)
            {
                newModel = false;
                return;
            }

            convertValue(newValue,
                         $scope.lxSelectModelToSelection,
                         function(newConvertedValue)
            {
                newSelection = true;

                var value = newConvertedValue !== undefined ? angular.copy(newConvertedValue) : [];
                if (!$scope.lxSelectMultiple)
                {
                    value = newConvertedValue !== undefined ? [angular.copy(newConvertedValue)] : [];
                }

                $scope.lxSelectData.selected = value;
                $scope.$selected = !$scope.lxSelectMultiple && $scope.lxSelectGetSelectedElements().length === 1 ? $scope.lxSelectGetSelectedElements()[0] : undefined;
            });
        });

        $scope.$watch('lxSelectData.selected', function(newValue)
        {
            if (angular.isDefined(newValue) && angular.isDefined($scope.lxSelectData.selectedTransclude))
            {
                if (newScope)
                {
                    newScope.$destroy();
                }

                newScope = $scope.$new();
                $scope.lxSelectData.selectedTemplate = { html: '', selected: {} };

                angular.forEach(newValue, function(selectedElement, key)
                {
                    newScope.$selected = selectedElement;
                    $scope.lxSelectData.selectedTemplate.selected[key] = selectedElement;

                    $scope.lxSelectData.selectedTransclude(newScope, function(clone)
                    {
                        var div = angular.element('<div/>');
                        var content = $interpolate(clone.html())(newScope);
                        clone.html(content);

                        if ($scope.lxSelectMultiple)
                        {
                            if ($scope.lxSelectAllowClear || newValue.length > 1)
                            {
                                var deleteButton = angular.element('<i class="lx-select__delete-button" ng-click="lxSelectUnselect(lxSelectTranscludeSelected[' + key + '], $event, true)"></i>');
                                clone.append(deleteButton);
                            }
                        }

                        div.append(clone);

                        if ($scope.lxSelectMultiple)
                        {
                            div.find('span').addClass('lx-select__tag');
                        }

                        $scope.lxSelectData.selectedTemplate.html += div.html();
                    });
                });
            }

            if (newSelection)
            {
                newSelection = false;
                return;
            }

            var data = newValue;
            if(!$scope.lxSelectMultiple)
            {
                if (newValue)
                {
                    data = newValue[0];
                }
                else
                {
                    data = undefined;
                }
            }

            convertValue(data,
                         $scope.lxSelectSelectionToModel,
                         function(newConvertedValue)
            {
                newModel = true;

                if ($scope.lxSelectChange)
                {
                    $scope.lxSelectChange({ newValue: angular.copy(newConvertedValue), oldValue: angular.copy($scope.lxSelectNgModel.$modelValue) });
                }
                $scope.lxSelectNgModel.$setViewValue(angular.copy(newConvertedValue));
                $scope.$selected = !$scope.lxSelectMultiple && $scope.lxSelectGetSelectedElements().length === 1 ? $scope.lxSelectGetSelectedElements()[0] : undefined;
            });
        }, true);

        $scope.$watch('lxSelectData.filter', function(newValue, oldValue)
        {
            if (newValue !== oldValue && (angular.isUndefined($scope.lxSelectMinLength) || (newValue && $scope.lxSelectMinLength <= newValue.length)))
            {
                if ($scope.lxSelectFilter)
                {
                    $scope.lxSelectFilter(newValue, oldValue);
                }
            }
        });

        // Public API
        $scope.lxSelectSelect = select;
        $scope.lxSelectUnselect = unselect;
        $scope.lxSelectToggle = toggle;
        $scope.lxSelectIsChoicesVisible = isChoicesVisible;
        $scope.lxSelectIsHelperVisible = isHelperVisible;
        $scope.lxSelectIsSelected = isSelected;
        $scope.lxSelectFilterNeeded = filterNeeded;
        $scope.lxSelectGetSelectedElements = getSelectedElements;
        $scope.lxSelectHasNoResults = hasNoResults;
        $scope.lxSelectIsChoicesArray = isChoicesArray;
        $scope.lxSelectTrust = trust;
    }])
    .directive('lxSelect', function()
    {
        return {
            restrict: 'AE',
            controller: 'LxSelectController',
            require: '?ngModel',
            scope: true,
            templateUrl: 'select.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ngModel)
            {
                scope.lxSelectMultiple = angular.isDefined(attrs.multiple);
                scope.lxSelectFloatingLabel = angular.isDefined(attrs.floatingLabel);
                scope.lxSelectTree = angular.isDefined(attrs.tree);
                scope.lxSelectNgModel = ngModel;

                // Default values
                scope.lxSelectCustom = undefined;
                scope.lxSelectPlaceholder = '';
                scope.lxSelectLoading = '';
                scope.lxSelectMinLength = undefined;
                scope.lxSelectAllowClear = '';
                scope.lxSelectChoices = function() { return []; };
                scope.lxSelectDisabled = undefined;
                scope.lxSelectError = undefined;
                scope.lxSelectValid = undefined;
                scope.lxSelectChange = undefined;
                scope.lxSelectFilter = undefined;
                scope.lxSelectSelectionToModel = undefined;
                scope.lxSelectModelToSelection = undefined;

                attrs.$observe('custom', function(newValue)
                {
                    scope.lxSelectCustom = newValue;
                });

                attrs.$observe('placeholder', function(newValue)
                {
                    scope.lxSelectPlaceholder = newValue;
                });

                attrs.$observe('loading', function(newValue)
                {
                    scope.lxSelectLoading = newValue;
                });

                attrs.$observe('minLength', function(newValue)
                {
                    scope.lxSelectMinLength = newValue;
                });

                attrs.$observe('allowClear', function(newValue)
                {
                    scope.lxSelectAllowClear = newValue;
                });

                attrs.$observe('disabled', function(newValue)
                {
                    scope.lxSelectDisabled = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('error', function(newValue)
                {
                    scope.lxSelectError = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('valid', function(newValue)
                {
                    scope.lxSelectValid = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('choices', function(newValue)
                {
                    scope.lxSelectChoices = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('change', function(newValue)
                {
                    scope.lxSelectChange = function(newData, oldData)
                    {
                        return scope.$eval(newValue, { newValue: newData, oldValue: oldData });
                    };
                });

                attrs.$observe('filter', function(newValue)
                {
                    scope.lxSelectFilter = function(newFilter, oldFilter)
                    {
                        return scope.$eval(newValue, { newValue: newFilter, oldValue: oldFilter });
                    };
                });

                var selectionToModel = function(newValue)
                {
                    scope.lxSelectSelectionToModel = function(selection, callback)
                    {
                        return scope.$eval(newValue, { data: selection, callback: callback });
                    };
                };

                if (angular.isDefined(attrs.selectionToModel))
                {
                    selectionToModel(attrs.selectionToModel);
                }

                attrs.$observe('selectionToModel', selectionToModel);

                var modelToSelection = function(newValue)
                {
                    scope.lxSelectModelToSelection = function(model, callback)
                    {
                        return scope.$eval(newValue, { data: model, callback: callback });
                    };
                };

                if (angular.isDefined(attrs.modelToSelection))
                {
                    modelToSelection(attrs.modelToSelection);
                }

                attrs.$observe('modelToSelection', modelToSelection);
            }
        };
    })
    .directive('lxSelectSelected', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            templateUrl: 'select-selected.html',
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude)
            {
                ctrl.registerTransclude(transclude);
            }
        };
    })
    .directive('lxSelectChoices', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            templateUrl: 'select-choices.html',
            transclude: true
        };
    })
    .directive('lxSelectChoicesSelected', ['$compile', '$parse', function($compile, $parse)
    {
        return {
            restrict: 'E',
            link: function(scope, element, attrs)
            {
                scope.$watch(attrs.content, function()
                {
                    var data = scope.$eval(attrs.content);

                    scope.lxSelectTranscludeSelected = data.selected;

                    element.html(data.html);
                    $compile(element.contents())(scope);
                }, true);
            }
        };
    }]);
