(function()
{
    'use strict';

    angular
        .module('lumx.search-filter', [])
        .directive('lxSearchFilter', lxSearchFilter);

    function lxSearchFilter()
    {
        return {
            restrict: 'E',
            templateUrl: 'search-filter.html',
            scope:
            {
                closed: '=?lxClosed',
                color: '@?lxColor',
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
            transclude(function()
            {
                var input = element.find('input');

                ctrl.setInput(input);
                ctrl.setModel(input.data('$ngModelController'));

                input.bind('blur', ctrl.blurInput);
            });
        }
    }

    LxSearchFilterController.$inject = ['$element', '$scope'];

    function LxSearchFilterController($element, $scope)
    {
        var lxSearchFilter = this;
        var input;
        var modelController;

        lxSearchFilter.blurInput = blurInput;
        lxSearchFilter.clearInput = clearInput;
        lxSearchFilter.getWidth = getWidth;
        lxSearchFilter.openInput = openInput;
        lxSearchFilter.setInput = setInput;
        lxSearchFilter.setModel = setModel;

        lxSearchFilter.color = angular.isDefined(lxSearchFilter.color) ? lxSearchFilter.color : 'black';

        ////////////

        function blurInput()
        {
            if (angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed && !modelController.$modelValue)
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
        }

        function clearInput()
        {
            modelController.$setViewValue(undefined);
            modelController.$render();

            input.focus();
        }

        function getWidth()
        {
            if (angular.isDefined(lxSearchFilter.width) && angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed)
            {
                return {
                    'width': lxSearchFilter.width + 'px'
                };
            }
        }

        function hasClearButton(_newModel)
        {
            lxSearchFilter.showClearButton = angular.isDefined(_newModel) && _newModel;
        }

        function openInput()
        {
            if (angular.isDefined(lxSearchFilter.closed) && lxSearchFilter.closed)
            {
                $element.velocity(
                {
                    width: angular.isDefined(lxSearchFilter.width) ? lxSearchFilter.width : 240
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

        function setInput(_input)
        {
            input = _input;
        }

        function setModel(_modelControler)
        {
            modelController = _modelControler;

            $scope.$watch(function()
            {
                return modelController.$modelValue;
            }, hasClearButton);
        }
    }
})();