/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.file-input', [])
    .directive('lxFileInput', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            scope: {
                label: '=',
                value: '=',
                change: '='
            },
            templateUrl: 'lumx.file_input.html',
            replace: true,
            link: function(scope, element)
            {
                var $input = element.find('input');
                var $fileName = element.find('.input-file__filename');

                $input
                    .addClass('input-file__input')
                    .on('change', function()
                    {
                        setFileName($input.val());
                        element.addClass('input-file--is-focused');

                        // Handle change function
                        if(angular.isDefined(scope.change))
                        {
                            // return the DOM input element to the callback
                            scope.change($input[0]);
                        }
                    })
                    .on('blur', function()
                    {
                        element.removeClass('input-file--is-focused');
                    });

                function setFileName(val)
                {
                    if(angular.isDefined(val))
                    {
                        $fileName.text(val.replace(/C:\\fakepath\\/i, ''));
                        val === '' ? $input.val('') : element.addClass('input-file--is-active');
                    }
                }

                scope.$watch('value', function(value)
                {
                    setFileName(value);
                });
            }
        };
    }]);