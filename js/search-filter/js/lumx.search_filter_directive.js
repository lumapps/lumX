/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.search-filter', [])
    .directive('lxSearchFilter', ['$timeout', '$document', function($timeout, $document)
    {
        return {
            restrict: 'E',
            templateUrl: 'lumx.search_filter.html',
            link: function(scope, element, attrs)
            {
                var $input = element.find('.search-filter__input'),
                    $label = element.find('.search-filter__label'),
                    $cancel = element.find('.search-filter__cancel');

                if (angular.isDefined(attrs.closed))
                {
                    element.addClass('search-filter--is-closed');
                }

                attrs.$observe('theme', function(theme)
                {
                    element.removeClass('search-filter--light-theme search-filter--dark-theme');
                    
                    if (theme === 'light')
                    {
                        element.addClass('search-filter--light-theme');
                    }
                    else
                    {
                        element.addClass('search-filter--dark-theme');
                    }
                });

                if (angular.isUndefined(attrs.theme))
                {
                    element.addClass('search-filter--dark-theme');
                }

                $input.on('input', function()
                {
                    if ($input.val())
                    {
                        element.addClass('search-filter--is-active');
                    }
                    else
                    {
                        element.removeClass('search-filter--is-active');
                    }
                });

                $label.on('click', function()
                {
                    if (angular.isDefined(attrs.closed))
                    {
                        element.addClass('search-filter--is-focus');

                        // After the end of the CSS animation, focus on the input
                        $timeout(function()
                        {
                            $input.focus();

                            // Detect all clicks outside the components, and close it
                            $document.on('click', function()
                            {
                                element.removeClass('search-filter--is-focus');

                                $document.off('click');
                                element.off('click');
                            });

                            element.on('click', function(event)
                            {
                                event.stopPropagation();
                            });
                        }, 600);
                    }
                    else
                    {
                        $input.focus();
                    }
                });

                $cancel.on('click', function()
                {
                    $input.val('').focus();

                    element.removeClass('search-filter--is-active');
                });
            }
        };
    }]);
