/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dialog', [])
    .service('LxDialogService', ['$timeout', '$interval', '$window', function($timeout, $interval, $window)
    {
        var self = this,
            dialogInterval,
            dialogFilter,
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

            dialogFilter
                .appendTo('body')
                .bind('click', function()
                {
                    self.close(dialogId);
                });

            scopeMap[dialogId].element
                .appendTo('body')
                .show();

            $timeout(function()
            {
                dialogFilter.addClass('dialog-filter--is-shown');
                scopeMap[dialogId].element.addClass('dialog--is-shown');
            }, 100);

            dialogInterval = $interval(function()
            {
                console.log('interval');
                if (scopeMap[dialogId].element.outerHeight() !== scopeMap[dialogId].outerHeight)
                {
                    checkDialogHeight(dialogId);
                }
            }, 500);
        };

        this.close = function(dialogId)
        {
            activeDialogId = undefined;

            $interval.cancel(dialogInterval);

            dialogFilter.removeClass('dialog-filter--is-shown');
            scopeMap[dialogId].element.removeClass('dialog--is-shown');

            $timeout(function()
            {
                dialogFilter.remove();

                scopeMap[dialogId].element
                    .hide()
                    .removeClass('dialog--is-fixed')
                    .appendTo(scopeMap[dialogId].parent);
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
                    dialogScrollable.css({ top: dialogHeader.outerHeight(), bottom: dialogActions.outerHeight() });
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
        var dialogScope = $scope.$new();

        this.init = function(element, id)
        {
            dialogScope.element = element;
            dialogScope.parent = element.parent();
            dialogScope.outerHeight = element.outerHeight();

            LxDialogService.registerScope(id, dialogScope);
        };
    }])
    .directive('lxDialog', function()
    {
        return {
            restrict: 'A',
            controller: 'LxDialogController',
            scope: {},
            link: function(scope, element, attrs, ctrl)
            {
                element.on('click', function(event)
                {
                    event.stopPropagation();
                });

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
