(function()
{
    'use strict';

    angular
        .module('lumx.text-field', [])
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
            // Backward compatibility
            if (angular.isUndefined(scope.lxTextField.error) && angular.isDefined(attrs.error))
            {
                scope.lxTextField.error = scope.$parent.$eval(attrs.error);
            }

            if (angular.isUndefined(scope.lxTextField.fixedLabel) && angular.isDefined(attrs.fixedLabel))
            {
                scope.lxTextField.fixedLabel = scope.$parent.$eval(attrs.fixedLabel);
            }

            if (angular.isUndefined(scope.lxTextField.icon) && angular.isDefined(attrs.icon))
            {
                scope.lxTextField.icon = attrs.icon;
            }

            if (angular.isUndefined(scope.lxTextField.label) && angular.isDefined(attrs.label))
            {
                scope.lxTextField.label = attrs.label;
            }

            if (angular.isUndefined(scope.lxTextField.ngDisabled) && angular.isDefined(attrs.disabled))
            {
                scope.lxTextField.ngDisabled = scope.$parent.$eval(attrs.disabled);
            }

            if (angular.isUndefined(scope.lxTextField.theme) && angular.isDefined(attrs.theme))
            {
                scope.lxTextField.theme = attrs.theme;
            }

            if (angular.isUndefined(scope.lxTextField.valid) && angular.isDefined(attrs.valid))
            {
                scope.lxTextField.valid = scope.$parent.$eval(attrs.valid);
            }

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
                ctrl.setModel(input.data('$ngModelController'));

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
        var modelController;

        lxTextField.blurInput = blurInput;
        lxTextField.focusInput = focusInput;
        lxTextField.hasModel = hasModel;
        lxTextField.setInput = setInput;
        lxTextField.setModel = setModel;
        lxTextField.updateTextareaHeight = updateTextareaHeight;

        ////////////

        function blurInput()
        {
            if (!modelController.$modelValue)
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

        function hasModel()
        {
            return modelController.$modelValue;
        }

        function init()
        {
            lxTextField.isActive = angular.isDefined(modelController) && modelController.$modelValue ? true : false;
            lxTextField.isFocus = false;
        }

        function setInput(_input)
        {
            input = _input;

            if (input.selector === 'textarea')
            {
                $timeout(updateTextareaHeight);
            }
        }

        function setModel(_modelControler)
        {
            modelController = _modelControler;

            $timeout(init);
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