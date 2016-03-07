(function()
{
    'use strict';

    angular
        .module('lumx.radio-button')
        .directive('lxRadioGroup', lxRadioGroup)
        .directive('lxRadioButton', lxRadioButton)
        .directive('lxRadioButtonLabel', lxRadioButtonLabel)
        .directive('lxRadioButtonHelp', lxRadioButtonHelp);

    function lxRadioGroup()
    {
        return {
            restrict: 'E',
            templateUrl: 'radio-group.html',
            transclude: true,
            replace: true
        };
    }

    function lxRadioButton()
    {
        return {
            restrict: 'E',
            templateUrl: 'radio-button.html',
            scope:
            {
                lxColor: '@?',
                name: '@',
                ngChange: '&?',
                ngDisabled: '=?',
                ngModel: '=',
                ngValue: '=?',
                value: '@?'
            },
            controller: LxRadioButtonController,
            controllerAs: 'lxRadioButton',
            bindToController: true,
            transclude: true,
            replace: true
        };
    }

    LxRadioButtonController.$inject = ['$scope', '$timeout', 'LxUtils'];

    function LxRadioButtonController($scope, $timeout, LxUtils)
    {
        var lxRadioButton = this;
        var radioButtonId;
        var radioButtonHasChildren;
        var timer;

        lxRadioButton.getRadioButtonId = getRadioButtonId;
        lxRadioButton.getRadioButtonHasChildren = getRadioButtonHasChildren;
        lxRadioButton.setRadioButtonId = setRadioButtonId;
        lxRadioButton.setRadioButtonHasChildren = setRadioButtonHasChildren;
        lxRadioButton.triggerNgChange = triggerNgChange;

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

        init();

        ////////////

        function getRadioButtonId()
        {
            return radioButtonId;
        }

        function getRadioButtonHasChildren()
        {
            return radioButtonHasChildren;
        }

        function init()
        {
            setRadioButtonId(LxUtils.generateUUID());
            setRadioButtonHasChildren(false);

            if (angular.isDefined(lxRadioButton.value) && angular.isUndefined(lxRadioButton.ngValue))
            {
                lxRadioButton.ngValue = lxRadioButton.value;
            }

            lxRadioButton.lxColor = angular.isUndefined(lxRadioButton.lxColor) ? 'accent' : lxRadioButton.lxColor;
        }

        function setRadioButtonId(_radioButtonId)
        {
            radioButtonId = _radioButtonId;
        }

        function setRadioButtonHasChildren(_radioButtonHasChildren)
        {
            radioButtonHasChildren = _radioButtonHasChildren;
        }

        function triggerNgChange()
        {
            timer = $timeout(lxRadioButton.ngChange);
        }
    }

    function lxRadioButtonLabel()
    {
        return {
            restrict: 'AE',
            require: ['^lxRadioButton', '^lxRadioButtonLabel'],
            templateUrl: 'radio-button-label.html',
            link: link,
            controller: LxRadioButtonLabelController,
            controllerAs: 'lxRadioButtonLabel',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].setRadioButtonHasChildren(true);
            ctrls[1].setRadioButtonId(ctrls[0].getRadioButtonId());
        }
    }

    function LxRadioButtonLabelController()
    {
        var lxRadioButtonLabel = this;
        var radioButtonId;

        lxRadioButtonLabel.getRadioButtonId = getRadioButtonId;
        lxRadioButtonLabel.setRadioButtonId = setRadioButtonId;

        ////////////

        function getRadioButtonId()
        {
            return radioButtonId;
        }

        function setRadioButtonId(_radioButtonId)
        {
            radioButtonId = _radioButtonId;
        }
    }

    function lxRadioButtonHelp()
    {
        return {
            restrict: 'AE',
            require: '^lxRadioButton',
            templateUrl: 'radio-button-help.html',
            transclude: true,
            replace: true
        };
    }
})();