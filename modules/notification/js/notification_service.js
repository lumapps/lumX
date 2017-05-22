(function()
{
    'use strict';

    angular
        .module('lumx.notification')
        .service('LxNotificationService', LxNotificationService);

    LxNotificationService.$inject = ['$injector', '$rootScope', '$timeout', 'LxDepthService', 'LxEventSchedulerService'];

    function LxNotificationService($injector, $rootScope, $timeout, LxDepthService, LxEventSchedulerService)
    {
        var service = this;
        var dialogFilter;
        var dialog;
        var idEventScheduler;
        var notificationList = [];
        var actionClicked = false;

        service.alert = showAlertDialog;
        service.confirm = showConfirmDialog;
        service.error = notifyError;
        service.info = notifyInfo;
        service.notify = notify;
        service.success = notifySuccess;
        service.warning = notifyWarning;

        ////////////

        //
        // NOTIFICATION
        //

        function deleteNotification(_notification, _callback)
        {
            _callback = (!angular.isFunction(_callback)) ? angular.noop : _callback;

            var notifIndex = notificationList.indexOf(_notification);

            var dnOffset = angular.isDefined(notificationList[notifIndex]) ? 24 + notificationList[notifIndex].height : 24;

            for (var idx = 0; idx < notifIndex; idx++)
            {
                if (notificationList.length > 1)
                {
                    notificationList[idx].margin -= dnOffset;
                    notificationList[idx].elem.css('marginBottom', notificationList[idx].margin + 'px');
                }
            }

            _notification.elem.removeClass('notification--is-shown');

            $timeout(function()
            {
                _notification.elem.remove();

                // Find index again because notificationList may have changed
                notifIndex = notificationList.indexOf(_notification);

                if (notifIndex != -1)
                {
                    notificationList.splice(notifIndex, 1);
                }

                _callback(actionClicked);
                actionClicked = false
            }, 400);
        }

        function getElementHeight(_elem)
        {
            return parseFloat(window.getComputedStyle(_elem, null).height);
        }

        function moveNotificationUp()
        {
            var newNotifIndex = notificationList.length - 1;
            notificationList[newNotifIndex].height = getElementHeight(notificationList[newNotifIndex].elem[0]);

            var upOffset = 0;

            for (var idx = newNotifIndex; idx >= 0; idx--)
            {
                if (notificationList.length > 1 && idx !== newNotifIndex)
                {
                    upOffset = 24 + notificationList[newNotifIndex].height;

                    notificationList[idx].margin += upOffset;
                    notificationList[idx].elem.css('marginBottom', notificationList[idx].margin + 'px');
                }
            }
        }

        function notify(_text, _icon, _sticky, _color, _action, _callback, _delay)
        {
            var $compile = $injector.get('$compile');

            LxDepthService.register();

            var notification = angular.element('<div/>',
            {
                class: 'notification'
            });
            var notificationText = angular.element('<span/>',
            {
                class: 'notification__content',
                html: _text
            });
            var notificationTimeout;
            var notificationDelay = _delay || 6000;

            if (angular.isDefined(_icon))
            {
                var notificationIcon = angular.element('<i/>',
                {
                    class: 'notification__icon mdi mdi-' + _icon
                });

                notification
                    .addClass('notification--has-icon')
                    .append(notificationIcon);
            }

            if (angular.isDefined(_color))
            {
                notification.addClass('notification--' + _color);
            }

            notification.append(notificationText);

            if (angular.isDefined(_action))
            {
                var notificationAction = angular.element('<button/>',
                {
                    class: 'notification__action btn btn--m btn--flat',
                    html: _action
                });

                if (angular.isDefined(_color))
                {
                    notificationAction.addClass('btn--' + _color);
                }
                else
                {
                    notificationAction.addClass('btn--white');
                }

                notificationAction.attr('lx-ripple', '');
                $compile(notificationAction)($rootScope);

                notificationAction.bind('click', function()
                {
                    actionClicked = true;
                });

                notification
                    .addClass('notification--has-action')
                    .append(notificationAction);
            }

            notification
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            $timeout(function()
            {
                notification.addClass('notification--is-shown');
            }, 100);

            var data = {
                elem: notification,
                margin: 0
            };
            notificationList.push(data);
            moveNotificationUp();

            notification.bind('click', function()
            {
                deleteNotification(data, _callback);

                if (angular.isDefined(notificationTimeout))
                {
                    $timeout.cancel(notificationTimeout);
                }
            });

            if (angular.isUndefined(_sticky) || !_sticky)
            {
                notificationTimeout = $timeout(function()
                {
                    deleteNotification(data, _callback);
                }, notificationDelay);
            }
        }

        function notifyError(_text, _sticky)
        {
            notify(_text, 'alert-circle', _sticky, 'red');
        }

        function notifyInfo(_text, _sticky)
        {
            notify(_text, 'information-outline', _sticky, 'blue');
        }

        function notifySuccess(_text, _sticky)
        {
            notify(_text, 'check', _sticky, 'green');
        }

        function notifyWarning(_text, _sticky)
        {
            notify(_text, 'alert', _sticky, 'orange');
        }

        //
        // ALERT & CONFIRM
        //

        function buildDialogActions(_buttons, _callback, _unbind)
        {
            var $compile = $injector.get('$compile');

            var dialogActions = angular.element('<div/>',
            {
                class: 'dialog__actions'
            });

            var dialogLastBtn = angular.element('<button/>',
            {
                class: 'btn btn--m btn--blue btn--flat',
                text: _buttons.ok
            });

            if (angular.isDefined(_buttons.cancel))
            {
                var dialogFirstBtn = angular.element('<button/>',
                {
                    class: 'btn btn--m btn--red btn--flat',
                    text: _buttons.cancel
                });

                dialogFirstBtn.attr('lx-ripple', '');
                $compile(dialogFirstBtn)($rootScope);

                dialogActions.append(dialogFirstBtn);

                dialogFirstBtn.bind('click', function()
                {
                    _callback(false);
                    closeDialog();
                });
            }

            dialogLastBtn.attr('lx-ripple', '');
            $compile(dialogLastBtn)($rootScope);

            dialogActions.append(dialogLastBtn);

            dialogLastBtn.bind('click', function()
            {
                _callback(true);
                closeDialog();
            });

            if (!_unbind)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', function(event)
                {
                    if (event.keyCode == 13)
                    {
                        _callback(true);
                        closeDialog();
                    }
                    else if (event.keyCode == 27)
                    {
                        _callback(angular.isUndefined(_buttons.cancel));
                        closeDialog();
                    }

                    event.stopPropagation();
                });
            }

            return dialogActions;
        }

        function buildDialogContent(_text)
        {
            var dialogContent = angular.element('<div/>',
            {
                class: 'dialog__content p++ pt0 tc-black-2',
                text: _text
            });

            return dialogContent;
        }

        function buildDialogHeader(_title)
        {
            var dialogHeader = angular.element('<div/>',
            {
                class: 'dialog__header p++ fs-title',
                text: _title
            });

            return dialogHeader;
        }

        function closeDialog()
        {
            if (angular.isDefined(idEventScheduler))
            {
                $timeout(function()
                {
                    LxEventSchedulerService.unregister(idEventScheduler);
                    idEventScheduler = undefined;
                }, 1);
            }

            dialogFilter.removeClass('dialog-filter--is-shown');
            dialog.removeClass('dialog--is-shown');

            $timeout(function()
            {
                dialogFilter.remove();
                dialog.remove();
            }, 600);
        }

        function showAlertDialog(_title, _text, _button, _callback, _unbind)
        {
            LxDepthService.register();

            dialogFilter = angular.element('<div/>',
            {
                class: 'dialog-filter'
            });

            dialog = angular.element('<div/>',
            {
                class: 'dialog dialog--alert'
            });

            var dialogHeader = buildDialogHeader(_title);
            var dialogContent = buildDialogContent(_text);
            var dialogActions = buildDialogActions(
            {
                ok: _button
            }, _callback, _unbind);

            dialogFilter
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            dialog
                .append(dialogHeader)
                .append(dialogContent)
                .append(dialogActions)
                .css('z-index', LxDepthService.getDepth() + 1)
                .appendTo('body')
                .show()
                .focus();

            $timeout(function()
            {
                angular.element(document.activeElement).blur();

                dialogFilter.addClass('dialog-filter--is-shown');
                dialog.addClass('dialog--is-shown');
            }, 100);
        }

        function showConfirmDialog(_title, _text, _buttons, _callback, _unbind)
        {
            LxDepthService.register();

            dialogFilter = angular.element('<div/>',
            {
                class: 'dialog-filter'
            });

            dialog = angular.element('<div/>',
            {
                class: 'dialog dialog--alert'
            });

            var dialogHeader = buildDialogHeader(_title);
            var dialogContent = buildDialogContent(_text);
            var dialogActions = buildDialogActions(_buttons, _callback, _unbind);

            dialogFilter
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            dialog
                .append(dialogHeader)
                .append(dialogContent)
                .append(dialogActions)
                .css('z-index', LxDepthService.getDepth() + 1)
                .appendTo('body')
                .show()
                .focus();

            $timeout(function()
            {
                angular.element(document.activeElement).blur();

                dialogFilter.addClass('dialog-filter--is-shown');
                dialog.addClass('dialog--is-shown');
            }, 100);
        }
    }
})();
