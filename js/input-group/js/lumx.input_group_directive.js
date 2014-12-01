/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.input-group', [])
    .directive('lxInputGroup', function()
    {
        return {
            restrict: 'E',
            scope: {
                label: '=',
                isDisabled: '=?',
                hasError: '=?',
                isValid: '=?',
                fixedLabel: '=?'
            },
            templateUrl: 'lumx.input_group.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs)
            {
                var $input = element.find('input, textarea');

                scope.isDisabled = angular.isDefined(scope.isDisabled) ? scope.isDisabled : angular.isDefined(attrs.isDisabled);
                scope.hasError = angular.isDefined(scope.hasError) ? scope.hasError : angular.isDefined(attrs.hasError);
                scope.isValid = angular.isDefined(scope.isValid) ? scope.isValid : angular.isDefined(attrs.isValid);
                scope.fixedLabel = angular.isDefined(scope.fixedLabel) ? scope.fixedLabel : angular.isDefined(attrs.fixedLabel);

                $input.addClass('input-group__input');

                if ($input.val())
                {
                    element.addClass('input-group--is-active');
                }

                $input.on('focus', function()
                {
                    element.addClass('input-group--is-focused input-group--is-active');
                });

                $input.on('input', function()
                {
                    if ((angular.isDefined(attrs.fixedLabel)) && $input.val())
                    {
                        element.addClass('input-group--label-hidden');
                    }
                    else
                    {
                        element.removeClass('input-group--label-hidden');
                    }
                });

                $input.on('blur', function()
                {
                    element.removeClass('input-group--is-focused');

                    if (!$input.val())
                    {
                        element.removeClass('input-group--is-active');
                    }
                });
            }
        };
    });
