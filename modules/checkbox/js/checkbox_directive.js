(function() {
    'use strict';

    angular
        .module('lumx.checkbox', [])
        .directive('lxCheckbox', lxCheckbox)
        .directive('lxCheckboxLabel', lxCheckboxLabel)
        .directive('lxCheckboxHelp', lxCheckboxHelp);

    function lxCheckbox()
    {
        var directive =
        {
            restrict: 'E',
            templateUrl: 'checkbox.html',
            scope: {
                ngModel: '=',
                name: '@?',
                ngTrueValue: '@?',
                ngFalseValue: '@?',
                ngChange: '&?',
                ngDisabled: '=?',
                lxColor: '@?'
            },
            controller: LxCheckboxController,
            controllerAs: 'lxCheckbox',
            bindToController: true,
            transclude: true
        };

        return directive;
    }

    LxCheckboxController.$inject = ['LxUtils'];

    function LxCheckboxController(LxUtils)
    {
        var lxCheckbox = this;

        //
        // PRIVATE ATTRIBUTES
        //

        var _checkboxId;
        var _checkboxHasChildren;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        lxCheckbox.getCheckboxId = getCheckboxId;
        lxCheckbox.getCheckboxHasChildren = getCheckboxHasChildren;
        lxCheckbox.setCheckboxId = setCheckboxId;
        lxCheckbox.setCheckboxHasChildren = setCheckboxHasChildren;

        //
        // PRIVATE METHODS
        //

        /**
         * Initialize the controller
         */
        function _init()
        {
            setCheckboxId(LxUtils.generateUUID());
            setCheckboxHasChildren(false);

            lxCheckbox.ngTrueValue = angular.isUndefined(lxCheckbox.ngTrueValue) ? true : lxCheckbox.ngTrueValue;
            lxCheckbox.ngFalseValue = angular.isUndefined(lxCheckbox.ngFalseValue) ? false : lxCheckbox.ngFalseValue;
            lxCheckbox.lxColor =  angular.isUndefined(lxCheckbox.lxColor) ? 'accent' : lxCheckbox.lxColor;
        }

        //
        // PUBLIC METHODS
        //

        function getCheckboxId()
        {
            return _checkboxId;
        }

        function getCheckboxHasChildren()
        {
            return _checkboxHasChildren;
        }

        function setCheckboxId(checkboxId)
        {
            _checkboxId = checkboxId;
        }

        function setCheckboxHasChildren(checkboxHasChildren)
        {
            _checkboxHasChildren = checkboxHasChildren;
        }

        //
        // INITIALIZATION
        //

        _init();
    }

    function lxCheckboxLabel()
    {
        var directive =
        {
            restrict: 'AE',
            require: ['^lxCheckbox', '^lxCheckboxLabel'],
            templateUrl: 'checkbox-label.html',
            link: link,
            controller: LxCheckboxLabelController,
            controllerAs: 'lxCheckboxLabel',
            bindToController: true,
            transclude: true,
            replace: true
        };

        return directive;

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].setCheckboxHasChildren(true);
            ctrls[1].setCheckboxId(ctrls[0].getCheckboxId());
        }
    }

    function LxCheckboxLabelController()
    {
        var lxCheckboxLabel = this;

        //
        // PRIVATE ATTRIBUTES
        //

        var _checkboxId;

        //
        // PUBLIC ATTRIBUTES
        //

        // Public methods
        lxCheckboxLabel.getCheckboxId = getCheckboxId;
        lxCheckboxLabel.setCheckboxId = setCheckboxId;

        //
        // PUBLIC METHODS
        //

        function getCheckboxId()
        {
            return _checkboxId;
        }

        function setCheckboxId(checkboxId)
        {
            _checkboxId = checkboxId;
        }
    }

    function lxCheckboxHelp()
    {
        var directive =
        {
            restrict: 'AE',
            require: '^lxCheckbox',
            templateUrl: 'checkbox-help.html',
            transclude: true,
            replace: true
        };

        return directive;
    }
})();
