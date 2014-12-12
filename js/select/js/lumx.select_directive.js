/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.select', [])
    .controller('LxSelectController', ['$scope', '$compile', '$filter', '$interpolate', '$sce', '$timeout',
                                       function($scope, $compile, $filter, $interpolate, $sce, $timeout)
    {
        var self = this,
            newModel = false,
            newSelection = true,
            modelToSelectionDefined = false,
            selectionToModelDefined = false;

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
        this.init = function(element, attrs)
        {
            $scope.multiple = angular.isDefined(attrs.multiple);
            $scope.tree = angular.isDefined(attrs.tree);
            modelToSelectionDefined = angular.isDefined(attrs.modelToSelection);
            selectionToModelDefined = angular.isDefined(attrs.selectionToModel);
        };

        this.registerTransclude = function(transclude)
        {
            $scope.data.selectedTransclude = transclude;
        };

        this.getScope = function()
        {
            return $scope;
        };

        // Selection management
        function select(choice)
        {
            if ($scope.multiple)
            {
                if (arrayObjectIndexOf($scope.data.selected, choice) === -1)
                {
                    $scope.data.selected.push(choice);
                }
            }
            else
            {
                $scope.data.selected = [choice];
            }
        }

        function unselect(element, event)
        {
            if (!$scope.allowClear && !$scope.multiple)
            {
                return;
            }

            if (angular.isDefined(event) && !$scope.multiple)
            {
                event.stopPropagation();
            }

            var index = arrayObjectIndexOf($scope.data.selected, element);
            if (index !== -1)
            {
                $scope.data.selected.splice(index, 1);
            }
        }

        function toggle(choice, event)
        {
            if (angular.isDefined(event) && $scope.multiple)
            {
                event.stopPropagation();
            }

            if ($scope.multiple && isSelected(choice))
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
            return angular.isDefined($scope.data.selected) && arrayObjectIndexOf($scope.data.selected, choice) !== -1;
        }

        function hasNoResults()
        {
            return angular.isUndefined($scope.choices) || $filter('filter')($scope.choices, $scope.data.filter).length === 0;
        }

        function filterNeeded()
        {
            return angular.isDefined($scope.minLength) && $scope.data.filter.length < $scope.minLength;
        }

        function isHelperVisible()
        {
            return $scope.loading !== 'true' && (filterNeeded() || (hasNoResults() && !filterNeeded()));
        }

        function isChoicesVisible()
        {
            return $scope.loading !== 'true' && !hasNoResults() && !filterNeeded();
        }

        /**
         * Return the array of selected elements. Always return an array (ie. returns an empty array in case
         * selected list is undefined in the scope).
         */
        function getSelectedElements()
        {
            return angular.isDefined($scope.data.selected) ? $scope.data.selected : [];
        }

        function getSelectedTemplate()
        {
            return $sce.trustAsHtml($scope.data.selectedTemplate);
        }

        function convertValue(newValue, conversion, defaultValue, callback)
        {
            var convertedData = angular.copy(defaultValue);
            var loading = [];

            if (!newValue)
            {
                callback(defaultValue);
                return;
            }

            $scope.data.loading = true;
            if ($scope.multiple)
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
                                    $scope.data.loading = false;
                                    callback(convertedData);
                                }
                            });
                        };
                    };

                    for (var idx in newValue)
                    {
                        loading.push(idx);

                        // Call the method
                        conversion({
                            data: newValue[idx],
                            callback: convertionCallback(idx)
                        });
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
                    $scope.data.loading = true;
                    conversion({
                        data: newValue,
                        callback: function(data)
                        {
                            $scope.data.loading = false;
                            callback(data);
                        }
                    });
                }
                else
                {
                    callback(newValue);
                }
            }
        }

        // Watchers
        $scope.$watch('model', function(newValue)
        {
            if (newModel)
            {
                newModel = false;
                return;
            }

            convertValue(newValue,
                         modelToSelectionDefined ? $scope.modelToSelection : undefined,
                         undefined,
                         function(newConvertedValue)
            {
                newSelection = true;

                var value = newConvertedValue !== undefined ? angular.copy(newConvertedValue) : [];
                if (!$scope.multiple)
                {
                    value = newConvertedValue !== undefined ? [angular.copy(newConvertedValue)] : [];
                }

                $scope.data.selected = value;
            });
        }, true);

        $scope.$watch('data.selected', function(newValue)
        {
            if (angular.isDefined(newValue) && angular.isDefined($scope.data.selectedTransclude))
            {
                var newScope = $scope.$new();
                $scope.data.selectedTemplate = '';

                angular.forEach(newValue, function(selectedElement)
                {
                    newScope.$selected = selectedElement;

                    $scope.data.selectedTransclude(newScope, function(clone)
                    {
                        var div = angular.element('<div/>'),
                        element = $compile(clone)(newScope),
                        content = $interpolate(clone.html())(newScope);

                        element.html(content);

                        div.append(element);

                        if ($scope.multiple)
                        {
                            div.find('span').addClass('lx-select__tag');
                        }

                        $scope.data.selectedTemplate += div.html();
                    });
                });
            }

            if (newSelection)
            {
                newSelection = false;
                return;
            }

            var data = newValue;
            if(!$scope.multiple)
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
                         selectionToModelDefined ? $scope.selectionToModel : undefined,
                         $scope.multiple ? [] : undefined,
                         function(newConvertedValue)
            {
                newModel = true;

                $scope.change({ newValue: angular.copy(newConvertedValue), oldValue: angular.copy($scope.model) });
                $scope.model = angular.copy(newConvertedValue);
            });
        }, true);

        $scope.$watch('data.filter', function(newValue, oldValue)
        {
            if(angular.isUndefined($scope.minLength) || (newValue && $scope.minLength <= newValue.length))
            {
                $scope.filter({ newValue: newValue, oldValue: oldValue });
            }
        });

        // Public API
        $scope.select = select;
        $scope.unselect = unselect;
        $scope.toggle = toggle;
        $scope.isChoicesVisible = isChoicesVisible;
        $scope.isHelperVisible = isHelperVisible;
        $scope.isSelected = isSelected;
        $scope.filterNeeded = filterNeeded;
        $scope.getSelectedElements = getSelectedElements;
        $scope.getSelectedTemplate = getSelectedTemplate;
        $scope.hasNoResults = hasNoResults;
    }])
    .directive('lxSelect', function()
    {
        return {
            restrict: 'E',
            controller: 'LxSelectController',
            scope: {
                model: '=?',
                placeholder: '@',
                choices: '=',
                loading: '@',
                minLength: '@',
                allowClear: '@',
                change: '&', // Parameters: newValue, oldValue
                filter: '&', // Parameters: newValue, oldValue
                selectionToModel: '&', // Parameters: data, callback
                modelToSelection: '&' // Parameters: data, callback
            },
            templateUrl: 'lumx.select.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element, attrs);
                scope.data = {
                    filter: '',
                    selected: [],
                    loading: false
                };
            }
        };
    })
    .directive('lxSelectSelected', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            templateUrl: 'lumx.select_selected.html',
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude)
            {
                ctrl.registerTransclude(transclude);
                scope.data = ctrl.getScope();
            }
        };
    })
    .directive('lxSelectChoices', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            templateUrl: 'lumx.select_choices.html',
            transclude: true,
            link: function(scope, element, attrs, ctrl)
            {
                scope.data = ctrl.getScope();
            }
        };
    });
