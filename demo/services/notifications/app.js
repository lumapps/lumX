/* global angular */
'use strict'; // jshint ignore:line


var app = angular.module('lx.notification', ['lumx.notification', 'lumx.dropdown', 'lumx.ripple', 'hljs', 'Sidebar']);

app.controller('NotificationController', function($scope, LxNotificationService, SidebarService)
{
    $scope.SidebarService = SidebarService;

    $scope.notify = function(type)
    {
        if (type === 'simple')
        {
            LxNotificationService.notify('Lorem Ipsum');
        }
        else if (type === 'sticky')
        {
            LxNotificationService.notify('Lorem Ipsum', undefined, true);
        }
        else if (type === 'icon')
        {
            LxNotificationService.notify('Lorem Ipsum', 'android');
        }
        else if (type === 'color')
        {
            LxNotificationService.notify('Lorem Ipsum', 'android', false, 'green');
        }
        else if (type === 'info')
        {
            LxNotificationService.info('Lorem Ipsum');
        }
        else if (type === 'success')
        {
            LxNotificationService.success('Lorem Ipsum');
        }
        else if (type === 'warning')
        {
            LxNotificationService.warning('Lorem Ipsum');
        }
        else if (type === 'error')
        {
            LxNotificationService.error('Lorem Ipsum');
        }
    };

    $scope.alert = function()
    {
        LxNotificationService.alert('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.', 'Ok', function(answer)
        {
            console.log(answer);
        });
    };

    $scope.confirm = function()
    {
        LxNotificationService.confirm('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.', { cancel:'Disagree', ok:'Agree' }, function(answer)
        {
            console.log(answer);
        });
    };
});
