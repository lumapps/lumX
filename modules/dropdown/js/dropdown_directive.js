/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.dropdown', ['lumx.utils.event-scheduler'])
    .service('LxDropdownService', ['$timeout', '$document', 'LxEventSchedulerService', function($timeout, $document, LxEventSchedulerService)
    {
        var openScope = null;

        function open(dropdownScope)
        {
            if (!openScope)
            {
                $document.on('click', closeDropdown);
            }

            if (angular.isUndefined(dropdownScope.lxDropdownEscapeClose) || dropdownScope.lxDropdownEscapeClose === 'true')
            {
                dropdownScope.idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            if (openScope && openScope !== dropdownScope)
            {
                openScope.lxDropdownIsOpened = false;
            }

            openScope = dropdownScope;
        }

        function close(dropdownScope)
        {
            if (openScope === dropdownScope)
            {
                if (angular.isDefined(dropdownScope.idEventScheduler))
                {
                    $timeout(function()
                    {
                        LxEventSchedulerService.unregister(dropdownScope.idEventScheduler);
                        delete dropdownScope.idEventScheduler;

                        openScope = null;
                    }, 1);
                }

                $document.off('click', closeDropdown);
            }
        }

        function closeDropdown()
        {
            if (!openScope) { return; }

            openScope.$apply(function()
            {
                openScope.lxDropdownIsOpened = false;
            });
        }

        function onKeyUp(event)
        {
            if (event.keyCode == 27)
            {
                closeDropdown();
            }

            event.stopPropagation();
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

        $scope.lxDropdownIsOpened = false;
        $scope.lxDropdownIsDropped = false;

        this.registerDropdown = function(element)
        {
            dropdown = element;

            $scope.lxDropdownPosition = angular.isDefined($scope.lxDropdownPosition) ? $scope.lxDropdownPosition : 'left';
        };

        this.registerDropdownMenu = function(element)
        {
            dropdownMenu = element;
        };

        this.toggle = function()
        {
            $scope.lxDropdownIsOpened = !$scope.lxDropdownIsOpened;
        };

        function linkList()
        {
            $scope.lxDropdownIsDropped = false;

            closeDropdownMenu();
        }

        function unlinkList()
        {
            $scope.lxDropdownIsDropped = true;

            dropdownMenu.appendTo('body');

            $timeout(function()
            {
                setDropdownMenuCss();
                openDropdownMenu();
            });
        }

        function fromTop(toTop)
        {
            if (angular.isUndefined($scope.lxDropdownOverToggle) && angular.isDefined($scope.lxDropdownFromTop))
            {
                return $scope.lxDropdownFromTop === 'true';
            }

            if ($scope.lxDropdownOverToggle === 'true')
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

            if ($scope.lxDropdownOverToggle === 'true')
            {
                if (topLeftCorner + menuHeight >= $window.innerHeight &&
                    $window.innerHeight - topLeftCorner + (buttonHeight / 2) < $window.innerHeight / 2)
                {
                    direction = "to_top";
                    originY = $window.innerHeight - (originY + buttonHeight);
                }
            }
            else if (angular.isDefined($scope.lxDropdownOverToggle) || $scope.lxDropdownFromTop !== 'true')
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
            else if (angular.isUndefined($scope.lxDropdownOverToggle) && $scope.lxDropdownFromTop === 'true')
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

                if (angular.isDefined($scope.lxDropdownWidth))
                {
                    if ($scope.lxDropdownWidth === 'full')
                    {
                        width = dropdown.outerWidth();
                    }
                    else
                    {
                        width = dropdown.outerWidth() + parseInt($scope.lxDropdownWidth);
                    }
                }

                cssOptions = {
                    left: $scope.lxDropdownPosition !== 'right' ? dropdown.offset().left : undefined,
                    right: $scope.lxDropdownPosition === 'right' ? $window.innerWidth - dropdown.offset().left - dropdown.outerWidth() : undefined,
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
                if ($scope.lxDropdownOverToggle !== 'true' && (angular.isDefined($scope.lxDropdownOverToggle) || $scope.lxDropdownFromTop !== 'true'))
                {
                    css.height -= dropdown.outerHeight();
                }

                dropdownMenu.scrollTop(scrollTop);
            }
            else if (direction === 'to_top')
            {
                css.bottom = $window.innerHeight - (topLeftCorner + windowScrollTop);
                if ($scope.lxDropdownOverToggle === 'true')
                {
                    css.bottom -= dropdown.outerHeight();
                }

                if ((topLeftCorner + windowScrollTop) - dropdownMenuHeight < 8)
                {
                    css.overflow = "auto";

                    css.height = topLeftCorner - 8;
                    if ($scope.lxDropdownOverToggle === 'true')
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

                    if (!angular.isDefined($scope.lxDropdownWidth))
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
            if ($scope.lxDropdownIsDropped)
            {
                setDropdownMenuCss();
            }
        }

        $scope.$watch('lxDropdownIsOpened', function(lxDropdownIsOpened)
        {
            if (lxDropdownIsOpened)
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

        angular.element($window).on('resize', updatePositionAndSize);

        $scope.$on('$locationChangeSuccess', function()
        {
            $scope.lxDropdownIsOpened = false;
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
                    scope.lxDropdownPosition = newValue;
                });

                attrs.$observe('width', function(newValue)
                {
                    scope.lxDropdownWidth = newValue;
                });

                attrs.$observe('fromTop', function(newValue)
                {
                    scope.lxDropdownFromTop = newValue;
                });

                attrs.$observe('overToggle', function(newValue)
                {
                    scope.lxDropdownOverToggle = newValue;
                });

                attrs.$observe('escapeClose', function(newValue)
                {
                    scope.lxDropdownEscapeClose = newValue;
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
                element.on('click', function(event)
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
