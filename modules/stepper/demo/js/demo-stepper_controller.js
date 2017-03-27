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
        vm.toggleLayout = toggleLayout;
        vm.validate = validate;

        vm.layout = 'horizontal';

        ////////////

        function cancel()
        {
            LxNotificationService.info('Cancel');
        }

        function complete()
        {
           LxNotificationService.success('Complete');
        }

        function submit(isValid, nextStepIndex)
        {
            return $q(function(resolve, reject)
            {
                $timeout(function()
                {
                    if (isValid)
                    {
                        resolve(nextStepIndex);
                    }
                    else
                    {
                        reject('Error from submit');
                    }
                }, 1000);
            });
        }

        function toggleLayout()
        {
            vm.layout = vm.layout === 'horizontal' ? 'vertical' : 'horizontal';
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
