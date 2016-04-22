(function()
{
    'use strict';

    angular
        .module('lumx.dialog')
        .directive('lxDialog', lxDialog)
        .directive('lxDialogHeader', lxDialogHeader)
        .directive('lxDialogContent', lxDialogContent)
        .directive('lxDialogFooter', lxDialogFooter)
        .directive('lxDialogClose', lxDialogClose);

    lxDialog.$inject = ['LxDialogService'];

    function lxDialog(LxDialogService)
    {
        return {
            restrict: 'E',
            template: '<div class="dialog dialog--l"><div ng-if="lxDialog.isOpen" ng-transclude></div></div>',
            scope:
            {
                autoClose: '=?lxAutoClose',
                escapeClose: '=?lxEscapeClose'
            },
            link: link,
            controller: LxDialogController,
            controllerAs: 'lxDialog',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            attrs.$observe('id', function(_newId)
            {
                LxDialogService.registerScope(_newId, scope);
            });
        }
    }

    LxDialogController.$inject = ['$element'];

    function LxDialogController($element)
    {
        var lxDialog = this;

        lxDialog.autoClose = angular.isDefined(lxDialog.autoClose) ? lxDialog.autoClose : true;
        lxDialog.element = $element;
        lxDialog.elementParent = $element.parent();
        lxDialog.escapeClose = angular.isDefined(lxDialog.escapeClose) ? lxDialog.escapeClose : true;
        lxDialog.isOpen = false;
    }

    function lxDialogHeader()
    {
        return {
            restrict: 'E',
            template: '<div class="dialog__header" ng-transclude></div>',
            replace: true,
            transclude: true
        };
    }

    function lxDialogContent()
    {
        return {
            restrict: 'E',
            template: '<div class="dialog__scrollable"><div class="dialog__content" ng-transclude></div></div>',
            replace: true,
            transclude: true
        };
    }

    function lxDialogFooter()
    {
        return {
            restrict: 'E',
            template: '<div class="dialog__footer" ng-transclude></div>',
            replace: true,
            transclude: true
        };
    }

    lxDialogClose.$inject = ['LxDialogService'];

    function lxDialogClose(LxDialogService)
    {
        return {
            restrict: 'A',
            link: function(scope, element)
            {
                element.on('click', function()
                {
                    LxDialogService.close(element.parents('.dialog').attr('id'));
                });

                scope.$on('$destroy', function()
                {
                    element.off();
                });
            }
        };
    }
})();