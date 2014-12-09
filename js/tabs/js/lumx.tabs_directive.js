/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.tabs', [])
    .controller('LxTabsController', ['$scope', '$sce', function($scope, $sce)
    {
        var tabs = [],
            links,
            indicator;
        
        $scope.activeTab = angular.isUndefined($scope.activeTab) ? 0 : $scope.activeTab;

        this.init = function(element)
        {
            links = element.find('.tabs__links');
            indicator = element.find('.tabs__indicator');

            setIndicatorPosition();
        };

        this.getScope = function()
        {
            return $scope;
        };

        this.addTab = function(heading, icon)
        {
            if (angular.isDefined(icon))
            {
                tabs.push({ link: $sce.trustAsHtml('<i class="mdi mdi--' + icon + '"></i>') });
            }
            else
            {
                tabs.push({ link: $sce.trustAsHtml(heading) });
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

        function setLinksColor(newTab)
        {
            links.find('.tabs-link').removeClass('tc-' + $scope.indicator);
            links.find('.tabs-link').eq(newTab).addClass('tc-' + $scope.indicator);
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
                setLinksColor(newIndex);
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
                linksTc: '@',
                linksBgc: '@',
                indicator: '@',
                noDivider: '@',
                zDepth: '@'
            },
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);

                if (angular.isUndefined(scope.linksTc))
                {
                    scope.linksTc = 'dark';
                }

                if (angular.isUndefined(scope.linksBgc))
                {
                    scope.linksBgc = 'white';
                }

                if (angular.isUndefined(scope.indicator))
                {
                    scope.indicator = 'blue-500';
                }

                if (angular.isUndefined(scope.zDepth))
                {
                    scope.zDepth = '0';
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
                heading: '@',
                icon: '@'
            },
            templateUrl: 'lumx.tab.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                scope.data = ctrl.getScope();
                scope.index = ctrl.addTab(scope.heading, scope.icon);
            }
        };
    })
    .directive('lxTabLink', function()
    {
        return {
            require: '^lxTabs',
            restrict: 'A',
            link: function(scope, element)
            {
                if (scope.activeTab === element.parent().index())
                {
                    element.addClass('tc-' + scope.indicator);
                }

                element
                    .on('mouseenter', function()
                    {
                        if (scope.activeTab !== element.parent().index())
                        {
                            element.addClass('tc-' + scope.indicator);
                        }
                    })
                    .on('mouseleave', function()
                    {
                        if (scope.activeTab !== element.parent().index())
                        {
                            element.removeClass('tc-' + scope.indicator);
                        }
                    });
            }
        };
    });