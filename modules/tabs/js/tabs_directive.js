(function()
{
    'use strict';

    angular
        .module('lumx.tabs', [])
        .directive('lxTabs', lxTabs)
        .directive('lxTab', lxTab)
        .directive('lxTabsPanes', lxTabsPanes)
        .directive('lxTabPane', lxTabPane);

    function lxTabs()
    {
        return {
            restrict: 'E',
            templateUrl: 'tabs.html',
            scope:
            {
                layout: '@?lxLayout',
                theme: '@?lxTheme',
                color: '@?lxColor',
                indicator: '@?lxIndicator',
                activeTab: '=?lxActiveTab',
                labels: '=?lxLabels',
                icons: '=?lxIcons',
                panes: '@?lxPanes'
            },
            controller: LxTabsController,
            controllerAs: 'lxTabs',
            bindToController: true,
            replace: true,
            transclude: true
        };
    }

    LxTabsController.$inject = ['LxUtils', '$element', '$scope', '$timeout'];

    function LxTabsController(LxUtils, $element, $scope, $timeout)
    {
        var lxTabs = this;
        var tabsLength;

        lxTabs.removeTab = removeTab;
        lxTabs.setActiveTab = setActiveTab;
        lxTabs.setViewMode = setViewMode;
        lxTabs.tabIsActive = tabIsActive;
        lxTabs.updateTabs = updateTabs;

        lxTabs.activeTab = angular.isDefined(lxTabs.activeTab) ? lxTabs.activeTab : 0;
        lxTabs.color = angular.isDefined(lxTabs.color) ? lxTabs.color : 'primary';
        lxTabs.indicator = angular.isDefined(lxTabs.indicator) ? lxTabs.indicator : 'accent';
        lxTabs.layout = angular.isDefined(lxTabs.layout) ? lxTabs.layout : 'full';
        lxTabs.tabs = [];
        lxTabs.theme = angular.isDefined(lxTabs.theme) ? lxTabs.theme : 'light';
        lxTabs.viewMode = angular.isDefined(lxTabs.labels) || angular.isDefined(lxTabs.icons) ? 'separate' : 'gather';

        $scope.$watch(function()
        {
            return lxTabs.activeTab;
        }, function(_newActiveTab, _oldActiveTab)
        {
            $timeout(function()
            {
                setIndicatorPosition(_oldActiveTab);

                if (lxTabs.viewMode === 'separate')
                {
                    angular.element('#' + lxTabs.panes).find('.tabs__pane').hide();
                    angular.element('#' + lxTabs.panes).find('.tabs__pane').eq(lxTabs.activeTab).show();
                }
            });
        });

        $scope.$watch(function()
        {
            return lxTabs.labels;
        }, function(_newLabels)
        {
            angular.forEach(_newLabels, function(label, index)
            {
                var tab = {
                    uuid: LxUtils.generateUUID(),
                    index: index,
                    label: label,
                    icon: undefined
                };

                updateTabs(tab);
            });
        });

        $scope.$watch(function()
        {
            return lxTabs.icons;
        }, function(_newIcons)
        {
            angular.forEach(_newIcons, function(icon, index)
            {
                var tab = {
                    uuid: LxUtils.generateUUID(),
                    index: index,
                    label: undefined,
                    icon: icon
                };

                updateTabs(tab);
            });
        });

        $timeout(function()
        {
            tabsLength = lxTabs.tabs.length;
        });

        ////////////

        function removeTab(_tab)
        {
            lxTabs.tabs.splice(_tab.index, 1);

            angular.forEach(lxTabs.tabs, function(tab, index)
            {
                tab.index = index;
            });

            if (lxTabs.activeTab === 0)
            {
                $timeout(function()
                {
                    setIndicatorPosition();
                });
            }
            else
            {
                setActiveTab(0);
            }
        }

        function setActiveTab(_index)
        {
            lxTabs.activeTab = _index;
        }

        function setIndicatorPosition(_previousActiveTab)
        {
            var direction = lxTabs.activeTab > _previousActiveTab ? 'right' : 'left';
            var indicator = $element.find('.tabs__indicator');
            var activeTab = $element.find('.tabs__link').eq(lxTabs.activeTab);
            var indicatorLeft = activeTab.position().left;
            var indicatorRight = $element.outerWidth() - (indicatorLeft + activeTab.outerWidth());

            if (angular.isUndefined(_previousActiveTab))
            {
                indicator.css(
                {
                    left: indicatorLeft,
                    right: indicatorRight
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
                    indicator.velocity(
                    {
                        left: indicatorLeft
                    }, animationProperties);

                    indicator.velocity(
                    {
                        right: indicatorRight
                    }, animationProperties);
                }
                else
                {
                    indicator.velocity(
                    {
                        right: indicatorRight
                    }, animationProperties);

                    indicator.velocity(
                    {
                        left: indicatorLeft
                    }, animationProperties);
                }
            }
        }

        function setViewMode(_viewMode)
        {
            lxTabs.viewMode = _viewMode;
        }

        function tabIsActive(_index)
        {
            return lxTabs.activeTab === _index;
        }

        function updateTabs(_tab)
        {
            var newTab = true;

            angular.forEach(lxTabs.tabs, function(tab)
            {
                if (tab.uuid === _tab.uuid)
                {
                    newTab = false;

                    tab.index = _tab.index;
                    tab.icon = _tab.icon;
                    tab.label = _tab.label;
                }
            });

            if (newTab)
            {
                lxTabs.tabs.push(_tab);

                if (angular.isDefined(tabsLength))
                {
                    $timeout(function()
                    {
                        setIndicatorPosition();
                    });
                }
            }
        }
    }

    function lxTab()
    {
        return {
            restrict: 'E',
            require: ['lxTab', '^lxTabs'],
            templateUrl: 'tab.html',
            scope: true,
            link: link,
            controller: LxTabController,
            controllerAs: 'lxTab',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].init(ctrls[1], element.index());

            attrs.$observe('lxIcon', function(_newIcon)
            {
                ctrls[0].setIcon(_newIcon);
            });

            attrs.$observe('lxLabel', function(_newLabel)
            {
                ctrls[0].setLabel(_newLabel);
            });
        }
    }

    LxTabController.$inject = ['$scope', 'LxUtils'];

    function LxTabController($scope, LxUtils)
    {
        var lxTab = this;
        var parentCtrl;
        var tab = {
            uuid: LxUtils.generateUUID(),
            index: undefined,
            label: undefined,
            icon: undefined
        };

        lxTab.init = init;
        lxTab.setIcon = setIcon;
        lxTab.setLabel = setLabel;
        lxTab.tabIsActive = tabIsActive;

        $scope.$on('$destroy', function()
        {
            parentCtrl.removeTab(tab);
        });

        ////////////

        function init(_parentCtrl, _index)
        {
            parentCtrl = _parentCtrl;
            tab.index = _index;

            parentCtrl.updateTabs(tab);
        }

        function setIcon(_icon)
        {
            tab.icon = _icon;

            parentCtrl.updateTabs(tab);
        }

        function setLabel(_label)
        {
            tab.label = _label;

            parentCtrl.updateTabs(tab);
        }

        function tabIsActive()
        {
            return parentCtrl.tabIsActive(tab.index);
        }
    }

    function lxTabsPanes()
    {
        return {
            restrict: 'E',
            templateUrl: 'tabs-panes.html',
            scope: true,
            replace: true,
            transclude: true
        };
    }

    function lxTabPane()
    {
        return {
            restrict: 'E',
            templateUrl: 'tab-pane.html',
            scope: true,
            replace: true,
            transclude: true
        };
    }
})();