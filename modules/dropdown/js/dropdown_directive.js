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
        var dropdownMenuHeight;
        var direction;
        var cssOptions;

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

        function fromTop(toTop)
        {
            if (angular.isUndefined($scope.overToggle) && angular.isDefined($scope.fromTop))
            {
                return $scope.fromTop === 'true';
            }

            if ($scope.overToggle === 'true')
            {
                return !toTop;
            }
            else
            {
                return toTop;
            }
        }

        function findDirectionAndOriginY()
        {
            var windowScrollTop = angular.element($window).scrollTop();
            var topLeftCorner = dropdown.offset().top - windowScrollTop;
            var buttonHeight = dropdown.outerHeight();
            var menuHeight = dropdownMenu.outerHeight();

            var originY = topLeftCorner;
            var direction = "to_bottom";

            if ($scope.overToggle === 'true')
            {
                if (topLeftCorner + menuHeight >= $window.innerHeight &&
                    $window.innerHeight - topLeftCorner + (buttonHeight / 2) < $window.innerHeight / 2)
                {
                    direction = "to_top";
                    originY = $window.innerHeight - (originY + buttonHeight);
                }
            }
            else if (angular.isDefined($scope.overToggle) || $scope.fromTop !== 'true')
            {
                if (topLeftCorner + buttonHeight + menuHeight < $window.innerHeight ||
                    $window.innerHeight - topLeftCorner + (buttonHeight / 2) >= $window.innerHeight / 2)
                {
                    originY += buttonHeight;
                }
                else
                {
                    direction = "to_top";
                    originY = $window.innerHeight - originY;
                }
            }
            else if (angular.isUndefined($scope.overToggle) && $scope.fromTop === 'true')
            {
                if (topLeftCorner + menuHeight >= $window.innerHeight &&
                    $window.innerHeight - topLeftCorner < $window.innerHeight / 2)
                {
                    direction = "to_top";
                }
            }

            return { direction: direction, originY: originY + windowScrollTop };
        }

        function setDropdownMenuCss()
        {
            var scrollTop = dropdownMenu.scrollTop();
            dropdownMenu.removeAttr('style');
            dropdownMenu.css({
                opacity: 1
            });

            // Deternmine orientation only at open, just manage resize if it's already opened.
            var dropdownMenuWidth = dropdownMenu.outerWidth();
            var dropdownMenuHeight = dropdownMenu.outerHeight();
            var windowScrollTop = angular.element($window).scrollTop();
            var offset = 0;
            var topLeftCorner = dropdown.offset().top - windowScrollTop;
            var directionAndOriginY = findDirectionAndOriginY();

            if (!direction)
            { // Manage orientation
                var width = dropdownMenuWidth;

                if (angular.isDefined($scope.width))
                {
                    if ($scope.width === 'full')
                    {
                        width = dropdown.outerWidth();
                    }
                    else
                    {
                        width = dropdown.outerWidth() + parseInt($scope.width);
                    }
                }

                cssOptions = {
                    left: $scope.position !== 'right' ? dropdown.offset().left : undefined,
                    right: $scope.position === 'right' ? $window.innerWidth - dropdown.offset().left - dropdown.outerWidth() : undefined,
                    width: width
                };

                direction = directionAndOriginY.direction;

                if (direction === 'to_bottom')
                {
                    cssOptions.top = directionAndOriginY.originY;
                }
                else
                {
                    cssOptions.bottom = directionAndOriginY.originY;
                }
            }

            var css = angular.copy(cssOptions);
            if (direction === "to_bottom" && topLeftCorner + dropdownMenuHeight > $window.innerHeight - 8)
            {
                css.overflow = "auto";

                css.height = $window.innerHeight - 8 - topLeftCorner;
                if ($scope.overToggle !== 'true' && (angular.isDefined($scope.overToggle) || $scope.fromTop !== 'true'))
                {
                    css.height -= dropdown.outerHeight();
                }

                dropdownMenu.scrollTop(scrollTop);
            }
            else if (direction === 'to_top')
            {
                css.bottom = $window.innerHeight - (topLeftCorner + windowScrollTop);
                if ($scope.overToggle === 'true')
                {
                    css.bottom -= dropdown.outerHeight();
                }

                if ((topLeftCorner + windowScrollTop) - dropdownMenuHeight < 8)
                {
                    css.overflow = "auto";

                    css.height = topLeftCorner - 8;
                    if ($scope.overToggle === 'true')
                    {
                        css.height += dropdown.outerHeight();
                    }

                    dropdownMenu.scrollTop(scrollTop);
                }
            }

            dropdownMenu.css(css);
        }

        function openDropdownMenu()
        {
            var width = dropdownMenu.outerWidth();
            var height = dropdownMenu.outerHeight();

            dropdownMenu.css({
                width: 0,
                height: 0,
                opacity: 1
            });

            dropdownMenu.find('.dropdown-dropdownMenu__content').css({
                width: width,
                height: height
            });

            dropdownMenu.velocity({
                width: width
            }, {
                duration: 200,
                easing: 'easeOutQuint',
                queue: false
            });

            dropdownMenu.velocity({
                height: height
            }, {
                duration: 500,
                easing: 'easeOutQuint',
                queue: false,
                complete: function()
                {
                    if (height === dropdownMenuHeight)
                    {
                        dropdownMenu.css({ height: 'auto' });
                    }
                    else
                    {
                        dropdownMenu.css({ overflow: 'auto' });
                    }

                    if (!angular.isDefined($scope.width))
                    {
                        dropdownMenu.css({ width: 'auto' });
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
                    direction = undefined;
                }
            });
        }

        function updatePositionAndSize()
        {
            if ($scope.isDropped)
            {
                setDropdownMenuCss();
            }
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

        angular.element($window).on('resize scroll', updatePositionAndSize);

        $scope.$on('$locationChangeSuccess', function()
        {
            $scope.isOpened = false;
        });

        $scope.$on('$destroy', function()
        {
            dropdownMenu.remove();
            LxDropdownService.close($scope);
        });

        this.updatePositionAndSize = updatePositionAndSize;
    }])
    .directive('lxDropdown', function()
    {
        return {
            restrict: 'E',
            controller: 'LxDropdownController',
            templateUrl: 'dropdown.html',
            transclude: true,
            replace: true,
            scope: true,
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.registerDropdown(element);

                attrs.$observe('position', function(newValue)
                {
                    scope.position = newValue;
                });

                attrs.$observe('width', function(newValue)
                {
                    scope.width = newValue;
                });

                attrs.$observe('fromTop', function(newValue)
                {
                    scope.fromTop = newValue;
                });

                attrs.$observe('overToggle', function(newValue)
                {
                    scope.overToggle = newValue;
                });
            }
        };
    })
    .directive('lxDropdownToggle', function()
    {
        return {
            restrict: 'AE',
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
    .directive('lxDropdownMenu', ['$timeout', function($timeout)
    {
        return {
            restrict: 'E',
            require: '^lxDropdown',
            templateUrl: 'dropdown-menu.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl, transclude)
            {
                var timer;

                ctrl.registerDropdownMenu(element);
                element.on('click', function(event)
                {
                    event.stopPropagation();

                    scope.$apply(function()
                    {
                        ctrl.toggle();
                    });
                });

                scope.$watch(function()
                {
                    return element.html();
                }, function(newValue)
                {
                    if (timer)
                    {
                        $timeout.cancel(timer);
                    }

                    timer = $timeout(ctrl.updatePositionAndSize, 150); // debounce
                });
            }
        };
    }])
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
