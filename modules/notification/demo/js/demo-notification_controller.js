(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoNotificationController', DemoNotificationController);

    DemoNotificationController.$inject = ['LxNotificationService'];

    function DemoNotificationController(LxNotificationService)
    {
        var vm = this;

        vm.alertBox = alertBox;
        vm.confirmBox = confirmBox;
        vm.notify = notify;

        ////////////

        function alertBox()
        {
            LxNotificationService.alert('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.', 'Ok', function(answer)
            {
                LxNotificationService.notify('Alert callback');
            });
        }

        function confirmBox()
        {
            LxNotificationService.confirm('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
            {
                cancel: 'Disagree',
                ok: 'Agree'
            }, function(answer)
            {
                if (answer)
                {
                    LxNotificationService.success('Agree');
                }
                else
                {
                    LxNotificationService.error('Disagree');
                }
            });
        }

        function notify(_type)
        {
            if (_type === 'simple')
            {
                LxNotificationService.notify('Lorem Ipsum');
            }
            else if (_type === 'sticky')
            {
                LxNotificationService.notify('Lorem Ipsum', undefined, true);
            }
            else if (_type === 'icon')
            {
                LxNotificationService.notify('Lorem Ipsum', 'android');
            }
            else if (_type === 'color')
            {
                LxNotificationService.notify('Lorem Ipsum', 'android', false, 'yellow');
            }
            else if (_type === 'info')
            {
                LxNotificationService.info('Lorem Ipsum');
            }
            else if (_type === 'success')
            {
                LxNotificationService.success('Lorem Ipsum');
            }
            else if (_type === 'warning')
            {
                LxNotificationService.warning('Lorem Ipsum');
            }
            else if (_type === 'error')
            {
                LxNotificationService.error('Lorem Ipsum');
            }
        }
    }
})();