(function()
{
    'use strict';

    angular
        .module('lumx.dropdown')
        .directive('lxDropdown', lxDropdown)
        .directive('lxDropdownToggle', lxDropdownToggle)
        .directive('lxDropdownMenu', lxDropdownMenu)
        .directive('lxDropdownFilter', lxDropdownFilter);

    lxDropdown.$inject = ['$document', '$timeout'];

    function lxDropdown($document, $timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'dropdown.html',
            scope:
            {
                effect: '@?lxEffect',
                escapeClose: '=?lxEscapeClose',
                hover: '=?lxHover',
                hoverDelay: '=?lxHoverDelay',
                offset: '@?lxOffset',
                overToggle: '=?lxOverToggle',
                position: '@?lxPosition',
                width: '@?lxWidth'
            },
            link: link,
            controller: LxDropdownController,
            controllerAs: 'lxDropdown',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            var backwardOneWay = ['position', 'width'];
            var backwardTwoWay = ['escapeClose', 'overToggle'];
            var timer;

            angular.forEach(backwardOneWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    attrs.$observe(attribute, function(newValue)
                    {
                        scope.lxDropdown[attribute] = newValue;
                    });
                }
            });

            angular.forEach(backwardTwoWay, function(attribute)
            {
                if (angular.isDefined(attrs[attribute]))
                {
                    scope.$watch(function()
                    {
                        return scope.$parent.$eval(attrs[attribute]);
                    }, function(newValue)
                    {
                        scope.lxDropdown[attribute] = newValue;
                    });
                }
            });

            $document.on('click', closeDropdownMenu);

            scope.$on('$destroy', function()
            {
                ctrl.closeDropdownMenu();
                $document.off('click', closeDropdownMenu);
                $timeout.cancel(timer);
            });

            function closeDropdownMenu()
            {
                if (scope.lxDropdown.isOpen)
                {
                    timer = $timeout(function()
                    {
                        scope.$apply(function()
                        {
                            ctrl.closeDropdownMenu();
                        });
                    });
                }
            }
        }
    }

    LxDropdownController.$inject = ['$element', '$interval', '$scope', '$timeout', '$window', 'LxDepthService', 'LxEventSchedulerService', 'LxUtils'];

    function LxDropdownController($element, $interval, $scope, $timeout, $window, LxDepthService, LxEventSchedulerService, LxUtils)
    {
        var lxDropdown = this;
        var dropdownInterval;
        var dropdownMenu;
        var dropdownToggle;
        var idEventScheduler;
        var timer;

        lxDropdown.closeDropdownMenu = closeDropdownMenu;
        lxDropdown.openDropdownMenu = openDropdownMenu;
        lxDropdown.registerDropdownMenu = registerDropdownMenu;
        lxDropdown.registerDropdownToggle = registerDropdownToggle;
        lxDropdown.toggle = toggle;
        lxDropdown.uuid = LxUtils.generateUUID();

        lxDropdown.effect = angular.isDefined(lxDropdown.effect) ? lxDropdown.effect : 'expand';
        lxDropdown.escapeClose = angular.isDefined(lxDropdown.escapeClose) ? lxDropdown.escapeClose : true;
        lxDropdown.isOpen = false;
        lxDropdown.overToggle = angular.isDefined(lxDropdown.overToggle) ? lxDropdown.overToggle : false;
        lxDropdown.position = angular.isDefined(lxDropdown.position) ? lxDropdown.position : 'left';

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer);
        });

        ////////////

        function closeDropdownMenu()
        {
            var velocityProperties;
            var velocityEasing;

            $interval.cancel(dropdownInterval);

            dropdownMenu.css(
            {
                overflow: 'hidden'
            });

            if (lxDropdown.effect === 'expand')
            {
                velocityProperties = {
                    width: 0,
                    height: 0
                };

                velocityEasing = 'easeOutQuint';
            }
            else if (lxDropdown.effect === 'fade')
            {
                velocityProperties = {
                    opacity: 0
                };

                velocityEasing = 'linear';
            }

            dropdownMenu.velocity(velocityProperties,
            {
                duration: 200,
                easing: velocityEasing,
                complete: function()
                {
                    $element.find('.dropdown').removeClass('dropdown--is-open');

                    dropdownMenu
                        .removeAttr('style')
                        .removeClass('dropdown-menu--is-open')
                        .appendTo($element.find('.dropdown'));

                    $scope.$apply(function()
                    {
                        lxDropdown.isOpen = false;

                        if (lxDropdown.escapeClose)
                        {
                            LxEventSchedulerService.unregister(idEventScheduler);
                            idEventScheduler = undefined;
                        }
                    });
                }
            });
        }

        function openDropdownMenu()
        {
            LxDepthService.register();

            lxDropdown.isOpen = true;

            $element.find('.dropdown').addClass('dropdown--is-open');

            dropdownMenu
                .addClass('dropdown-menu--is-open')
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            if (lxDropdown.escapeClose)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            timer = $timeout(function()
            {
                var enoughtHeight = true;
                var availableHeight = setDropdownMenuCss();
                var width = dropdownMenu.outerWidth();
                var height = dropdownMenu.outerHeight();

                if (availableHeight < height)
                {
                    enoughtHeight = false;
                    height = availableHeight;
                }

                if (lxDropdown.effect === 'expand')
                {
                    dropdownMenu.css(
                    {
                        width: 0,
                        height: 0,
                        opacity: 1,
                        overflow: 'hidden'
                    });

                    dropdownMenu.find('.dropdown-menu__content').css(
                    {
                        width: width,
                        height: height
                    });

                    dropdownMenu.velocity(
                    {
                        width: width
                    },
                    {
                        duration: 200,
                        easing: 'easeOutQuint',
                        queue: false
                    });

                    dropdownMenu.velocity(
                    {
                        height: height
                    },
                    {
                        duration: 500,
                        easing: 'easeOutQuint',
                        queue: false,
                        complete: function()
                        {
                            dropdownMenu.css(
                            {
                                overflow: 'auto'
                            });

                            if (enoughtHeight)
                            {
                                dropdownMenu.css(
                                {
                                    height: 'auto'
                                });
                            }

                            if (angular.isUndefined(lxDropdown.width))
                            {
                                dropdownMenu.css(
                                {
                                    width: 'auto'
                                });
                            }

                            dropdownMenu.find('.dropdown-menu__content').removeAttr('style');

                            dropdownInterval = $interval(function()
                            {
                                setDropdownMenuCss();
                            }, 500);
                        }
                    });
                }
                else if (lxDropdown.effect === 'fade')
                {
                    dropdownMenu.velocity(
                    {
                        opacity: 1,
                    },
                    {
                        duration: 200,
                        easing: 'linear',
                        queue: false,
                        complete: function()
                        {
                            dropdownInterval = $interval(function()
                            {
                                setDropdownMenuCss();
                            }, 500);
                        }
                    });
                }
            });
        }

        function onKeyUp(_event)
        {
            if (_event.keyCode == 27)
            {
                closeDropdownMenu();
            }

            _event.stopPropagation();
        }

        function registerDropdownMenu(_dropdownMenu)
        {
            dropdownMenu = _dropdownMenu;
        }

        function registerDropdownToggle(_dropdownToggle)
        {
            dropdownToggle = _dropdownToggle;
        }

        function setDropdownMenuCss()
        {
            var windowWidth = $window.innerWidth;
            var windowHeight = $window.innerHeight;
            var dropdownToggleWidth = dropdownToggle.outerWidth();
            var dropdownToggleHeight = dropdownToggle.outerHeight();
            var dropdownToggleTop = dropdownToggle.offset().top - angular.element($window).scrollTop();
            var dropdownMenuTopAvailable;
            var dropdownMenuBottomAvailable;
            var dropdownMenuWidth;

            if (lxDropdown.overToggle)
            {
                dropdownMenuTopAvailable = dropdownToggleTop + dropdownToggleHeight;
                dropdownMenuBottomAvailable = windowHeight - dropdownToggleTop;
            }
            else
            {
                dropdownMenuTopAvailable = dropdownToggleTop;
                dropdownMenuBottomAvailable = windowHeight - (dropdownToggleTop + dropdownToggleHeight);
            }

            if (angular.isDefined(lxDropdown.width))
            {
                if (lxDropdown.width.indexOf('%') > -1)
                {
                    dropdownMenuWidth = dropdownToggleWidth * (lxDropdown.width.slice(0, -1) / 100);
                }
                else
                {
                    dropdownMenuWidth = lxDropdown.width;
                }
            }
            else
            {
                dropdownMenuWidth = 'auto';
            }

            dropdownMenu.css(
            {
                right: lxDropdown.position === 'right' ? (windowWidth - dropdownToggle.offset().left - dropdownToggleWidth) : 'auto',
                left: lxDropdown.position === 'right' ? 'auto' : dropdownToggle.offset().left,
                width: dropdownMenuWidth
            });

            if (dropdownMenuTopAvailable > dropdownMenuBottomAvailable)
            {
                dropdownMenu.css(
                {
                    bottom: lxDropdown.overToggle ? (windowHeight - dropdownToggle.offset().top - dropdownToggleHeight) : (windowHeight - dropdownToggle.offset().top + ~~lxDropdown.offset)
                });

                return dropdownMenuTopAvailable;
            }
            else
            {
                dropdownMenu.css(
                {
                    top: lxDropdown.overToggle ? dropdownToggle.offset().top : (dropdownToggle.offset().top + dropdownToggleHeight + ~~lxDropdown.offset)
                });

                return dropdownMenuBottomAvailable;
            }
        }

        function toggle()
        {
            if (!lxDropdown.isOpen)
            {
                openDropdownMenu();
            }
            else
            {
                closeDropdownMenu();
            }
        }
    }

    lxDropdownToggle.$inject = ['$timeout'];

    function lxDropdownToggle($timeout)
    {
        return {
            restrict: 'AE',
            templateUrl: 'dropdown-toggle.html',
            require: '^lxDropdown',
            scope: true,
            link: link,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            var timer1;
            var timer2;

            ctrl.registerDropdownToggle(element);

            element.on(ctrl.hover ? 'mouseenter' : 'click', function(_event)
            {
                if (!ctrl.hover)
                {
                    _event.stopPropagation();
                }

                angular.element('.dropdown').each(function(index, dropdownElem)
                {
                    if (angular.isDefined(angular.element(dropdownElem).scope().lxDropdown) &&
                        angular.element(dropdownElem).scope().lxDropdown.isOpen &&
                        angular.element(dropdownElem).scope().lxDropdown.uuid !== ctrl.uuid)
                    {
                        angular.element(dropdownElem).scope().lxDropdown.closeDropdownMenu();
                    }
                });

                if (ctrl.hover)
                {
                    ctrl.mouseOnToggle = true;

                    if (!ctrl.isOpen)
                    {
                        timer1 = $timeout(function()
                        {
                            scope.$apply(function()
                            {
                                ctrl.openDropdownMenu();
                            });
                        }, ctrl.hoverDelay);
                    }
                }
                else
                {
                    scope.$apply(function()
                    {
                        ctrl.toggle();
                    });
                }
            });

            if (ctrl.hover)
            {
                element.on('mouseleave', function()
                {
                    ctrl.mouseOnToggle = false;

                    $timeout.cancel(timer1);

                    timer2 = $timeout(function()
                    {
                        if (!ctrl.mouseOnMenu)
                        {
                            scope.$apply(function()
                            {
                                ctrl.closeDropdownMenu();
                            });
                        }
                    }, ctrl.hoverDelay);
                });
            }

            scope.$on('$destroy', function()
            {
                element.off();

                if (ctrl.hover)
                {
                    $timeout.cancel(timer1);
                    $timeout.cancel(timer2);
                }
            });
        }
    }

    lxDropdownMenu.$inject = ['$timeout'];

    function lxDropdownMenu($timeout)
    {
        return {
            restrict: 'E',
            templateUrl: 'dropdown-menu.html',
            require: ['lxDropdownMenu', '^lxDropdown'],
            scope: true,
            link: link,
            controller: LxDropdownMenuController,
            controllerAs: 'lxDropdownMenu',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrls)
        {
            var timer;

            ctrls[1].registerDropdownMenu(element);
            ctrls[0].setParentController(ctrls[1]);

            if (ctrls[1].hover)
            {
                element.on('mouseenter', function()
                {
                    ctrls[1].mouseOnMenu = true;
                });

                element.on('mouseleave', function()
                {
                    ctrls[1].mouseOnMenu = false;

                    timer = $timeout(function()
                    {
                        if (!ctrls[1].mouseOnToggle)
                        {
                            scope.$apply(function()
                            {
                                ctrls[1].closeDropdownMenu();
                            });
                        }
                    }, ctrls[1].hoverDelay);
                });
            }

            scope.$on('$destroy', function()
            {
                if (ctrls[1].hover)
                {
                    element.off();
                    $timeout.cancel(timer);
                }
            });
        }
    }

    function LxDropdownMenuController()
    {
        var lxDropdownMenu = this;

        lxDropdownMenu.setParentController = setParentController;

        ////////////

        function setParentController(_parentCtrl)
        {
            lxDropdownMenu.parentCtrl = _parentCtrl;
        }
    }

    lxDropdownFilter.$inject = ['$timeout'];

    function lxDropdownFilter($timeout)
    {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element)
        {
            var timer;

            element.on('click', function(_event)
            {
                _event.stopPropagation();
            });

            timer = $timeout(function()
            {
                element.find('input').focus();
            }, 200);

            scope.$on('$destroy', function()
            {
                $timeout.cancel(timer);
                element.off();
            });
        }
    }
})();