/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.select', [])
    .controller('LxSelectController', ['$scope', '$compile', '$interpolate', '$sce', function($scope, $compile, $interpolate, $sce)
    {
        var self = this;

        this.init = function(element, attrs)
        {
            $scope.multiple = angular.isDefined(attrs.multiple);
            $scope.tree = angular.isDefined(attrs.tree);
        };

        this.select = function(choice)
        {
            if ($scope.multiple)
            {
                if ($scope.selected.indexOf(choice) === -1)
                {
                    $scope.selected.push(choice);
                }
            }
            else
            {
                $scope.selected = [choice];
            }
        };

        this.unselect = function(element)
        {
            if ($scope.selected.indexOf(element) !== -1)
            {
                $scope.selected.splice($scope.selected.indexOf(element), 1);
            }
        };

        this.selectedElements = function()
        {
            return angular.isDefined($scope.selected) ? $scope.selected : [];
        };

        this.getPlaceholder = function()
        {
            return $scope.placeholder;
        };

        this.getSelectedTemplate = function()
        {
            return $sce.trustAsHtml($scope.selectedTemplate);
        };

        this.isMultiple = function()
        {
            return $scope.multiple;
        };

        this.isTree = function()
        {
            return $scope.tree;
        };

        $scope.$watch('selected', function(newValue)
        {
            if (angular.isDefined(newValue) && angular.isDefined(self.selectedTransclude))
            {
                var newScope = $scope.$new();

                $scope.selectedTemplate = '';

                angular.forEach(newValue, function(selectedElement)
                {
                    newScope.$selected = selectedElement;

                    self.selectedTransclude(newScope, function(clone)
                    {
                        var div = angular.element('<div/>'),
                            element = $compile(clone)(newScope),
                            content = $interpolate(clone.html())(newScope);

                        element.html(content);

                        div.append(element);

                        if (self.isMultiple())
                        {
                            div.find('span').addClass('lx-select__tag');
                        }

                        $scope.selectedTemplate += div.html();
                    });
                });

                // Exec function callback if set
                if(angular.isDefined($scope.change)) {
                    $scope.change();
                }
            }
        }, true);
    }])
    .directive('lxSelect', function()
    {
        return {
            restrict: 'E',
            controller: 'LxSelectController',
            scope: {
                selected: '=',
                placeholder: '=',
                change: '&change'
            },
            templateUrl: 'lumx.select.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element, attrs);
            }
        };
    })
    .directive('lxSelectSelected', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            scope: {},
            templateUrl: 'lumx.select_selected.html',
            transclude: true,
            controller: function($scope)
            {
                $scope.unselect = function(element)
                {
                    $scope.selectController.unselect(element);
                };
            },
            link: function(scope, element, attrs, ctrl, transclude)
            {
                scope.selectController = ctrl;

                ctrl.selectedTransclude = transclude;
            }
        };
    })
    .directive('lxSelectChoices', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            scope: {
                choices: '='
            },
            templateUrl: 'lumx.select_choices.html',
            transclude: true,
            controller: function($scope)
            {
                $scope.select = function(choice, event)
                {
                    if (angular.isDefined(event) && $scope.selectController.isMultiple())
                    {
                        event.stopPropagation();
                    }

                    if ($scope.selectController.isMultiple())
                    {
                        if ($scope.isSelected(choice))
                        {
                            $scope.selectController.unselect(choice);
                        }
                        else
                        {
                            $scope.selectController.select(choice);
                        }
                    }
                    else
                    {
                        $scope.selectController.select(choice);
                    }
                };

                $scope.isSelected = function(choice)
                {
                    return $scope.selectController.selectedElements().indexOf(choice) > -1;
                };
            },
            link: function(scope, element, attrs, ctrl)
            {
                scope.selectController = ctrl;
            }
        };
    });
