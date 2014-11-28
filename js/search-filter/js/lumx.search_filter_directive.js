/* global angular */
/* global $ */
'use strict'; // jshint ignore:line


angular.module('lumx.search-filter', [])
    .directive('lxSearchFilter', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'lumx.search_filter.html',
            link: function(scope, element, attrs)
            {
                var $input = element.find('input');
                var $label = element.find('label');
                var $cancel = element.find('span');

                if (angular.isDefined(attrs.closed))
                {
                    element.addClass('search-filter--is-closed');
                }

                if (angular.isDefined(attrs.theme))
                {
                    if (attrs.theme == 'light')
                    {
                        element.addClass('search-filter--light-theme');
                    }
                    else
                    {
                        element.addClass('search-filter--dark-theme');
                    }
                }
                else
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
                        }, 600);

                        // Detect all clicks outside the components, and close it
                        $('html').on('click', function()
                        {
                            element.removeClass('search-filter--is-focus');

                            $('html').off('click');
                            $('lx-search-filter').off('click');
                        });

                        $('lx-search-filter').on('click', function(event)
                        {
                            event.stopPropagation();
                        });
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
