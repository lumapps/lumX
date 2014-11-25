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

        $scope.select = function(choice)
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

        $scope.unselect = function(element)
        {
            if ($scope.selected.indexOf(element) !== -1)
            {
                $scope.selected.splice($scope.selected.indexOf(element), 1);
            }
        };

        $scope.selectedElements = function()
        {
            return angular.isDefined($scope.selected) ? $scope.selected : [];
        };

        $scope.getSelectedTemplate = function()
        {
            return $sce.trustAsHtml($scope.selectedTemplate);
        };

        $scope.toggle = function(choice, event)
        {
            if (angular.isDefined(event) && $scope.multiple)
            {
                event.stopPropagation();
            }

            if ($scope.multiple)
            {
                if ($scope.isSelected(choice))
                {
                    $scope.unselect(choice);
                }
                else
                {
                    $scope.select(choice);
                }
            }
            else
            {
                $scope.select(choice);
            }
        };

        $scope.isSelected = function(choice)
        {
            return _.indexOf($scope.selectedElements(), choice) > -1;
        };

        $scope.$watch('selected', function(newValue)
        {
            if (angular.isDefined(newValue) && angular.isDefined($scope.selectedTransclude))
            {
                var newScope = $scope.$new();

                $scope.selectedTemplate = '';

                angular.forEach(newValue, function(selectedElement)
                {
                    newScope.$selected = selectedElement;

                    $scope.selectedTransclude(newScope, function(clone)
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

                        $scope.selectedTemplate += div.html();
                    });
                });

                // Exec function callback if set
                if(angular.isDefined($scope.change))
                {
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
                choices: '=',
                change: '&'
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
            templateUrl: 'lumx.select_selected.html',
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude)
            {
                scope.$parent.$parent.selectedTransclude = transclude;
            }
        };
    })
    .directive('lxSelectChoices', function()
    {
        return {
            restrict: 'E',
            require: '^lxSelect',
            templateUrl: 'lumx.select_choices.html',
            transclude: true
        };
    });
