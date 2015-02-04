/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dropdown', [])
    .service('LxDropdownService', ['$document', function($document)
    {
        var openScope = null;

        function open(dropdownScope)
        {
            if (!openScope)
            {
                $document.bind('click', closeDropdown);
            }

            if (openScope && openScope !== dropdownScope)
            {
                openScope.isOpened = false;
            }

            openScope = dropdownScope;
        }

        function close(dropdownScope)
        {
            if (openScope === dropdownScope)
            {
                openScope = null;
                $document.unbind('click', closeDropdown);
            }
        }

        function closeDropdown()
        {
            if (!openScope) { return; }

            openScope.$apply(function()
            {
                openScope.isOpened = false;
            });
        }

        return {
            open: open,
            close: close
        };
    }])
    .controller('LxDropdownController', ['$scope', '$timeout', '$window', 'LxDropdownService', function($scope, $timeout, $window, LxDropdownService)
    {
        var dropdown,
            dropdownMenu;

        $scope.isOpened = false;
        $scope.isDropped = false;

        this.registerDropdown = function(element)
        {
            dropdown = element;

            $scope.position = angular.isDefined($scope.position) ? $scope.position : 'left';
        };

        this.registerDropdownMenu = function(element)
        {
            dropdownMenu = element;
        };

        this.toggle = function()
        {
            $scope.isOpened = !$scope.isOpened;
        };

        function linkList()
        {
            $scope.isDropped = false;

            closeDropdownMenu();
        }

        function unlinkList()
        {
            $scope.isDropped = true;

            dropdownMenu.appendTo('body');

            $timeout(function()
            {
                setDropdownMenuCss();
                openDropdownMenu();
            });
        }

        function setDropdownMenuCss()
        {
            var top,
                bottom,
                left = 'auto',
                right = 'auto';

            if (angular.isDefined($scope.fromTop))
            {
                top = dropdown.offset().top;
                bottom = $window.innerHeight - dropdown.offset().top;
            }
            else
            {
                top = dropdown.offset().top + dropdown.outerHeight();
                bottom = $window.innerHeight - dropdown.offset().top - dropdown.outerHeight();
            }

            if ($scope.position === 'left')
            {
                left = dropdown.offset().left;
            }
            else if ($scope.position === 'right')
            {
                right = $window.innerWidth - (dropdown.offset().left + dropdown.outerWidth());
            }
            else if ($scope.position === 'center')
            {
                left = (dropdown.offset().left - (dropdownMenu.outerWidth() / 2)) + (dropdown.outerWidth() / 2);
            }

            if ($scope.direction === 'up')
            {
                dropdownMenu.css(
                    {
                        left: left,
                        right: right,
                        bottom: bottom
                    });
            }
            else
            {
                dropdownMenu.css(
                {
                    left: left,
                    right: right,
                    top: top
                });
            }

            if (angular.isDefined($scope.width))
            {
                if ($scope.width === 'full')
                {
                    dropdownMenu.css('width', dropdown.outerWidth());
                }
                else
                {
                    dropdownMenu.css('width', dropdown.outerWidth() + parseInt($scope.width));
                }
            }
        }

        function openDropdownMenu()
        {
            var dropdownMenuWidth = dropdownMenu.outerWidth(),
                dropdownMenuHeight = dropdownMenu.outerHeight();

            dropdownMenu.css({
                width: 0,
                height: 0,
                opacity: 1
            });

            dropdownMenu.find('.dropdown-dropdownMenu__content').css({
                width: dropdownMenuWidth,
                height: dropdownMenuHeight
            });

            dropdownMenu.velocity({
                width: dropdownMenuWidth
            }, {
                duration: 200,
                easing: 'easeOutQuint',
                queue: false
            });

            dropdownMenu.velocity({
                height: dropdownMenuHeight
            }, {
                duration: 500,
                easing: 'easeOutQuint',
                queue: false,
                complete: function()
                {
                    if (angular.isDefined($scope.width))
                    {
                        dropdownMenu.css({ height: 'auto' });
                    }
                    else
                    {
                        dropdownMenu.css({ width: 'auto', height: 'auto' });
                    }

                    dropdownMenu.find('.dropdown-menu__content').removeAttr('style');
                }
            });

            dropdown.addClass('dropdown--is-active');
        }

        function closeDropdownMenu()
        {
            dropdownMenu.velocity({
                width: 0,
                height: 0,
            }, {
                duration: 200,
                easing: 'easeOutQuint',
                complete: function()
                {
                    dropdownMenu
                        .appendTo(dropdown)
                        .removeAttr('style');

                    dropdown.removeClass('dropdown--is-active');
                }
            });
        }

        $scope.$watch('isOpened', function(isOpened)
        {
            if (isOpened)
            {
                unlinkList();
                LxDropdownService.open($scope);
            }
            else
            {
                linkList();
                LxDropdownService.close($scope);
            }
        });

        angular.element($window).bind('resize, scroll', function()
        {
            if ($scope.isDropped)
            {
                setDropdownMenuCss();
            }
        });

        $scope.$on('$locationChangeSuccess', function()
        {
            $scope.isOpened = false;
        });

        $scope.$on('$destroy', function()
        {
            dropdownMenu.remove();
            LxDropdownService.close($scope);
        });
    }])
    .directive('lxDropdown', function()
    {
        return {
            restrict: 'E',
            controller: 'LxDropdownController',
            templateUrl: 'dropdown.html',
            transclude: true,
            replace: true,
            scope: {
                position: '@',
                width: '@',
                fromTop: '@',
                direction: '@'
            },
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.registerDropdown(element);
            }
        };
    })
    .directive('lxDropdownToggle', function()
    {
        return {
            restrict: 'A',
            require: '^lxDropdown',
            templateUrl: 'dropdown-toggle.html',
            replace: true,
            transclude: true,
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
    .directive('lxDropdownMenu', function()
    {
        return {
            restrict: 'E',
            require: '^lxDropdown',
            templateUrl: 'dropdown-menu.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.registerDropdownMenu(element);
                element.on('click', function(event)
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
    .directive('lxDropdownFilter', ['$timeout', function($timeout)
    {
        return {
            restrict: 'A',
            link: function(scope, element)
            {
                element.bind('click', function(event)
                {
                    event.stopPropagation();
                });

                $timeout(function()
                {
                    element.find('input').focus();
                }, 200);
            }
        };
    }]);
