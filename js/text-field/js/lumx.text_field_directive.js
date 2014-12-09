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
            transclude: true,
            replace: true,
            link: function(scope, element, attrs)
            {
                var $input = element.find('input, textarea');

                $input.addClass('text-field__input');

                if ($input.val())
                {
                    element.addClass('text-field--is-active');
                }

                $input.on('focus', function()
                {
                    element.addClass('text-field--is-focused text-field--is-active');
                });

                $input.on('input', function()
                {
                    if ((angular.isDefined(attrs.fixedLabel)) && $input.val())
                    {
                        element.addClass('text-field--label-hidden');
                    }
                    else
                    {
                        element.removeClass('text-field--label-hidden');
                    }
                });

                $input.on('blur', function()
                {
                    element.removeClass('text-field--is-focused');

                    if (!$input.val())
                    {
                        element.removeClass('text-field--is-active');
                    }
                });

                $timeout(function()
                {
                    if ($input.val())
                    {
                        element.addClass('text-field--is-active');
                    }
                });
            }
        };
    }]);
