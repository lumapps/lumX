(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoStepperController', DemoStepperController);

    DemoStepperController.$inject = ['$q', '$timeout', 'LxNotificationService'];

    function DemoStepperController($q, $timeout, LxNotificationService)
    {
        var vm = this;

        vm.cancel = cancel;
        vm.complete = complete;
        vm.submit = submit;
        vm.validate = validate;

        ////////////

        function cancel()
        {
            LxNotificationService.info('Cancel');
        }

        function complete()
        {
           LxNotificationService.success('Complete');
        }

        function submit(isValid)
        {
            return $q(function(resolve, reject)
            {
                $timeout(function()
                {
                    if (isValid)
                    {
                        resolve(3);
                    }
                    else
                    {
                        reject('Error from submit');
                    }
                }, 1000);
            });
        }

        function validate(isValid)
        {
            if (isValid)
            {
                return true;
            }
            else
            {
                return 'Error from validate';
            }
        }
    }
})();
