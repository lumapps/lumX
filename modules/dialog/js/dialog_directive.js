/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dialog', [])
    .service('LxDialogService', ['$timeout', '$interval', '$window', function($timeout, $interval, $window)
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

            $interval.cancel(dialogInterval);

            dialogFilter.removeClass('dialog-filter--is-shown');
            scopeMap[dialogId].element.removeClass('dialog--is-shown');
            scopeMap[dialogId].onclose();

            $timeout(function()
            {
                dialogFilter.remove();

                scopeMap[dialogId].element
                    .hide()
                    .removeClass('dialog--is-fixed')
                    .appendTo(scopeMap[dialogId].parent);

                scopeMap[dialogId].isOpened = false;
                dialogHeight = undefined;
                scopeMap[dialogId].$destroy();
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
                        .bind('mousewheel', function(e)
                        {
                            var event = e.originalEvent,
                                d = event.wheelDelta || -event.detail;

                            this.scrollTop += ( d < 0 ? 1 : -1 ) * 30;
                            e.preventDefault();
                        })
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
            scope: {
                onclose: '&',
                onscrollend: '&',
                autoClose: '@'
            },
            template: '<div><div ng-if="isOpened" ng-transclude="2"></div></div>',
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
