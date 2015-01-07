/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.search-filter', [])
    .directive('lxSearchFilter', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'lumx.search_filter.html',
            scope: {
                model: '=?'
            },
            link: function(scope, element, attrs)
            {
                var $input = element.find('.search-filter__input'),
                    $label = element.find('.search-filter__label'),
                    $searchFilter = element.find('.search-filter'),
                    $searchFilterContainer = element.find('.search-filter__container');

                if (angular.isDefined(attrs.closed))
                {
                    $searchFilter.addClass('search-filter--is-closed');
                }

                // Width
                attrs.$observe('filterWidth', function(filterWidth)
                {
                    $searchFilterContainer.css({ width: filterWidth });
                });

                // Theme
                attrs.$observe('theme', function(theme)
                {
                    $searchFilter.removeClass('search-filter--light-theme search-filter--dark-theme');

                    if (theme === 'light')
                    {
                        $searchFilter.addClass('search-filter--light-theme');
                    }
                    else
                    {
                        $searchFilter.addClass('search-filter--dark-theme');
                    }
                });

                if (angular.isUndefined(attrs.theme))
                {
                    $searchFilter.addClass('search-filter--dark-theme');
                }

                // Placeholder
                attrs.$observe('placeholder', function(newValue)
                {
                    scope.placeholder = newValue;
                });

                // Events
                $input
                    .on('blur', function()
                    {
                        if (angular.isDefined(attrs.closed) && !$input.val())
                        {
                            $searchFilter.velocity({ 
                                width: 40
                            }, {
                                duration: 400,
                                easing: 'easeOutQuint',
                                queue: false
                            });
                        }
                    });

                $label.on('click', function()
                {
                    if (angular.isDefined(attrs.closed))
                    {
                        $searchFilter.velocity({ 
                            width: attrs.filterWidth ? attrs.filterWidth: 240
                        }, {
                            duration: 400,
                            easing: 'easeOutQuint',
                            queue: false
                        });

                        $timeout(function()
                        {
                            $input.focus();
                        }, 401);
                    }
                    else
                    {
                        $input.focus();
                    }
                });

                scope.clear = function()
                {
                    scope.model = undefined;

                    $input.focus();
                };
            }
        };
    }]);
