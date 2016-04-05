(function()
{
    'use strict';

    angular
        .module('lumx.button')
        .directive('lxButton', lxButton);

    function lxButton()
    {
        var buttonClass;

        return {
            restrict: 'E',
            templateUrl: getTemplateUrl,
            compile: compile,
            replace: true,
            transclude: true
        };

        function compile(element, attrs)
        {
            setButtonStyle(element, attrs.lxSize, attrs.lxColor, attrs.lxType);

            return function(scope, element, attrs)
            {
                attrs.$observe('lxSize', function(lxSize)
                {
                    setButtonStyle(element, lxSize, attrs.lxColor, attrs.lxType);
                });

                attrs.$observe('lxColor', function(lxColor)
                {
                    setButtonStyle(element, attrs.lxSize, lxColor, attrs.lxType);
                });

                attrs.$observe('lxType', function(lxType)
                {
                    setButtonStyle(element, attrs.lxSize, attrs.lxColor, lxType);
                });

                element.on('click', function(event)
                {
                    if (attrs.disabled === true)
                    {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                });
            };
        }

        function getTemplateUrl(element, attrs)
        {
            return isAnchor(attrs) ? 'link.html' : 'button.html';
        }

        function isAnchor(attrs)
        {
            return angular.isDefined(attrs.href) || angular.isDefined(attrs.ngHref) || angular.isDefined(attrs.ngLink) || angular.isDefined(attrs.uiSref);
        }

        function setButtonStyle(element, size, color, type)
        {
            var buttonBase = 'btn';
            var buttonSize = angular.isDefined(size) ? size : 'm';
            var buttonColor = angular.isDefined(color) ? color : 'primary';
            var buttonType = angular.isDefined(type) ? type : 'raised';

            element.removeClass(buttonClass);

            buttonClass = buttonBase + ' btn--' + buttonSize + ' btn--' + buttonColor + ' btn--' + buttonType;

            element.addClass(buttonClass);
        }
    }
})();