/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.text-field', [])
    .directive('lxTextField', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                disabled: '&',
                error: '&',
                valid: '&',
                fixedLabel: '&'
            },
            templateUrl: 'lumx.text_field.html',
            replace: true,
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude)
            {
                var modelController;

                scope.data = {
                    focused: false,
                    model: ''
                };

                function focusUpdate()
                {
                    scope.data.focused = true;
                    scope.$apply();
                }

                function blurUpdate()
                {
                    scope.data.focused = false;
                    scope.$apply();
                }

                function modelUpdate()
                {
                    scope.data.model = modelController.$viewValue;
                }

                transclude(function()
                {
                    scope.data.model = '';
                    if (modelController && modelController.$viewChangeListeners.indexOf(modelUpdate) !== -1)
                    {
                        modelController.$viewChangeListeners.splice(modelController.$viewChangeListeners.indexOf(modelUpdate), 1);
                    }

                    var $field = element.find('textarea');

                    if ($field[0])
                    {
                        $field.on('cut paste drop keydown', function()
                        {
                            $timeout(function()
                            {
                                $field
                                    .removeAttr('style')
                                    .css({ height: $field[0].scrollHeight + 'px' });
                            });
                        });
                    }
                    else
                    {
                        $field = element.find('input');
                    }

                    $field.on('focus', focusUpdate);
                    $field.on('blur', blurUpdate);

                    modelController = angular.element($field).data('$ngModelController');
                    modelController.$viewChangeListeners.push(modelUpdate);

                    $timeout(function()
                    {
                        $field.addClass('text-field__input');
                        modelUpdate();
                    });
                });
            }
        };
    }]);
