/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dialog', [])
    .service('LxDialogService', ['$timeout', function($timeout)
    {
        var self = this,
            dialogFilter,
            scopeMap = {};

        this.registerScope = function(dialogId, dialogScope)
        {
            scopeMap[dialogId] = dialogScope;
        };

        this.open = function(dialogId)
        {
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
        };

        this.close = function(dialogId)
        {
            dialogFilter.removeClass('dialog-filter--is-shown');
            scopeMap[dialogId].element.removeClass('dialog--is-shown');

            $timeout(function()
            {
                dialogFilter.remove();

                scopeMap[dialogId].element
                    .hide()
                    .appendTo(scopeMap[dialogId].parent);
            }, 600);
        };
    }])
    .controller('LxDialogController', ['$scope', 'LxDialogService', function($scope, LxDialogService)
    {
        var dialogScope = $scope.$new();

        this.init = function(element, dialogId)
        {
            dialogScope.element = element;
            dialogScope.parent = element.parent();

            LxDialogService.registerScope(dialogId, dialogScope);
        };

        $scope.$on('$destroy', function()
        {
            dialogScope.$destroy();
        });
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

                scope.$watch(function()
                {
                    return attrs.id;
                },
                function(newValue)
                {
                    if (newValue)
                    {
                        ctrl.init(element, attrs.id);
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
