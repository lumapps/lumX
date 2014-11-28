/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.file-input', [])
    .directive('lxFileInput', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            scope: {
                label: '='
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
                        var file = $input.val().replace(/C:\\fakepath\\/i, '');

                        $fileName.text(file);

                        $timeout(function()
                        {
                            element.addClass('input-file--is-focused input-file--is-active');
                        });
                    })
                    .on('blur', function()
                    {
                        element.removeClass('input-file--is-focused');
                    });
            }
        };
    }]);