/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.tabs', [])
    .controller('LxTabsController', ['$scope', function($scope)
    {
        var tabs = [],
            indicator;
        
        $scope.activeTab = angular.isUndefined($scope.activeTab) ? 0 : $scope.activeTab;

        this.init = function(element)
        {
            indicator = element.find('.tabs__indicator');
            setIndicatorPosition();
        };

        this.getScope = function()
        {
            return $scope;
        };

        this.addTab = function(heading, active)
        {
            tabs.push({ heading: heading });

            if (active)
            {
                $scope.activeTab = tabs.length - 1;
            }

            return (tabs.length - 1);
        };

        function getTabs()
        {
            return tabs;
        }

        function setActiveTab(index)
        {
            $scope.activeTab = index;
        }

        function setIndicatorPosition(oldTab)
        {
            var direction;

            if ($scope.activeTab > oldTab)
            {
                direction = 'right';
            }
            else
            {
                direction = 'left';
            }

            var indicatorWidth = 100 / tabs.length,
                indicatorLeft = (indicatorWidth * $scope.activeTab),
                indicatorRight = 100 - (indicatorLeft + indicatorWidth);

            if (angular.isUndefined(oldTab))
            {
                indicator.css({
                    left: indicatorLeft + '%',
                    right: indicatorRight  + '%'
                });
            }
            else
            {
                var animationProperties = {
                    duration: 200,
                    easing: 'easeOutQuint'
                };

                if (direction === 'left')
                {
                    indicator.velocity({ 
                        left: indicatorLeft + '%'
                    }, animationProperties);

                    indicator.velocity({ 
                        right: indicatorRight  + '%'
                    }, animationProperties);
                }
                else
                {
                    indicator.velocity({ 
                        right: indicatorRight  + '%'
                    }, animationProperties);

                    indicator.velocity({ 
                        left: indicatorLeft + '%'
                    }, animationProperties);
                }
            }
        }

        $scope.$watch('activeTab', function(newIndex, oldIndex)
        {
            if (newIndex !== oldIndex)
            {
                setIndicatorPosition(oldIndex);
            }
        });

        // Public API
        $scope.getTabs = getTabs;
        $scope.setActiveTab = setActiveTab;
    }])
    .directive('lxTabs', function()
    {
        return {
            restrict: 'E',
            controller: 'LxTabsController',
            templateUrl: 'lumx.tabs.html',
            transclude: true,
            replace: true,
            scope: {
                activeTab: '=?',
                theme: '@',
                indicator: '@'
            },
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);

                if (angular.isUndefined(scope.theme))
                {
                    scope.theme = 'dark';
                }

                if (angular.isUndefined(scope.indicator))
                {
                    scope.indicator = 'blue';
                }
            }
        };
    })
    .directive('lxTab', function()
    {
        return {
            require: '^lxTabs',
            restrict: 'E',
            scope: {
                heading: '@'
            },
            templateUrl: 'lumx.tab.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                scope.data = ctrl.getScope();
                scope.index = ctrl.addTab(scope.heading);
            }
        };
    });