(function()
{
    'use strict';

    angular
        .module('lumx.text-field')
        .directive('lxTextField', lxTextField);

    lxTextField.$inject = ['$timeout'];

    function lxTextField($timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'text-field.html',
            scope:
            {
                allowClear: '=?lxAllowClear',
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
            var input;
            var timer;

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
                input = element.find('textarea');

                if (input[0])
                {
                    input.on('cut paste drop keydown', function()
                    {
                        timer = $timeout(ctrl.updateTextareaHeight);
                    });
                }
                else
                {
                    input = element.find('input');
                }

                input.addClass('text-field__input');

                ctrl.setInput(input);
                ctrl.setModel(input.data('$ngModelController'));

                input.on('focus', ctrl.focusInput);
                input.on('blur', ctrl.blurInput);
            });

            scope.$on('$destroy', function()
            {
                $timeout.cancel(timer);
                input.off();
            });
        }
    }

    LxTextFieldController.$inject = ['$scope', '$timeout'];

    function LxTextFieldController($scope, $timeout)
    {
        var lxTextField = this;
        var input;
        var modelController;
        var timer1;
        var timer2;

        lxTextField.blurInput = blurInput;
        lxTextField.clearInput = clearInput;
        lxTextField.focusInput = focusInput;
        lxTextField.hasValue = hasValue;
        lxTextField.setInput = setInput;
        lxTextField.setModel = setModel;
        lxTextField.updateTextareaHeight = updateTextareaHeight;

        $scope.$watch(function()
        {
            return modelController.$viewValue;
        }, function(newValue, oldValue)
        {
            if (angular.isDefined(newValue) && newValue)
            {
                lxTextField.isActive = true;
            }
            else
            {
                lxTextField.isActive = false;
            }
        });

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer1);
            $timeout.cancel(timer2);
        });

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

        function clearInput(_event)
        {
            _event.stopPropagation();

            modelController.$setViewValue(undefined);
            modelController.$render();
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

            timer1 = $timeout(init);

            if (input.selector === 'textarea')
            {
                timer2 = $timeout(updateTextareaHeight);
            }
        }

        function setModel(_modelControler)
        {
            modelController = _modelControler;
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