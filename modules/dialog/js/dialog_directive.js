/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dialog', [])
    .service('LxDialogService', ['$rootScope', '$timeout', '$interval', '$window', function($rootScope, $timeout, $interval, $window)
    {
        var self = this,
            dialogInterval,
            dialogFilter,
            dialogHeight,
            activeDialogId,
            scopeMap = {};

        this.registerScope = function(dialogId, dialogScope)
        {
            scopeMap[dialogId] = dialogScope;
        };

        this.open = function(dialogId)
        {
            activeDialogId = dialogId;
            $rootScope.$broadcast('lx-dialog__open-start', dialogId);

            angular.element('body').css({
                overflow: 'hidden'
            });

            dialogFilter = angular.element('<div/>', {
                class: 'dialog-filter'
            });

            dialogFilter.appendTo('body');

            if (angular.isUndefined(scopeMap[dialogId].autoClose) || scopeMap[dialogId].autoClose === 'true')
            {
                dialogFilter.bind('click', function()
                {
                    self.close(dialogId);
                });
            }

            scopeMap[dialogId].element
                .appendTo('body')
                .show();

            $timeout(function()
            {
                scopeMap[dialogId].isOpened = true;

                dialogFilter.addClass('dialog-filter--is-shown');
                scopeMap[dialogId].element.addClass('dialog--is-shown');

                $timeout(function()
                {
                    $rootScope.$broadcast('lx-dialog__open-end', dialogId);
                }, 600);
            }, 100);

            dialogInterval = $interval(function()
            {
                if (scopeMap[dialogId].element.outerHeight() !== dialogHeight)
                {
                    checkDialogHeight(dialogId);
                    dialogHeight = scopeMap[dialogId].element.outerHeight();
                }
            }, 500);
        };

        this.close = function(dialogId)
        {
            activeDialogId = undefined;
            $rootScope.$broadcast('lx-dialog__close-start', dialogId);

            $interval.cancel(dialogInterval);

            dialogFilter.removeClass('dialog-filter--is-shown');
            scopeMap[dialogId].element.removeClass('dialog--is-shown');

            if (scopeMap[dialogId].onclose)
            {
                scopeMap[dialogId].onclose();
            }

            $timeout(function()
            {
                angular.element('body').css({
                    overflow: 'visible'
                });

                dialogFilter.remove();

                scopeMap[dialogId].element
                    .hide()
                    .removeClass('dialog--is-fixed')
                    .appendTo(scopeMap[dialogId].parent);

                scopeMap[dialogId].isOpened = false;
                dialogHeight = undefined;
                $rootScope.$broadcast('lx-dialog__close-end', dialogId);
            }, 600);
        };

        function checkDialogHeight(dialogId)
        {
            var dialogMargin = 60,
                dialog = scopeMap[dialogId].element,
                dialogHeader = dialog.find('.dialog__header'),
                dialogContent = dialog.find('.dialog__content'),
                dialogActions = dialog.find('.dialog__actions'),
                dialogScrollable = angular.element('<div/>', { class: 'dialog__scrollable' }),
                HeightToCheck = dialogMargin + dialogHeader.outerHeight() + dialogContent.outerHeight() + dialogActions.outerHeight();

            if (HeightToCheck >= $window.innerHeight)
            {
                dialog.addClass('dialog--is-fixed');

                if (dialog.find('.dialog__scrollable').length === 0)
                {
                    dialogScrollable
                        .css({ top: dialogHeader.outerHeight(), bottom: dialogActions.outerHeight() })
                        .bind('scroll', checkScrollEnd);

                    dialogContent.wrap(dialogScrollable);
                }
            }
            else
            {
                dialog.removeClass('dialog--is-fixed');

                if (dialog.find('.dialog__scrollable').length > 0)
                {
                    dialogContent.unwrap();
                }
            }
        }

        function checkScrollEnd()
        {
            var dialogScrollable = angular.element('.dialog__scrollable');

            if (angular.isDefined(scopeMap[activeDialogId].onscrollend))
            {
                if (dialogScrollable.scrollTop() + dialogScrollable.innerHeight() >= dialogScrollable[0].scrollHeight)
                {
                    scopeMap[activeDialogId].onscrollend();

                    dialogScrollable.unbind('scroll', checkScrollEnd);

                    $timeout(function()
                    {
                        dialogScrollable.bind('scroll', checkScrollEnd);
                    }, 500);
                }
            }
        }

        angular.element($window).bind('resize', function()
        {
            if (angular.isDefined(activeDialogId))
            {
                checkDialogHeight(activeDialogId);
            }
        });
    }])
    .controller('LxDialogController', ['$scope', 'LxDialogService', function($scope, LxDialogService)
    {
        this.init = function(element, id)
        {
            $scope.isOpened = false;
            $scope.element = element;
            $scope.parent = element.parent();

            LxDialogService.registerScope(id, $scope);
        };
    }])
    .directive('lxDialog', function()
    {
        return {
            restrict: 'E',
            controller: 'LxDialogController',
            scope: true,
            template: '<div><div ng-if="isOpened" ng-transclude="child"></div></div>',
            replace: true,
            transclude: true,
            link: function(scope, element, attrs, ctrl)
            {
                attrs.$observe('id', function(newId)
                {
                    if (newId)
                    {
                        ctrl.init(element, newId);
                    }
                });

                attrs.$observe('autoClose', function(newValue)
                {
                    scope.autoClose = newValue;
                });

                attrs.$observe('onclose', function(newValue)
                {
                    scope.onclose = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('onscrollend', function(newValue)
                {
                    scope.onscrollend = function()
                    {
                        return scope.$eval(newValue);
                    };
                });
            }
        };
    })
    .directive('lxDialogClose', ['LxDialogService', function(LxDialogService)
    {
        return {
            restrict: 'A',
            link: function(scope, element)
            {
                element.bind('click', function()
                {
                    LxDialogService.close(element.parents('.dialog').attr('id'));
                });
            }
        };
    }]);
