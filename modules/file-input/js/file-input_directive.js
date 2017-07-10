(function()
{
    'use strict';

    angular
        .module('lumx.file-input')
        .directive('lxFileInput', lxFileInput);

    function lxFileInput()
    {
        return {
            restrict: 'E',
            templateUrl: 'file-input.html',
            scope:
            {
                label: '@lxLabel',
                accept: '@lxAccept',
                callback: '&?lxCallback'
            },
            link: link,
            controller: LxFileInputController,
            controllerAs: 'lxFileInput',
            bindToController: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            var input = element.find('input');

            input
                .on('change', ctrl.updateModel)
                .on('blur', function()
                {
                    element.removeClass('input-file--is-focus');
                });

            scope.$on('$destroy', function()
            {
                input.off();
            });
        }
    }

    LxFileInputController.$inject = ['$element', '$scope', '$timeout'];

    function LxFileInputController($element, $scope, $timeout)
    {
        var lxFileInput = this;
        var input = $element.find('input');
        var timer;

        lxFileInput.updateModel = updateModel;

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

        ////////////

        function setFileName()
        {
            if (input.val())
            {
                lxFileInput.fileName = input.val().replace(/C:\\fakepath\\/i, '');

                $element.addClass('input-file--is-focus');
                $element.addClass('input-file--is-active');
            }
            else
            {
                lxFileInput.fileName = undefined;

                $element.removeClass('input-file--is-active');
            }

            input.val(undefined);
        }

        function updateModel()
        {
            if (angular.isDefined(lxFileInput.callback))
            {
                lxFileInput.callback(
                {
                    newFile: input[0].files[0]
                });
            }

            timer = $timeout(setFileName);
        }
    }
})();