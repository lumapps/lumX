(function()
{
    'use strict';

    angular
        .module('lumx.checkbox')
        .directive('lxCheckbox', lxCheckbox)
        .directive('lxCheckboxLabel', lxCheckboxLabel)
        .directive('lxCheckboxHelp', lxCheckboxHelp);

    function lxCheckbox()
    {
        return {
            restrict: 'E',
            templateUrl: 'checkbox.html',
            scope:
            {
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
            transclude: true,
            replace: true
        };
    }

    LxCheckboxController.$inject = ['$timeout', 'LxUtils'];

    function LxCheckboxController($timeout, LxUtils)
    {
        var lxCheckbox = this;
        var checkboxId;
        var checkboxHasChildren;

        lxCheckbox.getCheckboxId = getCheckboxId;
        lxCheckbox.getCheckboxHasChildren = getCheckboxHasChildren;
        lxCheckbox.setCheckboxId = setCheckboxId;
        lxCheckbox.setCheckboxHasChildren = setCheckboxHasChildren;
        lxCheckbox.triggerNgChange = triggerNgChange;

        init();

        ////////////

        function getCheckboxId()
        {
            return checkboxId;
        }

        function getCheckboxHasChildren()
        {
            return checkboxHasChildren;
        }

        function init()
        {
            setCheckboxId(LxUtils.generateUUID());
            setCheckboxHasChildren(false);

            lxCheckbox.ngTrueValue = angular.isUndefined(lxCheckbox.ngTrueValue) ? true : lxCheckbox.ngTrueValue;
            lxCheckbox.ngFalseValue = angular.isUndefined(lxCheckbox.ngFalseValue) ? false : lxCheckbox.ngFalseValue;
            lxCheckbox.lxColor = angular.isUndefined(lxCheckbox.lxColor) ? 'accent' : lxCheckbox.lxColor;
        }

        function setCheckboxId(_checkboxId)
        {
            checkboxId = _checkboxId;
        }

        function setCheckboxHasChildren(_checkboxHasChildren)
        {
            checkboxHasChildren = _checkboxHasChildren;
        }

        function triggerNgChange()
        {
            $timeout(lxCheckbox.ngChange);
        }
    }

    function lxCheckboxLabel()
    {
        return {
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

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].setCheckboxHasChildren(true);
            ctrls[1].setCheckboxId(ctrls[0].getCheckboxId());
        }
    }

    function LxCheckboxLabelController()
    {
        var lxCheckboxLabel = this;
        var checkboxId;

        lxCheckboxLabel.getCheckboxId = getCheckboxId;
        lxCheckboxLabel.setCheckboxId = setCheckboxId;

        ////////////

        function getCheckboxId()
        {
            return checkboxId;
        }

        function setCheckboxId(_checkboxId)
        {
            checkboxId = _checkboxId;
        }
    }

    function lxCheckboxHelp()
    {
        return {
            restrict: 'AE',
            require: '^lxCheckbox',
            templateUrl: 'checkbox-help.html',
            transclude: true,
            replace: true
        };
    }
})();