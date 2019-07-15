(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoStepperController', DemoStepperController);

    DemoStepperController.$inject = ['$q', '$scope', '$timeout', 'LxNotificationService'];

    function DemoStepperController($q, $scope, $timeout, LxNotificationService)
    {
        var vm = this;

        vm.cancel = cancel;
        vm.complete = complete;
        vm.submit = submit;
        vm.toggleLayout = toggleLayout;
        vm.validate = validate;
        vm.nextStep = nextStep;
        vm.previousStep = previousStep;
        vm.cancelStepper = cancelStepper;
        vm.toggleStepValidity = toggleStepValidity;

        vm.isValid = true;
        vm.stepperId = 'external-control-id';
        vm.stepperCompleted = false;
        vm.layout = 'horizontal';
        vm.activeStep = 0;
        vm.isStep = {
            first: true,
            last: false,
            loading: false
        };

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

        function validate()
        {
            if (vm.isValid)
            {
                return true;
            }
            else
            {
                return 'Error from validate';
            }
        }

        function nextStep()
        {
            $scope.$broadcast('lx-stepper__submit-step', vm.stepperId, vm.activeStep);
        }

        function previousStep()
        {
            $scope.$broadcast('lx-stepper__previous-step', vm.stepperId, vm.activeStep);
        }

        function cancelStepper()
        {
            $scope.$broadcast('lx-stepper__cancel', vm.stepperId);
        }

        function toggleStepValidity() 
        {
            vm.isValid = !vm.isValid;
        }

        $scope.$on('lx-stepper__step', function onStepperDialogFirstStep(evt, id, index, first, last)
        {
            if (angular.isDefined(id) && id !== vm.stepperId)
            {
                return;
            }

            vm.activeStep = index;

            vm.isStep.first = first;
            vm.isStep.last = last;

            vm.stepperCompleted = false;
        });

        $scope.$on('lx-stepper__step-loading', function(evt, id, index)
        {
            if ((angular.isDefined(id) && id !== vm.stepperId) || vm.activeStep !== index)
            {
                return;
            }

            vm.isStep.loading = true;
        });

        $scope.$on('lx-stepper__step-loaded', function(evt, id, index)
        {
            if ((angular.isDefined(id) && id !== vm.stepperId) || vm.activeStep !== index)
            {
                return;
            }

            vm.isStep.loading = false;
        });

        $scope.$on('lx-stepper__completed', function(evt, id)
        {
            if (angular.isDefined(id) && id !== vm.stepperId)
            {
                return;
            }

            vm.stepperCompleted = true;
        });
    }
})();
