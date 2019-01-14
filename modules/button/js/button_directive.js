(function()
{
    'use strict';

    angular
        .module('lumx.button')
        .directive('lxButton', lxButton);

    function lxButton()
    {
        return {
            restrict: 'E',
            templateUrl: getTemplateUrl,
            link: link,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            setButtonStyle(element, attrs.lxSize, attrs.lxColor, attrs.lxType);

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
            element.removeClass('btn');
            element.removeClass (function (index, className) {
                return (className.match (/(^|\s)btn--\S+/g) || []).join(' ');
            });

            var buttonSize = angular.isDefined(size) ? 'btn--' + size : 'btn--m';
            var buttonColor = angular.isDefined(color) ? 'btn--' + color : 'btn--primary';
            var buttonType = angular.isDefined(type) ? 'btn--' + type : 'btn--raised';

            element.addClass('btn');
            element.addClass(buttonSize);
            element.addClass(buttonColor);
            element.addClass(buttonType);
        }
    }
})();
