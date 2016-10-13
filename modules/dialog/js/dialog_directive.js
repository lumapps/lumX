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

    function lxDialog()
    {
        return {
            restrict: 'E',
            template: '<div class="dialog" ng-class="{ \'dialog--l\': !lxDialog.size || lxDialog.size === \'l\', \'dialog--s\': lxDialog.size === \'s\', \'dialog--m\': lxDialog.size === \'m\' }"><div ng-if="lxDialog.isOpen" ng-transclude></div></div>',
            scope:
            {
                autoClose: '=?lxAutoClose',
                escapeClose: '=?lxEscapeClose',
                size: '@?lxSize'
            },
            link: link,
            controller: LxDialogController,
            controllerAs: 'lxDialog',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('id', function(_newId)
            {
                ctrl.id = _newId;
            });
        }
    }

    LxDialogController.$inject = ['$element', '$interval', '$rootScope', '$scope', '$timeout', '$window', 'LxDepthService', 'LxEventSchedulerService', 'LxUtils'];

    function LxDialogController($element, $interval, $rootScope, $scope, $timeout, $window, LxDepthService, LxEventSchedulerService, LxUtils)
    {
        var lxDialog = this;
        var dialogFilter = angular.element('<div/>',
        {
            class: 'dialog-filter'
        });
        var dialogHeight;
        var dialogInterval;
        var dialogScrollable;
        var elementParent = $element.parent();
        var idEventScheduler;
        var resizeDebounce;
        var windowHeight;

        lxDialog.autoClose = angular.isDefined(lxDialog.autoClose) ? lxDialog.autoClose : true;
        lxDialog.escapeClose = angular.isDefined(lxDialog.escapeClose) ? lxDialog.escapeClose : true;
        lxDialog.isOpen = false;
        lxDialog.uuid = LxUtils.generateUUID();

        $scope.$on('lx-dialog__open', function(event, id)
        {
            if (id === lxDialog.id)
            {
                open();
            }
        });

        $scope.$on('lx-dialog__close', function(event, id)
        {
            if (id === lxDialog.id)
            {
                close();
            }
        });

        $scope.$on('$destroy', function()
        {
            close();
        });

        ////////////

        function checkDialogHeight()
        {
            var dialog = $element;
            var dialogHeader = dialog.find('.dialog__header');
            var dialogContent = dialog.find('.dialog__content');
            var dialogFooter = dialog.find('.dialog__footer');

            if (!dialogFooter.length)
            {
                dialogFooter = dialog.find('.dialog__actions');
            }

            if (angular.isUndefined(dialogHeader))
            {
                return;
            }

            var heightToCheck = 60 + dialogHeader.outerHeight() + dialogContent.outerHeight() + dialogFooter.outerHeight();

            if (dialogHeight === heightToCheck && windowHeight === $window.innerHeight)
            {
                return;
            }

            dialogHeight = heightToCheck;
            windowHeight = $window.innerHeight;

            if (heightToCheck >= $window.innerHeight)
            {
                dialog.addClass('dialog--is-fixed');

                dialogScrollable
                    .css(
                    {
                        top: dialogHeader.outerHeight(),
                        bottom: dialogFooter.outerHeight()
                    })
                    .off('scroll', checkScrollEnd)
                    .on('scroll', checkScrollEnd);
            }
            else
            {
                dialog.removeClass('dialog--is-fixed');

                dialogScrollable
                    .removeAttr('style')
                    .off('scroll', checkScrollEnd);
            }
        }

        function checkDialogHeightOnResize()
        {
            if (resizeDebounce)
            {
                $timeout.cancel(resizeDebounce);
            }

            resizeDebounce = $timeout(function()
            {
                checkDialogHeight();
            }, 200);
        }

        function checkScrollEnd()
        {
            if (dialogScrollable.scrollTop() + dialogScrollable.innerHeight() >= dialogScrollable[0].scrollHeight)
            {
                $rootScope.$broadcast('lx-dialog__scroll-end', lxDialog.id);

                dialogScrollable.off('scroll', checkScrollEnd);

                $timeout(function()
                {
                    dialogScrollable.on('scroll', checkScrollEnd);
                }, 500);
            }
        }

        function onKeyUp(_event)
        {
            if (_event.keyCode == 27)
            {
                close();
            }

            _event.stopPropagation();
        }

        function open()
        {
            if (lxDialog.isOpen)
            {
                return;
            }
            
            LxDepthService.register();

            angular.element('body').addClass('no-scroll-dialog-' + lxDialog.uuid);

            dialogFilter
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            if (lxDialog.autoClose)
            {
                dialogFilter.on('click', function()
                {
                    close();
                });
            }

            if (lxDialog.escapeClose)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            $element
                .css('z-index', LxDepthService.getDepth() + 1)
                .appendTo('body')
                .show();

            $timeout(function()
            {
                $rootScope.$broadcast('lx-dialog__open-start', lxDialog.id);

                lxDialog.isOpen = true;

                dialogFilter.addClass('dialog-filter--is-shown');
                $element.addClass('dialog--is-shown');
            }, 100);

            $timeout(function()
            {
                if ($element.find('.dialog__scrollable').length === 0)
                {
                    $element.find('.dialog__content').wrap(angular.element('<div/>',
                    {
                        class: 'dialog__scrollable'
                    }));
                }

                dialogScrollable = $element.find('.dialog__scrollable');
            }, 200);

            $timeout(function()
            {
                $rootScope.$broadcast('lx-dialog__open-end', lxDialog.id);
            }, 700);

            dialogInterval = $interval(function()
            {
                checkDialogHeight();
            }, 500);

            angular.element($window).on('resize', checkDialogHeightOnResize);
        }

        function close()
        {
            if (!lxDialog.isOpen)
            {
                return;
            }
            
            if (angular.isDefined(idEventScheduler))
            {
                LxEventSchedulerService.unregister(idEventScheduler);
                idEventScheduler = undefined;
            }

            angular.element($window).off('resize', checkDialogHeightOnResize);
            $element.find('.dialog__scrollable').off('scroll', checkScrollEnd);

            $rootScope.$broadcast('lx-dialog__close-start', lxDialog.id);

            if (resizeDebounce)
            {
                $timeout.cancel(resizeDebounce);
            }

            $interval.cancel(dialogInterval);

            dialogFilter.removeClass('dialog-filter--is-shown');
            $element.removeClass('dialog--is-shown');

            $timeout(function()
            {
                angular.element('body').removeClass('no-scroll-dialog-' + lxDialog.uuid);

                dialogFilter.remove();

                $element
                    .hide()
                    .removeClass('dialog--is-fixed')
                    .appendTo(elementParent);

                lxDialog.isOpen = false;
                dialogHeight = undefined;
                $rootScope.$broadcast('lx-dialog__close-end', lxDialog.id);
            }, 600);
        }
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
