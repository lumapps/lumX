(function()
{
    'use strict';

    angular
        .module('lumx.stepper')
        .directive('lxStepper', lxStepper)
        .directive('lxStep', lxStep)
        .directive('lxStepNav', lxStepNav);

    /* Stepper */
    function lxStepper()
    {
        return {
            restrict: 'E',
            templateUrl: 'stepper.html',
            scope: {
                cancel: '&?lxCancel',
                complete: '&lxComplete',
                isLinear: '=?lxIsLinear',
                labels: '=?lxLabels',
                layout: '@?lxLayout'
            },
            controller: LxStepperController,
            controllerAs: 'lxStepper',
            bindToController: true,
            transclude: true
        };
    }

    function LxStepperController()
    {
        var lxStepper = this;

        var _classes = [];
        var _defaultValues = {
            isLinear: true,
            labels: {
                'back': 'Back',
                'cancel': 'Cancel',
                'continue': 'Continue',
                'optional': 'Optional'
            },
            layout: 'horizontal'
        };

        lxStepper.addStep = addStep;
        lxStepper.getClasses = getClasses;
        lxStepper.goToStep = goToStep;
        lxStepper.isComplete = isComplete;
        lxStepper.updateStep = updateStep;

        lxStepper.activeIndex = 0;
        lxStepper.isLinear = angular.isDefined(lxStepper.isLinear) ? lxStepper.isLinear : _defaultValues.isLinear;
        lxStepper.labels = angular.isDefined(lxStepper.labels) ? lxStepper.labels : _defaultValues.labels;
        lxStepper.layout = angular.isDefined(lxStepper.layout) ? lxStepper.layout : _defaultValues.layout;
        lxStepper.steps = [];

        ////////////

        function addStep(step)
        {
            lxStepper.steps.push(step);
        }

        function getClasses()
        {
            _classes.length = 0;

            _classes.push('lx-stepper--layout-' + lxStepper.layout);

            if (lxStepper.isLinear)
            {
                _classes.push('lx-stepper--is-linear');
            }

            if (lxStepper.steps[lxStepper.activeIndex].feedback)
            {
                _classes.push('lx-stepper--step-has-feedback');
            }

            if (lxStepper.steps[lxStepper.activeIndex].isLoading)
            {
                _classes.push('lx-stepper--step-is-loading');
            }

            return _classes;
        }

        function goToStep(index, bypass)
        {
            // Check if the the wanted step previous steps are optionals. If so, check if the step before the last optional step is valid to allow going to the wanted step from the nav (only if linear stepper).
            var stepBeforeLastOptionalStep;
            if (!bypass && lxStepper.isLinear)
            {
                for (var i = index - 1; i >= 0; i--)
                {
                    if (angular.isDefined(lxStepper.steps[i]) && !lxStepper.steps[i].isOptional)
                    {
                        stepBeforeLastOptionalStep = lxStepper.steps[i];
                        break;
                    }
                }

                if (angular.isDefined(stepBeforeLastOptionalStep) && stepBeforeLastOptionalStep.isValid === true)
                {
                    bypass = true;
                }
            }

            // Check if the wanted step previous step is not valid to disallow going to the wanted step from the nav (only if linear stepper).
            if (!bypass && lxStepper.isLinear && angular.isDefined(lxStepper.steps[index - 1]) && (angular.isUndefined(lxStepper.steps[index - 1].isValid) || lxStepper.steps[index - 1].isValid === false))
            {
                return;
            }

            if (index < lxStepper.steps.length)
            {
                lxStepper.activeIndex = parseInt(index);
            }
        }

        function isComplete()
        {
            var countMandatory = 0;
            var countValid = 0;

            for (var i = 0, len = lxStepper.steps.length; i < len; i++)
            {
                if (!lxStepper.steps[i].isOptional)
                {
                    countMandatory++;

                    if (lxStepper.steps[i].isValid === true) {
                        countValid++;
                    }
                }
            }

            if (countValid === countMandatory)
            {
                lxStepper.complete();
                return true;
            }
        }

        function updateStep(step)
        {
            for (var i = 0, len = lxStepper.steps.length; i < len; i++)
            {
                if (lxStepper.steps[i].uuid === step.uuid)
                {
                    lxStepper.steps[i].index = step.index;
                    lxStepper.steps[i].label = step.label;
                    return;
                }
            }
        }
    }

    /* Step */
    function lxStep()
    {
        return {
            restrict: 'E',
            require: ['lxStep', '^lxStepper'],
            templateUrl: 'step.html',
            scope: {
                feedback: '@?lxFeedback',
                isEditable: '=?lxIsEditable',
                isOptional: '=?lxIsOptional',
                label: '@lxLabel',
                submit: '&?lxSubmit',
                validate: '&?lxValidate'
            },
            link: link,
            controller: LxStepController,
            controllerAs: 'lxStep',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].init(ctrls[1], element.index());

            attrs.$observe('lxFeedback', function(feedback)
            {
                ctrls[0].setFeedback(feedback);
            });

            attrs.$observe('lxLabel', function(label)
            {
                ctrls[0].setLabel(label);
            });

            attrs.$observe('lxIsEditable', function(isEditable)
            {
                ctrls[0].setIsEditable(isEditable);
            });

            attrs.$observe('lxIsOptional', function(isOptional)
            {
                ctrls[0].setIsOptional(isOptional);
            });
        }
    }

    LxStepController.$inject = ['$q', 'LxNotificationService', 'LxUtils'];

    function LxStepController($q, LxNotificationService, LxUtils)
    {
        var lxStep = this;

        var _classes = [];
        var _nextStepIndex;

        lxStep.getClasses = getClasses;
        lxStep.init = init;
        lxStep.previousStep = previousStep;
        lxStep.setFeedback = setFeedback;
        lxStep.setLabel = setLabel;
        lxStep.setIsEditable = setIsEditable;
        lxStep.setIsOptional = setIsOptional;
        lxStep.submitStep = submitStep;

        lxStep.step = {
            errorMessage: undefined,
            feedback: undefined,
            index: undefined,
            isEditable: false,
            isLoading: false,
            isOptional: false,
            isValid: undefined,
            label: undefined,
            uuid: LxUtils.generateUUID()
        };

        ////////////

        function getClasses()
        {
            _classes.length = 0;

            if (lxStep.step.index === lxStep.parent.activeIndex)
            {
                _classes.push('lx-step--is-active');
            }

            return _classes;
        }

        function init(parent, index)
        {
            lxStep.parent = parent;
            lxStep.step.index = index;

            lxStep.parent.addStep(lxStep.step);
        }

        function previousStep()
        {
            if (lxStep.step.index > 0)
            {
                lxStep.parent.goToStep(lxStep.step.index - 1);
            }
        }

        function setFeedback(feedback)
        {
            lxStep.step.feedback = feedback;
            updateParentStep();
        }

        function setLabel(label)
        {
            lxStep.step.label = label;
            updateParentStep();
        }

        function setIsEditable(isEditable)
        {
            lxStep.step.isEditable = isEditable;
            updateParentStep();
        }

        function setIsOptional(isOptional)
        {
            lxStep.step.isOptional = isOptional;
            updateParentStep();
        }

        function submitStep()
        {
            if (lxStep.step.isValid === true && !lxStep.step.isEditable)
            {
                lxStep.parent.goToStep(_nextStepIndex, true);
                return;
            }

            var validateFunction = lxStep.validate;
            var validity = true;

            if (angular.isFunction(validateFunction))
            {
                validity = validateFunction();
            }

            if (validity === true)
            {
                lxStep.step.isLoading = true;
                updateParentStep();

                var submitFunction = lxStep.submit;

                if (!angular.isFunction(submitFunction))
                {
                    submitFunction = function()
                    {
                        return $q(function(resolve)
                        {
                            resolve();
                        });
                    };
                }

                var promise = submitFunction();

                promise.then(function(nextStepIndex)
                {
                    lxStep.step.isValid = true;
                    updateParentStep();

                    var isComplete = lxStep.parent.isComplete();

                    if (!isComplete)
                    {
                        _nextStepIndex = angular.isDefined(nextStepIndex) && nextStepIndex > lxStep.parent.activeIndex && (!lxStep.parent.isLinear || (lxStep.parent.isLinear && lxStep.parent.steps[nextStepIndex - 1].isOptional)) ? nextStepIndex : lxStep.step.index + 1;

                        lxStep.parent.goToStep(_nextStepIndex, true);
                    }
                }).catch(function(error)
                {
                    LxNotificationService.error(error);
                }).finally(function()
                {
                    lxStep.step.isLoading = false;
                    updateParentStep();
                });
            }
            else
            {
                lxStep.step.isValid = false;
                lxStep.step.errorMessage = validity;
                updateParentStep();
            }
        }

        function updateParentStep()
        {
            lxStep.parent.updateStep(lxStep.step);
        }
    }

    /* Step nav */
    function lxStepNav()
    {
        return {
            restrict: 'E',
            require: ['lxStepNav', '^lxStepper'],
            templateUrl: 'step-nav.html',
            scope: {
                activeIndex: '@lxActiveIndex',
                step: '=lxStep'
            },
            link: link,
            controller: LxStepNavController,
            controllerAs: 'lxStepNav',
            bindToController: true,
            replace: true,
            transclude: false
        };

        function link(scope, element, attrs, ctrls)
        {
            ctrls[0].init(ctrls[1]);
        }
    }

    function LxStepNavController()
    {
        var lxStepNav = this;

        var _classes = [];

        lxStepNav.getClasses = getClasses;
        lxStepNav.init = init;

        ////////////

        function getClasses()
        {
            _classes.length = 0;

            if (parseInt(lxStepNav.step.index) === parseInt(lxStepNav.activeIndex))
            {
                _classes.push('lx-step-nav--is-active');
            }

            if (lxStepNav.step.isValid === true)
            {
                _classes.push('lx-step-nav--is-valid');
            }
            else if (lxStepNav.step.isValid === false)
            {
                _classes.push('lx-step-nav--has-error');
            }

            if (lxStepNav.step.isEditable)
            {
                _classes.push('lx-step-nav--is-editable');
            }

            if (lxStepNav.step.isOptional)
            {
                _classes.push('lx-step-nav--is-optional');
            }

            return _classes;
        }

        function init(parent, index)
        {
            lxStepNav.parent = parent;
        }
    }
})();