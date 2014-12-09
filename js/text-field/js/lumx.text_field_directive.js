/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.text-field', [])
    .directive('lxTextField', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                type: '@?',
                disabled: '&',
                error: '&',
                valid: '&',
                fixedLabel: '&',
                model: '=?'
            },
            templateUrl: 'lumx.text_field.html',
            replace: true,
            link: function(scope, element, attrs)
            {
                if (angular.isUndefined(attrs.type))
                {
                    scope.type = 'text';
                }
            }
        };
    }]);
