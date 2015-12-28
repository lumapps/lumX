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