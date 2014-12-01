/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dropdown', [])
    .service('LxDropdownService', ['$document', function($document)
    {
        var openScope = null;

        this.open = function(dropdownScope)
        {
            if (!openScope)
            {
                $document.bind('click', closeDropdown);
            }

            if (openScope && openScope !== dropdownScope)
            {
                openScope.isOpen = false;
            }

            openScope = dropdownScope;
        };

        this.close = function(dropdownScope)
        {
            if (openScope === dropdownScope)
            {
                openScope = null;
                $document.unbind('click', closeDropdown);
            }
        };

        var closeDropdown = function()
        {
            if (!openScope) { return; }

            openScope.$apply(function()
            {
                openScope.isOpen = false;
            });
        };
    }])
    .controller('LxDropdownController', ['$scope', 'LxDropdownService', function($scope, LxDropdownService)
    {
        var $element,
            scope = $scope.$new();

        this.init = function(element)
        {
            $element = element;

            scope.isOpen = false;
        };

        this.getContainer = function()
        {
            return $element;
        };

        this.isOpen = function()
        {
            return scope.isOpen;
        };

        this.toggle = function()
        {
            scope.isOpen = !scope.isOpen;
        };

        scope.$watch('isOpen', function(isOpen)
        {
            if (isOpen)
            {
                LxDropdownService.open(scope);
            }
            else
            {
                LxDropdownService.close(scope);
            }
        });

        $scope.$on('$locationChangeSuccess', function()
        {
            scope.isOpen = false;
        });

        $scope.$on('$destroy', function()
        {
            scope.$destroy();
        });
    }])
    .directive('lxDropdown', function()
    {
        return {
            restrict: 'E',
            controller: 'LxDropdownController',
            templateUrl: 'lumx.dropdown.html',
            transclude: true,
            replace: true,
            scope: {},
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
            }
        };
    })
    .directive('lxDropdownToggle', function()
    {
        return {
            restrict: 'A',
            require: '^lxDropdown',
            scope: {},
            link: function(scope, element, attrs, ctrl)
            {
                element.bind('click', function(event)
                {
                    event.stopPropagation();

                    scope.$apply(function()
                    {
                        ctrl.toggle();
                    });
                });
            }
        };
    })
    .directive('lxDropdownMenu', ['$timeout', '$window', function($timeout, $window)
    {
        return {
            restrict: 'E',
            require: '^lxDropdown',
            templateUrl: 'lumx.dropdown_menu.html',
            transclude: true,
            replace: true,
            scope: {
                position: '@'
            },
            link: function(scope, element, attrs, ctrl)
            {
                scope.position = angular.isDefined(scope.position) ? scope.position : 'left';

                scope.$watch(ctrl.isOpen, function(isOpen)
                {
                    if (isOpen)
                    {
                        unlinkList();
                    }
                    else
                    {
                        linkList();
                    }
                });

                angular.element($window).bind('resize, scroll', function()
                {
                    if (scope.isDropped)
                    {
                        setDropdownMenuCss();
                    }
                });

                function linkList()
                {
                    scope.isDropped = false;

                    closeDropdownMenu();
                }

                function unlinkList()
                {
                    scope.isDropped = true;

                    element.appendTo('body');

                    $timeout(function()
                    {
                        setDropdownMenuCss();
                        openDropdownMenu();
                    });
                }

                function setDropdownMenuCss()
                {
                    var container = ctrl.getContainer(),
                        top,
                        left = 'auto',
                        right = 'auto',
                        containerWidth = container.outerWidth();

                    if (angular.isDefined(attrs.fromTop))
                    {
                        top = container.offset().top;
                    }
                    else
                    {
                        top = container.offset().top + container.outerHeight();
                    }

                    if (scope.position === 'left')
                    {
                        left = container.offset().left;
                    }
                    else if (scope.position === 'right')
                    {
                        right = angular.element($window).width() - (container.offset().left + container.outerWidth());
                    }
                    else if (scope.position === 'center')
                    {
                        left = (container.offset().left - (element.outerWidth() / 2)) + (container.outerWidth() / 2);
                    }

                    element.css(
                    {
                        left: left,
                        right: right,
                        top: top
                    });

                    if (angular.isDefined(attrs.width))
                    {
                        if (attrs.width === 'full')
                        {
                            element.css('width', containerWidth);
                        }
                        else
                        {
                            element.css('width', containerWidth + parseInt(attrs.width));
                        }
                    }
                }

                function openDropdownMenu()
                {
                    var containerWidth = element.outerWidth(),
                        containerHeight = element.outerHeight();

                    element.css({
                        width: 0,
                        height: 0,
                        opacity: 1
                    });

                    element.find('.dropdown-menu__content').css({
                        width: containerWidth,
                        height: containerHeight
                    });

                    element.velocity({ 
                        width: containerWidth
                    }, {
                        duration: 200,
                        easing: 'easeOutQuint',
                        queue: false
                    });

                    element.velocity({ 
                        height: containerHeight
                    }, {
                        duration: 500,
                        easing: 'easeOutQuint',
                        queue: false,
                        complete: function()
                        {
                            if (angular.isDefined(attrs.width))
                            {
                                element.css({ height: 'auto' });
                            }
                            else
                            {
                                element.css({ width: 'auto', height: 'auto' });
                            }

                            element.find('.dropdown-menu__content').removeAttr('style');
                        }
                    });
                }

                function closeDropdownMenu()
                {
                    element.velocity({
                        width: 0,
                        height: 0,
                    }, {
                        duration: 200,
                        easing: 'easeOutQuint',
                        complete: function()
                        {
                            element
                                .appendTo(ctrl.getContainer())
                                .removeAttr('style');
                        }
                    });
                }
            }
        };
    }])
    .directive('lxDropdownFilter', function()
    {
        return {
            restrict: 'A',
            link: function(scope, element)
            {
                element.bind('click', function(event)
                {
                    event.stopPropagation();
                });
            }
        };
    });