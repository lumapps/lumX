(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoDialogController', DemoDialogController);

    DemoDialogController.$inject = ['$scope', 'LxDialogService', 'LxNotificationService'];

    function DemoDialogController($scope, LxDialogService, LxNotificationService)
    {
        var vm = this;

        vm.addPerson = addPerson;
        vm.dialogId = 'dialog-test';
        vm.openDialog = openDialog;

        vm.people = [
        {
            name: 'Adam',
            email: 'adam@email.com',
            age: 10
        },
        {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12
        },
        {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30
        },
        {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 31
        },
        {
            name: 'Estefanía',
            email: 'estefanía@email.com',
            age: 16
        },
        {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54
        },
        {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43
        },
        {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21
        }];

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            if (vm.dialogId === _dialogId)
            {
                LxNotificationService.notify('Open start');
            }
        });

        $scope.$on('lx-dialog__open-end', function(_event, _dialogId)
        {
            if (vm.dialogId === _dialogId)
            {
                LxNotificationService.notify('Open end');
            }
        });

        $scope.$on('lx-dialog__close-start', function(_event, _dialogId)
        {
            if (vm.dialogId === _dialogId)
            {
                LxNotificationService.notify('Close start');
            }
        });

        $scope.$on('lx-dialog__close-end', function(_event, _dialogId)
        {
            if (vm.dialogId === _dialogId)
            {
                LxNotificationService.notify('Close end');
            }
        });

        $scope.$on('lx-dialog__scroll-end', function(_event, _dialogId)
        {
            if (vm.dialogId === _dialogId)
            {
                LxNotificationService.notify('Scroll end');
            }
        });

        ////////////

        function addPerson()
        {
            vm.people.push(
            {
                name: 'Lorem',
                email: 'lorem@email.com',
                age: 99
            });
        }

        function openDialog()
        {
            LxDialogService.open(vm.dialogId);
        }
    }
})();