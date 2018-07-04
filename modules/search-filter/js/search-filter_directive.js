(function()
{
    'use strict';

    angular
        .module('lumx.search-filter')
        .filter('lxSearchHighlight', lxSearchHighlight)
        .directive('lxSearchFilter', lxSearchFilter);

    lxSearchHighlight.$inject = ['$sce'];

    function lxSearchHighlight($sce)
    {
        function escapeRegexp(queryToEscape)
        {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function (matchItem, query, icon)
        {
            var string = '';

            if (icon)
            {
                string += '<i class="mdi mdi-' + icon + '"></i>';
            }

            string += query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;

            return $sce.trustAsHtml(string);
        };
    }

    function lxSearchFilter()
    {
        return {
            restrict: 'E',
            templateUrl: 'search-filter.html',
            scope:
            {
                autocomplete: '&?lxAutocomplete',
                closed: '=?lxClosed',
                color: '@?lxColor',
                icon: '@?lxIcon',
                onInit: '&?lxOnInit',
                onSelect: '=?lxOnSelect',
                searchOnFocus: '=?lxSearchOnFocus',
                theme: '@?lxTheme',
                width: '@?lxWidth'
            },
            link: link,
            controller: LxSearchFilterController,
            controllerAs: 'lxSearchFilter',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl, transclude)
        {
            var input;

            attrs.$observe('lxWidth', function(newWidth)
            {
                if (angular.isDefined(scope.lxSearchFilter.closed) && scope.lxSearchFilter.closed)
                {
                    element.find('.search-filter__container').css('width', newWidth);
                }
            });

            transclude(function()
            {
                input = element.find('input');

                ctrl.setInput(input);
                ctrl.setModel(input.data('$ngModelController'));

                input.on('focus', ctrl.focusInput);
                input.on('blur', ctrl.blurInput);
                input.on('keydown', ctrl.keyEvent);
            });

            scope.$on('$destroy', function()
            {
                input.off();
            });


            if (angular.isDefined(scope.lxSearchFilter.onInit)) {
                scope.lxSearchFilter.onInit()(scope.lxSearchFilter.dropdownId);
            }
        }
    }

    LxSearchFilterController.$inject = ['$element', '$scope', '$timeout', 'LxDropdownService', 'LxNotificationService', 'LxUtils'];

    function LxSearchFilterController($element, $scope, $timeout, LxDropdownService, LxNotificationService, LxUtils)
    {
        var lxSearchFilter = this;
        var debouncedAutocomplete;
        var input;
        var itemSelected = false;

        lxSearchFilter.blurInput = blurInput;
        lxSearchFilter.clearInput = clearInput;
        lxSearchFilter.focusInput = focusInput;
        lxSearchFilter.getClass = getClass;
        lxSearchFilter.keyEvent = keyEvent;
        lxSearchFilter.openInput = openInput;
        lxSearchFilter.selectItem = selectItem;
        lxSearchFilter.setInput = setInput;
        lxSearchFilter.setModel = setModel;

        lxSearchFilter.activeChoiceIndex = -1;
        lxSearchFilter.color = angular.isDefined(lxSearchFilter.color) ? lxSearchFilter.color : 'black';
        lxSearchFilter.dropdownId = LxUtils.generateUUID();
        lxSearchFilter.theme = angular.isDefined(lxSearchFilter.theme) ? lxSearchFilter.theme : 'light';

        ////////////

        function blurInput()
        {
            if (angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed && !input.val())
            {
                $element.velocity(
                {
                    width: 40
                },
                {
                    duration: 400,
                    easing: 'easeOutQuint',
                    queue: false
                });
            }

            if (!input.val())
            {
                $timeout(function() {
                    lxSearchFilter.modelController.$setViewValue(undefined);
                }, 500);
            }
        }

        function clearInput()
        {
            lxSearchFilter.modelController.$setViewValue(undefined);
            lxSearchFilter.modelController.$render();

            // Temporarily disabling search on focus since we never want to trigger it when clearing the input.
            var searchOnFocus = lxSearchFilter.searchOnFocus;
            lxSearchFilter.searchOnFocus = false;

            input.focus();

            lxSearchFilter.searchOnFocus = searchOnFocus;
        }

        function focusInput()
        {
            if (!lxSearchFilter.searchOnFocus)
            {
                return;
            }

            updateAutocomplete(lxSearchFilter.modelController.$viewValue, true);
        }

        function getClass()
        {
            var searchFilterClass = [];

            if (angular.isUndefined(lxSearchFilter.closed) || !lxSearchFilter.closed)
            {
                searchFilterClass.push('search-filter--opened-mode');
            }

            if (angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed)
            {
                searchFilterClass.push('search-filter--closed-mode');
            }

            if (input.val())
            {
                searchFilterClass.push('search-filter--has-clear-button');
            }

            if (angular.isDefined(lxSearchFilter.color))
            {
                searchFilterClass.push('search-filter--' + lxSearchFilter.color);
            }

            if (angular.isDefined(lxSearchFilter.theme))
            {
                searchFilterClass.push('search-filter--theme-' + lxSearchFilter.theme);
            }

            if (angular.isFunction(lxSearchFilter.autocomplete))
            {
                searchFilterClass.push('search-filter--autocomplete');
            }

            if (LxDropdownService.isOpen(lxSearchFilter.dropdownId))
            {
                searchFilterClass.push('search-filter--is-open');
            }

            return searchFilterClass;
        }

        function keyEvent(_event)
        {
            if (!angular.isFunction(lxSearchFilter.autocomplete))
            {
                return;
            }

            if (!LxDropdownService.isOpen(lxSearchFilter.dropdownId))
            {
                lxSearchFilter.activeChoiceIndex = -1;
            }

            switch (_event.keyCode) {
                case 13:
                    keySelect();
                    if (lxSearchFilter.activeChoiceIndex > -1)
                    {
                        _event.preventDefault();
                    }
                    break;

                case 38:
                    keyUp();
                    _event.preventDefault();
                    break;

                case 40:
                    keyDown();
                    _event.preventDefault();
                    break;
            }

            $scope.$apply();
        }

        function keyDown()
        {
            if (lxSearchFilter.autocompleteList.length)
            {
                lxSearchFilter.activeChoiceIndex += 1;

                if (lxSearchFilter.activeChoiceIndex >= lxSearchFilter.autocompleteList.length)
                {
                    lxSearchFilter.activeChoiceIndex = 0;
                }
            }
        }

        function keySelect()
        {
            if (!lxSearchFilter.autocompleteList || lxSearchFilter.activeChoiceIndex === -1)
            {
                return;
            }

            selectItem(lxSearchFilter.autocompleteList[lxSearchFilter.activeChoiceIndex]);
        }

        function keyUp()
        {
            if (lxSearchFilter.autocompleteList.length)
            {
                lxSearchFilter.activeChoiceIndex -= 1;

                if (lxSearchFilter.activeChoiceIndex < 0)
                {
                    lxSearchFilter.activeChoiceIndex = lxSearchFilter.autocompleteList.length - 1;
                }
            }
        }

        function openDropdown()
        {
            LxDropdownService.open(lxSearchFilter.dropdownId, $element);
        }

        function closeDropdown()
        {
            LxDropdownService.close(lxSearchFilter.dropdownId);
        }

        function onAutocompleteSuccess(autocompleteList)
        {
            lxSearchFilter.autocompleteList = autocompleteList;

            (lxSearchFilter.autocompleteList.length) ? openDropdown() : closeDropdown();
            lxSearchFilter.isLoading = false;
        }

        function onAutocompleteError(error)
        {
            LxNotificationService.error(error);
            lxSearchFilter.isLoading = false;
        }

        function openInput()
        {
            if (angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed)
            {
                $element.velocity(
                {
                    width: angular.isDefined(lxSearchFilter.width) ? parseInt(lxSearchFilter.width) : 240
                },
                {
                    duration: 400,
                    easing: 'easeOutQuint',
                    queue: false,
                    complete: function()
                    {
                        input.focus();
                    }
                });
            }
            else
            {
                input.focus();
            }
        }

        function selectItem(_item)
        {
            itemSelected = true;

            closeDropdown();

            lxSearchFilter.modelController.$setViewValue(_item);
            lxSearchFilter.modelController.$render();

            if (angular.isFunction(lxSearchFilter.onSelect))
            {
                lxSearchFilter.onSelect(_item);
            }
        }

        function setInput(_input)
        {
            input = _input;
        }

        function setModel(_modelController)
        {
            lxSearchFilter.modelController = _modelController;

            if (angular.isFunction(lxSearchFilter.autocomplete) && angular.isFunction(lxSearchFilter.autocomplete()))
            {
                debouncedAutocomplete = LxUtils.debounce(function()
                {
                    lxSearchFilter.isLoading = true;
                    (lxSearchFilter.autocomplete()).apply(this, arguments);
                }, 500);
                lxSearchFilter.modelController.$parsers.push(updateAutocomplete);
            }
        }

        function updateAutocomplete(_newValue, _immediate)
        {
            if ((_newValue || (angular.isUndefined(_newValue) && lxSearchFilter.searchOnFocus)) && !itemSelected)
            {
                if (_immediate)
                {
                    lxSearchFilter.isLoading = true;
                    (lxSearchFilter.autocomplete())(_newValue, onAutocompleteSuccess, onAutocompleteError);
                }
                else
                {
                    debouncedAutocomplete(_newValue, onAutocompleteSuccess, onAutocompleteError);
                }
            }
            else
            {
                debouncedAutocomplete.clear();
                closeDropdown();
            }

            itemSelected = false;

            return _newValue;
        }
    }
})();
