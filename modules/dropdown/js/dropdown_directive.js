(function()
{
    'use strict';

    angular
        .module('lumx.dropdown')
        .directive('lxDropdown', lxDropdown)
        .directive('lxDropdownToggle', lxDropdownToggle)
        .directive('lxDropdownMenu', lxDropdownMenu)
        .directive('lxDropdownFilter', lxDropdownFilter);

    lxDropdown.$inject = ['$document'];

    function lxDropdown($document)
    {
        return {
            restrict: 'E',
            templateUrl: 'dropdown.html',
            scope:
            {
                escapeClose: '=?lxEscapeClose',
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
            $document.bind('click', closeDropdownMenu);

            scope.$on('$destroy', function()
            {
                ctrl.closeDropdownMenu();
                $document.unbind('click', closeDropdownMenu);
            });

            function closeDropdownMenu()
            {
                scope.$apply(function()
                {
                    ctrl.closeDropdownMenu();
                });
            }
        }
    }

    LxDropdownController.$inject = ['$element', '$scope', '$timeout', '$window', 'LxEventSchedulerService'];

    function LxDropdownController($element, $scope, $timeout, $window, LxEventSchedulerService)
    {
        var lxDropdown = this;
        var dropdownMenu;
        var dropdownToggle;
        var idEventScheduler;

        lxDropdown.closeDropdownMenu = closeDropdownMenu;
        lxDropdown.registerDropdownMenu = registerDropdownMenu;
        lxDropdown.registerDropdownToggle = registerDropdownToggle;
        lxDropdown.toggle = toggle;

        lxDropdown.escapeClose = angular.isDefined(lxDropdown.escapeClose) ? lxDropdown.escapeClose : true;
        lxDropdown.isOpen = false;
        lxDropdown.overToggle = angular.isDefined(lxDropdown.overToggle) ? lxDropdown.overToggle : false;
        lxDropdown.position = angular.isDefined(lxDropdown.position) ? lxDropdown.position : 'left';

        ////////////

        function closeDropdownMenu()
        {
            dropdownMenu.velocity(
            {
                width: 0,
                height: 0,
            },
            {
                duration: 200,
                easing: 'easeOutQuint',
                complete: function()
                {
                    dropdownMenu.removeAttr('style');

                    $scope.$apply(function()
                    {
                        lxDropdown.isOpen = false;
                        $element.removeClass('dropdown--is-open');

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
            lxDropdown.isOpen = true;
            $element.addClass('dropdown--is-open');

            if (lxDropdown.escapeClose)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            $timeout(function()
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

                dropdownMenu.css(
                {
                    width: 0,
                    height: 0,
                    opacity: 1
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
                    }
                });
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
            var windowHeight = $window.innerHeight;
            var dropdownToggleHeight = dropdownToggle.outerHeight();
            var dropdownToggleTop = dropdownToggle.offset().top - angular.element($window).scrollTop();
            var dropdownMenuTopAvailable;
            var dropdownMenuBottomAvailable;

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

            dropdownMenu.css(
            {
                right: lxDropdown.position === 'right' ? 0 : 'auto',
                left: lxDropdown.position === 'right' ? 'auto' : 0,
                width: angular.isDefined(lxDropdown.width) ? lxDropdown.width : 'auto'
            });

            if (dropdownMenuTopAvailable > dropdownMenuBottomAvailable)
            {
                dropdownMenu.css(
                {
                    bottom: lxDropdown.overToggle ? 0 : dropdownToggleHeight
                });

                return dropdownMenuTopAvailable;
            }
            else
            {
                if (lxDropdown.overToggle)
                {
                    dropdownMenu.css(
                    {
                        top: 0
                    });
                }

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

    function lxDropdownToggle()
    {
        return {
            restrict: 'AE',
            templateUrl: 'dropdown.html',
            require: '^lxDropdown',
            scope: true,
            link: link,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            ctrl.registerDropdownToggle(element);

            element.bind('click', function(_event)
            {
                _event.stopPropagation();

                angular.element('.dropdown').each(function(index, dropdownElem)
                {
                    if (angular.isDefined(angular.element(dropdownElem).scope().lxDropdown) && angular.element(dropdownElem).scope().lxDropdown.isOpen)
                    {
                        angular.element(dropdownElem).scope().lxDropdown.closeDropdownMenu();
                    }
                });

                scope.$apply(function()
                {
                    ctrl.toggle();
                });
            });
        }
    }

    function lxDropdownMenu()
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
            ctrls[1].registerDropdownMenu(element);
            ctrls[0].setParentController(ctrls[1]);
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
            element.bind('click', function(_event)
            {
                _event.stopPropagation();
            });

            $timeout(function()
            {
                element.find('input').focus();
            }, 200);
        }
    }
})();