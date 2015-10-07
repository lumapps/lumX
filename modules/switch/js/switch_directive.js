(function() {
    'use strict';

    angular
        .module('lumx.switch', [])
        .directive('lxSwitch', lxSwitch)
        .directive('lxSwitchLabel', lxSwitchLabel)
        .directive('lxSwitchHelp', lxSwitchHelp);

    function lxSwitch()
    {
        var directive =
        {
            restrict: 'E',
            templateUrl: 'switch.html',
            scope: {
                ngModel: '=',
                name: '@?',
                ngTrueValue: '@?',
                ngFalseValue: '@?',
                ngChange: '&?',
                ngDisabled: '=?',
                lxColor: '@?'
            },
            controller: LxSwitchController,
            controllerAs: 'lxSwitch',
            bindToController: true,
            transclude: true
        };

        return directive;
    }

    LxSwitchController.$inject = ['LxUtils'];

    function LxSwitchController(LxUtils)
    {
        var lxSwitch = this;

        //
        // PRIVATE ATTRIBUTES
        //

        var _switchId;
        var _switchHasChildren;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        lxSwitch.getSwitchId = getSwitchId;
        lxSwitch.getSwitchHasChildren = getSwitchHasChildren;
        lxSwitch.setSwitchId = setSwitchId;
        lxSwitch.setSwitchHasChildren = setSwitchHasChildren;

        //
        // PRIVATE METHODS
        //

        /**
         * Initialize the controller
         */
        function _init()
        {
            setSwitchId(LxUtils.generateUUID());
            setSwitchHasChildren(false);

            lxSwitch.ngTrueValue = angular.isUndefined(lxSwitch.ngTrueValue) ? true : lxSwitch.ngTrueValue;
            lxSwitch.ngFalseValue = angular.isUndefined(lxSwitch.ngFalseValue) ? false : lxSwitch.ngFalseValue;
            lxSwitch.lxColor =  angular.isUndefined(lxSwitch.lxColor) ? 'accent' : lxSwitch.lxColor;
        }

        //
        // PUBLIC METHODS
        //

        function getSwitchId()
        {
            return _switchId;
        }

        function getSwitchHasChildren()
        {
            return _switchHasChildren;
        }

        function setSwitchId(switchId)
        {
            _switchId = switchId;
        }

        function setSwitchHasChildren(switchHasChildren)
        {
            _switchHasChildren = switchHasChildren;
        }

        //
        // INITIALIZATION
        //

        _init();
    }

    function lxSwitchLabel()
    {
        var directive =
        {
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

        return directive;

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].setSwitchHasChildren(true);
            ctrls[1].setSwitchId(ctrls[0].getSwitchId());
        }
    }

    function LxSwitchLabelController()
    {
        var lxSwitchLabel = this;

        //
        // PRIVATE ATTRIBUTES
        //

        var _switchId;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        lxSwitchLabel.getSwitchId = getSwitchId;
        lxSwitchLabel.setSwitchId = setSwitchId;

        //
        // PUBLIC METHODS
        //

        function getSwitchId()
        {
            return _switchId;
        }

        function setSwitchId(switchId)
        {
            _switchId = switchId;
        }
    }

    function lxSwitchHelp()
    {
        var directive =
        {
            restrict: 'AE',
            require: '^lxSwitch',
            templateUrl: 'switch-help.html',
            transclude: true,
            replace: true
        };

        return directive;
    }
})();
