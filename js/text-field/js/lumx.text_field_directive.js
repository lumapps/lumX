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
                name: '@?fieldName',
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
                scope.data = {
                    focused: false,
                    model: ''
                };

                if (angular.isUndefined(attrs.type))
                {
                    scope.type = 'text';
                }

                scope.$watch('model', function(newValue)
                {
                    if (angular.isDefined(newValue))
                    {
                        scope.data.model = newValue;
                    }
                });

                scope.$watch('data.model', function(newValue)
                {
                    if (angular.isDefined(newValue))
                    {
                        scope.model = newValue;
                    }
                });

                var $textarea;

                scope.$watch('type', function(newValue)
                {
                    if (newValue === 'area')
                    {
                        $textarea = element.find('textarea');

                        $textarea.on('cut paste drop keydown', function()
                        {
                            $timeout(function()
                            {
                                $textarea
                                    .removeAttr('style')
                                    .css({height: $textarea[0].scrollHeight + 'px'});
                            });
                        });
                    }
                });
            }
        };
    }]);