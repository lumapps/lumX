(function()
{
    'use strict';

    angular
        .module('lumx.tabs', [])
        .directive('lxTabs', lxTabs)
        .directive('lxTab', lxTab)
        .directive('lxTabsPanes', lxTabsPanes)
        .directive('lxTabPane', lxTabPane);

    lxTabs.$inject = ['$parse', 'LxUtils'];

    function lxTabs($parse, LxUtils)
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
                panes: '@?lxPanes'
            },
            link: link,
            controller: LxTabsController,
            controllerAs: 'lxTabs',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            if (angular.isDefined(attrs.lxLabels) || angular.isDefined(attrs.lxIcons))
            {
                ctrl.setViewMode('separate');
            }

            scope.$watch(attrs.lxLabels, function(_newLabels)
            {
                angular.forEach(_newLabels, function(label, index)
                {
                    var tab = {
                        uuid: LxUtils.generateUUID(),
                        index: index,
                        label: label,
                        icon: undefined
                    };

                    ctrl.updateTabs(tab);
                });
            });

            scope.$watch(attrs.lxIcons, function(_newIcons)
            {
                angular.forEach(_newIcons, function(icon, index)
                {
                    var tab = {
                        uuid: LxUtils.generateUUID(),
                        index: index,
                        label: undefined,
                        icon: icon
                    };

                    ctrl.updateTabs(tab);
                });
            });
        }
    }

    LxTabsController.$inject = ['$element', '$scope', '$timeout'];

    function LxTabsController($element, $scope, $timeout)
    {
        var lxTabs = this;

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
        lxTabs.viewMode = 'gather';

        $scope.$watch(function()
        {
            return lxTabs.activeTab;
        }, function(_newActiveTab)
        {
            $timeout(function()
            {
                setActiveTab(_newActiveTab);
            });
        });

        ////////////

        function setActiveTab(_index)
        {
            var previousActiveTab = lxTabs.activeTab;

            lxTabs.activeTab = _index;

            setIndicatorPosition(previousActiveTab);

            if (lxTabs.viewMode === 'separate')
            {
                angular.element('#' + lxTabs.panes).find('.tabs__pane').hide();
                angular.element('#' + lxTabs.panes).find('.tabs__pane').eq(lxTabs.activeTab).show();
            }
        }

        function setIndicatorPosition(_previousActiveTab)
        {
            var links = $element.find('.tabs__links');
            var indicator = $element.find('.tabs__indicator');
            var direction = lxTabs.activeTab > _previousActiveTab ? 'right' : 'left';
            var activeTab = links.find('.tabs__link').eq(lxTabs.activeTab);
            var activeTabWidth = activeTab.outerWidth();
            var indicatorLeft = activeTab.position().left;
            var indicatorRight = $element.outerWidth() - (indicatorLeft + activeTabWidth);

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

    LxTabController.$inject = ['LxUtils'];

    function LxTabController(LxUtils)
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