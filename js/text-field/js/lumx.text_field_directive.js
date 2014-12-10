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
                    if (newValue)
                    {
                        scope.data.model = newValue;
                    }
                });

                scope.$watch('data.model', function(newValue)
                {
                    if (newValue)
                    {
                        scope.model = newValue;
                    }
                });

                var $textarea, $copy;
                scope.$watch('type', function(newValue)
                {
                    if (newValue === 'area')
                    {
                        $textarea = element.find('textarea');
                        $copy = '<textarea class="textarea-copy"></textarea>';

                        // Scrollbar standard with is 17px : http://www.textfixer.com/tutorials/browser-scrollbar-width.php
                        var $scrollbarWidth = 17;
                        
                        $textarea.width = $textarea.width();
                        element.append($copy);

                        $copy = element.find('.textarea-copy');
                        $copy.css({
                            'height': 34,
                            'width': $textarea.width + $scrollbarWidth
                        });

                        $textarea.on('focus', function()
                        {
                            var lastHeight = $textarea.height();
                            $textarea.height(lastHeight + 24);
                        });

                        $textarea.on('keyup cut paste', function()
                        {
                            $textarea.content = $textarea.val();
                            $copy.val($textarea.content);
                            var $newHeight = $copy.prop('scrollHeight') + 24;
                            $textarea.velocity({ 
                                height: $newHeight
                            }, {
                                duration: 50,
                                easing: 'linear'
                            });
                        });

                        $textarea.on('blur', function()
                        {
                            var lastHeight = $textarea.height();

                            if (lastHeight == 56)
                            {
                                $textarea.height(lastHeight - 24);
                            }
                            else
                            {
                                $textarea.height(lastHeight - 20);
                            }
                        });
                    }
                    else if ($textarea)
                    {
                        $textarea.off('focus').off('blur').off('keyup cut paste');
                        $copy.remove();
                    }
                });
            }
        };
    }]);