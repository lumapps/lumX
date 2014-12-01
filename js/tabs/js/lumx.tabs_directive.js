/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.tabs', [])
    .controller('LxTabsController', function()
    {
        var tabs = [],
            activeTab = 0;

        this.addTab = function(heading, active)
        {
            tabs.push({ heading: heading });

            if (active)
            {
                activeTab = tabs.length - 1;
            }

            return (tabs.length - 1);
        };

        this.getTabs = function()
        {
            return tabs;
        };

        this.getActiveTab = function()
        {
            return activeTab;
        };

        this.switchTab = function(index)
        {
            activeTab = index;
        };
    })
    .directive('lxTabs', function()
    {
        return {
            restrict: 'E',
            controller: 'LxTabsController',
            templateUrl: 'lumx.tabs.html',
            transclude: true,
            replace: true,
            scope: {
                theme: '=?',
                indicatorColor: '=?'
            },
            link: function(scope, element, attrs, ctrl)
            {
                scope.tabsCtrl = ctrl;

                if (angular.isUndefined(scope.theme))
                {
                    scope.theme = 'dark';
                }

                if (angular.isUndefined(scope.indicatorColor))
                {
                    scope.indicatorColor = 'blue';
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
                active: '@',
                heading: '@'
            },
            templateUrl: 'lumx.tab.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                scope.tabsCtrl = ctrl;
                scope.index = ctrl.addTab(scope.heading, scope.active);
            }
        };
    })
    .directive('lxTabIndicator', function()
    {
        return {
            require: '^lxTabs',
            restrict: 'A',
            link: function(scope, element, attrs, ctrl)
            {
                scope.activeTab = ctrl.getActiveTab();

                function setIndicatorPosition(init)
                {
                    var direction;

                    if (ctrl.getActiveTab() > scope.activeTab)
                    {
                        direction = 'right';
                    }
                    else
                    {
                        direction = 'left';
                    }

                    scope.activeTab = ctrl.getActiveTab();

                    var tabsLength = ctrl.getTabs().length,
                        indicatorWidth = 100 / tabsLength,
                        indicatorLeft = (indicatorWidth * scope.activeTab),
                        indicatorRight = 100 - (indicatorLeft + indicatorWidth);

                    if (init)
                    {
                        element.css({
                            left: indicatorLeft + '%',
                            right: indicatorRight  + '%'
                        });
                    }
                    else
                    {
                        if (direction === 'left')
                        {
                            element.velocity({ 
                                left: indicatorLeft + '%'
                            }, {
                                duration: 200,
                                easing: 'easeOutQuint'
                            });

                            element.velocity({ 
                                right: indicatorRight  + '%'
                            }, {
                                duration: 200,
                                easing: 'easeOutQuint'
                            });
                        }
                        else
                        {
                            element.velocity({ 
                                right: indicatorRight  + '%'
                            }, {
                                duration: 200,
                                easing: 'easeOutQuint'
                            });

                            element.velocity({ 
                                left: indicatorLeft + '%'
                            }, {
                                duration: 200,
                                easing: 'easeOutQuint'
                            });
                        }
                    }
                }

                setIndicatorPosition(true);

                scope.$watch(function()
                {
                    return ctrl.getActiveTab();
                },
                function(newValue, oldValue)
                {
                    if (newValue !== oldValue)
                    {
                        setIndicatorPosition(false);
                    }
                });
            }
        };
    });