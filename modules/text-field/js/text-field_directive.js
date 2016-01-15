(function()
{
    'use strict';

    angular
        .module('lumx.text-field')
        .directive('lxTextField', lxTextField);

    LxTextFieldController.$inject = ['$timeout'];

    function lxTextField($timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'text-field.html',
            scope:
            {
                error: '=?lxError',
                fixedLabel: '=?lxFixedLabel',
                icon: '@?lxIcon',
                label: '@lxLabel',
                ngDisabled: '=?',
                theme: '@?lxTheme',
                valid: '=?lxValid'
            },
            link: link,
            controller: LxTextFieldController,
            controllerAs: 'lxTextField',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl, transclude)
        {
            var backwardOneWay = ['icon', 'label', 'theme'];
            var backwardTwoWay = ['error', 'fixedLabel', 'valid'];

            angular.forEach(backwardOneWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    attrs.$observe(attribute, function(newValue)
                    {
                        scope.lxTextField[attribute] = newValue;
                    });
                }
            });

            angular.forEach(backwardTwoWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    scope.$watch(function()
                    {
                        return scope.$parent.$eval(attrs[attribute]);
                    }, function(newValue)
                    {
                        scope.lxTextField[attribute] = newValue;
                    });
                }
            });

            transclude(function()
            {
                var input = element.find('textarea');

                if (input[0])
                {
                    input.bind('cut paste drop keydown', function()
                    {
                        $timeout(ctrl.updateTextareaHeight);
                    });
                }
                else
                {
                    input = element.find('input');
                }

                input.addClass('text-field__input');

                ctrl.setInput(input);

                input.bind('focus', ctrl.focusInput);
                input.bind('blur', ctrl.blurInput);
            });
        }
    }

    LxTextFieldController.$inject = ['$scope', '$timeout'];

    function LxTextFieldController($scope, $timeout)
    {
        var lxTextField = this;
        var input;

        lxTextField.blurInput = blurInput;
        lxTextField.focusInput = focusInput;
        lxTextField.hasValue = hasValue;
        lxTextField.setInput = setInput;
        lxTextField.updateTextareaHeight = updateTextareaHeight;

        ////////////

        function blurInput()
        {
            if (!hasValue())
            {
                $scope.$apply(function()
                {
                    lxTextField.isActive = false;
                });
            }

            $scope.$apply(function()
            {
                lxTextField.isFocus = false;
            });
        }

        function focusInput()
        {
            $scope.$apply(function()
            {
                lxTextField.isActive = true;
                lxTextField.isFocus = true;
            });
        }

        function hasValue()
        {
            return input.val();
        }

        function init()
        {
            lxTextField.isActive = hasValue();
            lxTextField.isFocus = false;
        }

        function setInput(_input)
        {
            input = _input;

            $timeout(init);

            if (input.selector === 'textarea')
            {
                $timeout(updateTextareaHeight);
            }
        }

        function updateTextareaHeight()
        {
            var tmpTextArea = angular.element('<textarea class="text-field__input" style="width: ' + input.width() + 'px;">' + input.val() + '</textarea>');

            tmpTextArea.appendTo('body');

            input.css(
            {
                height: tmpTextArea[0].scrollHeight + 'px'
            });

            tmpTextArea.remove();
        }
    }
})();