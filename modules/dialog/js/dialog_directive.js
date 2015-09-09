/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dialog', ['lumx.utils.event-scheduler'])
    .service('LxDialogService', ['$rootScope', '$timeout', '$interval', '$window', 'LxEventSchedulerService', function($rootScope, $timeout, $interval, $window, LxEventSchedulerService)
    {
        var self = this,
            dialogInterval,
            dialogFilter,
            dialogHeight,
            windowHeight,
            activeDialogId,
            scopeMap = {},
            dialog,
            dialogHeader,
            dialogContent,
            dialogActions,
            dialogScrollable,
            resizeDebounce,
            idEventScheduler;

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

            if (angular.isUndefined(scopeMap[dialogId].lxDialogAutoClose) || scopeMap[dialogId].lxDialogAutoClose === 'true')
            {
                dialogFilter.on('click', function()
                {
                    self.close(dialogId);
                });
            }

            if (angular.isUndefined(scopeMap[dialogId].lxDialogEscapeClose) || scopeMap[dialogId].lxDialogEscapeClose === 'true')
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            scopeMap[dialogId].lxDialogElement
                .appendTo('body')
                .show();

            $timeout(function()
            {
                scopeMap[dialogId].lxDialogIsOpened = true;

                dialogFilter.addClass('dialog-filter--is-shown');
                scopeMap[dialogId].lxDialogElement.addClass('dialog--is-shown');

                $timeout(function()
                {
                    $rootScope.$broadcast('lx-dialog__open-end', dialogId);
                }, 600);
            }, 100);

            dialogInterval = $interval(function()
            {
                checkDialogHeight(dialogId);
            }, 500);
        };

        this.close = function(dialogId, skipBeforeClose)
        {
            var carryOnClose = function()
            {
                if (angular.isDefined(idEventScheduler))
                {
                    $timeout(function()
                    {
                        LxEventSchedulerService.unregister(idEventScheduler);
                        idEventScheduler = undefined;
                    }, 1);
                }

                angular.element('.dialog__scrollable').off('scroll', checkScrollEnd);

                activeDialogId = undefined;
                $rootScope.$broadcast('lx-dialog__close-start', dialogId);
                if (resizeDebounce)
                {
                    $timeout.cancel(resizeDebounce);
                }

                $interval.cancel(dialogInterval);

                dialogFilter.removeClass('dialog-filter--is-shown');
                scopeMap[dialogId].lxDialogElement.removeClass('dialog--is-shown');

                if (scopeMap[dialogId].lxDialogOnclose)
                {
                    scopeMap[dialogId].lxDialogOnclose();
                }

                $timeout(function()
                {
                    angular.element('body').css({
                        overflow: 'visible'
                    });

                    dialogFilter.remove();

                    dialog = undefined;
                    dialogHeader = undefined;
                    dialogContent = undefined;
                    dialogActions = undefined;
                    dialogScrollable = undefined;

                    scopeMap[dialogId].lxDialogElement
                        .hide()
                        .removeClass('dialog--is-fixed')
                        .appendTo(scopeMap[dialogId].lxDialogParent);

                    scopeMap[dialogId].lxDialogIsOpened = false;
                    dialogHeight = undefined;
                    $rootScope.$broadcast('lx-dialog__close-end', dialogId);
                }, 600);
            };

            if (skipBeforeClose || angular.isUndefined(scopeMap[dialogId].lxDialogBeforeClose) || !angular.isFunction(scopeMap[dialogId].lxDialogBeforeClose))
            {
                carryOnClose();
            }
            else
            {
                var carryOn = scopeMap[dialogId].lxDialogBeforeClose();

                if (angular.isObject(carryOn) && angular.isDefined(carryOn.then))
                {
                    carryOn.then(carryOnClose);
                }
                else
                {
                    if (carryOn)
                    {
                        carryOnClose();
                    }
                }
            }
        };

        function onKeyUp(event)
        {
            if (event.keyCode == 27 && angular.isDefined(activeDialogId))
            {
                self.close(activeDialogId);
            }

            event.stopPropagation();
        }

        function checkDialogHeight(dialogId)
        {
            if (angular.isUndefined(dialogHeader))
            {
                dialog = scopeMap[dialogId].lxDialogElement;
                dialogHeader = dialog.find('.dialog__header');
                dialogContent = dialog.find('.dialog__content');
                dialogActions = dialog.find('.dialog__actions');

                if (angular.isUndefined(dialogHeader))
                {
                    return;
                }
            }

            var dialogMargin = 60;
            var heightToCheck = dialogMargin + dialogHeader.outerHeight() + dialogContent.outerHeight() + dialogActions.outerHeight();

            if (dialogHeight === heightToCheck && windowHeight === $window.innerHeight)
            {
                return;
            }

            dialogHeight = heightToCheck;
            windowHeight = $window.innerHeight;

            if (heightToCheck >= $window.innerHeight)
            {
                dialog.addClass('dialog--is-fixed');

                if (dialog.find('.dialog__scrollable').length === 0)
                {
                    var dialogScrollable = angular.element('<div/>', { class: 'dialog__scrollable' });
                    dialogScrollable
                        .css({ top: dialogHeader.outerHeight(), bottom: dialogActions.outerHeight() })
                        .on('scroll', checkScrollEnd);

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
            if (angular.isUndefined(dialogScrollable))
            {
                dialogScrollable = angular.element('.dialog__scrollable');

                if (angular.isUndefined(dialogScrollable))
                {
                    return;
                }
            }

            if (angular.isDefined(scopeMap[activeDialogId]) && angular.isDefined(scopeMap[activeDialogId].lxDialogOnscrollend))
            {
                if (dialogScrollable.scrollTop() + dialogScrollable.innerHeight() >= dialogScrollable[0].scrollHeight)
                {
                    scopeMap[activeDialogId].lxDialogOnscrollend();

                    dialogScrollable.off('scroll', checkScrollEnd);

                    $timeout(function()
                    {
                        dialogScrollable.on('scroll', checkScrollEnd);
                    }, 500);
                }
            }
        }

        angular.element($window).on('resize', function()
        {
            if (angular.isDefined(activeDialogId))
            {
                if (resizeDebounce)
                {
                    $timeout.cancel(resizeDebounce);
                }

                resizeDebounce = $timeout(function()
                {
                    checkDialogHeight(activeDialogId);
                }, 200);
            }
        });
    }])
    .controller('LxDialogController', ['$scope', 'LxDialogService', function($scope, LxDialogService)
    {
        this.init = function(element, id)
        {
            $scope.lxDialogIsOpened = false;
            $scope.lxDialogElement = element;
            $scope.lxDialogParent = element.parent();

            LxDialogService.registerScope(id, $scope);
        };
    }])
    .directive('lxDialog', function()
    {
        return {
            restrict: 'E',
            controller: 'LxDialogController',
            scope: true,
            template: '<div><div ng-if="lxDialogIsOpened" ng-transclude="child"></div></div>',
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
                    scope.lxDialogAutoClose = newValue;
                });

                attrs.$observe('escapeClose', function(newValue)
                {
                    scope.lxDialogEscapeClose = newValue;
                });

                attrs.$observe('beforeClose', function(newValue)
                {
                    scope.lxDialogBeforeClose = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('onclose', function(newValue)
                {
                    scope.lxDialogOnclose = function()
                    {
                        return scope.$eval(newValue);
                    };
                });

                attrs.$observe('onscrollend', function(newValue)
                {
                    scope.lxDialogOnscrollend = function()
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
            scope: true,
            link: function(scope, element, attrs)
            {
                attrs.$observe('lxDialogClose', function(newValue)
                {
                    scope.lxDialogCloseSkipBefore = newValue;
                });

                element.on('click', function()
                {
                    LxDialogService.close(element.parents('.dialog').attr('id'), scope.lxDialogCloseSkipBefore);
                });
            }
        };
    }]);
