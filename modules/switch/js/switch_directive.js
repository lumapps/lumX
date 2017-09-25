(function()
{
    'use strict';

    angular
        .module('lumx.switch')
        .directive('lxSwitch', lxSwitch)
        .directive('lxSwitchLabel', lxSwitchLabel)
        .directive('lxSwitchHelp', lxSwitchHelp);

    function lxSwitch()
    {
        return {
            restrict: 'E',
            templateUrl: 'switch.html',
            scope:
            {
                ngModel: '=',
                name: '@?',
                ngTrueValue: '@?',
                ngFalseValue: '@?',
                ngChange: '&?',
                ngDisabled: '=?',
                lxColor: '@?',
                lxPosition: '@?',
                lxTheme: '@?'
            },
            controller: LxSwitchController,
            controllerAs: 'lxSwitch',
            bindToController: true,
            transclude: true,
            replace: true
        };
    }

    LxSwitchController.$inject = ['$scope', '$timeout', 'LxUtils'];

    function LxSwitchController($scope, $timeout, LxUtils)
    {
        var lxSwitch = this;
        var switchId;
        var switchHasChildren;
        var timer;

        lxSwitch.getSwitchId = getSwitchId;
        lxSwitch.getSwitchHasChildren = getSwitchHasChildren;
        lxSwitch.setSwitchId = setSwitchId;
        lxSwitch.setSwitchHasChildren = setSwitchHasChildren;
        lxSwitch.triggerNgChange = triggerNgChange;

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

        init();

        ////////////

        function getSwitchId()
        {
            return switchId;
        }

        function getSwitchHasChildren()
        {
            return switchHasChildren;
        }

        function init()
        {
            setSwitchId(LxUtils.generateUUID());
            setSwitchHasChildren(false);

            lxSwitch.ngTrueValue = angular.isUndefined(lxSwitch.ngTrueValue) ? true : lxSwitch.ngTrueValue;
            lxSwitch.ngFalseValue = angular.isUndefined(lxSwitch.ngFalseValue) ? false : lxSwitch.ngFalseValue;
            lxSwitch.lxColor = angular.isUndefined(lxSwitch.lxColor) ? 'accent' : lxSwitch.lxColor;
            lxSwitch.lxPosition = angular.isUndefined(lxSwitch.lxPosition) ? 'left' : lxSwitch.lxPosition;
        }

        function setSwitchId(_switchId)
        {
            switchId = _switchId;
        }

        function setSwitchHasChildren(_switchHasChildren)
        {
            switchHasChildren = _switchHasChildren;
        }

        function triggerNgChange()
        {
            timer = $timeout(lxSwitch.ngChange);
        }
    }

    function lxSwitchLabel()
    {
        return {
            restrict: 'AE',
            require: ['^lxSwitch', '^lxSwitchLabel'],
            templateUrl: 'switch-label.html',
            link: link,
            controller: LxSwitchLabelController,
            controllerAs: 'lxSwitchLabel',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].setSwitchHasChildren(true);
            ctrls[1].setSwitchId(ctrls[0].getSwitchId());
        }
    }

    function LxSwitchLabelController()
    {
        var lxSwitchLabel = this;
        var switchId;

        lxSwitchLabel.getSwitchId = getSwitchId;
        lxSwitchLabel.setSwitchId = setSwitchId;

        ////////////

        function getSwitchId()
        {
            return switchId;
        }

        function setSwitchId(_switchId)
        {
            switchId = _switchId;
        }
    }

    function lxSwitchHelp()
    {
        return {
            restrict: 'AE',
            require: '^lxSwitch',
            templateUrl: 'switch-help.html',
            transclude: true,
            replace: true
        };
    }
})();
