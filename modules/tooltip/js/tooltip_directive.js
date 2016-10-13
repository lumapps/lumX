(function()
{
    'use strict';

    angular
        .module('lumx.tooltip')
        .directive('lxTooltip', lxTooltip);

    function lxTooltip()
    {
        return {
            restrict: 'A',
            scope:
            {
                tooltip: '@lxTooltip',
                position: '@?lxTooltipPosition'
            },
            link: link,
            controller: LxTooltipController,
            controllerAs: 'lxTooltip',
            bindToController: true
        };

        function link(scope, element, attrs, ctrl)
        {
            if (angular.isDefined(attrs.lxTooltip))
            {
                attrs.$observe('lxTooltip', function(newValue)
                {
                    ctrl.updateTooltipText(newValue);
                });
            }

            if (angular.isDefined(attrs.lxTooltipPosition))
            {
                attrs.$observe('lxTooltipPosition', function(newValue)
                {
                    scope.lxTooltip.position = newValue;
                });
            }

            element.on('mouseenter', ctrl.showTooltip);
            element.on('mouseleave', ctrl.hideTooltip);

            scope.$on('$destroy', function()
            {
                element.off();
            });
        }
    }

    LxTooltipController.$inject = ['$element', '$scope', '$timeout', 'LxDepthService'];

    function LxTooltipController($element, $scope, $timeout, LxDepthService)
    {
        var lxTooltip = this;
        var timer1;
        var timer2;
        var tooltip;
        var tooltipBackground;
        var tooltipLabel;

        lxTooltip.hideTooltip = hideTooltip;
        lxTooltip.showTooltip = showTooltip;
        lxTooltip.updateTooltipText = updateTooltipText;

        lxTooltip.position = angular.isDefined(lxTooltip.position) ? lxTooltip.position : 'top';

        $scope.$on('$destroy', function()
        {
            if (angular.isDefined(tooltip))
            {
                tooltip.remove();
                tooltip = undefined;
            }

            $timeout.cancel(timer1);
            $timeout.cancel(timer2);
        });

        ////////////

        function hideTooltip()
        {
            if (angular.isDefined(tooltip))
            {
                tooltip.removeClass('tooltip--is-active');

                timer1 = $timeout(function()
                {
                    if (angular.isDefined(tooltip))
                    {
                        tooltip.remove();
                        tooltip = undefined;
                    }
                }, 200);
            }
        }

        function setTooltipPosition()
        {
            var width = $element.outerWidth(),
                height = $element.outerHeight(),
                top = $element.offset().top,
                left = $element.offset().left;

            tooltip
                .append(tooltipBackground)
                .append(tooltipLabel)
                .appendTo('body');

            if (lxTooltip.position === 'top')
            {
                tooltip.css(
                {
                    left: left - (tooltip.outerWidth() / 2) + (width / 2),
                    top: top - tooltip.outerHeight()
                });
            }
            else if (lxTooltip.position === 'bottom')
            {
                tooltip.css(
                {
                    left: left - (tooltip.outerWidth() / 2) + (width / 2),
                    top: top + height
                });
            }
            else if (lxTooltip.position === 'left')
            {
                tooltip.css(
                {
                    left: left - tooltip.outerWidth(),
                    top: top + (height / 2) - (tooltip.outerHeight() / 2)
                });
            }
            else if (lxTooltip.position === 'right')
            {
                tooltip.css(
                {
                    left: left + width,
                    top: top + (height / 2) - (tooltip.outerHeight() / 2)
                });
            }
        }

        function showTooltip()
        {
            if (angular.isUndefined(tooltip))
            {
                LxDepthService.register();

                tooltip = angular.element('<div/>',
                {
                    class: 'tooltip tooltip--' + lxTooltip.position
                });

                tooltipBackground = angular.element('<div/>',
                {
                    class: 'tooltip__background'
                });

                tooltipLabel = angular.element('<span/>',
                {
                    class: 'tooltip__label',
                    text: lxTooltip.tooltip
                });

                setTooltipPosition();

                tooltip
                    .append(tooltipBackground)
                    .append(tooltipLabel)
                    .css('z-index', LxDepthService.getDepth())
                    .appendTo('body');

                timer2 = $timeout(function()
                {
                    tooltip.addClass('tooltip--is-active');
                });
            }
        }

        function updateTooltipText(_newValue)
        {
            if (angular.isDefined(tooltipLabel))
            {
                tooltipLabel.text(_newValue);
            }
        }
    }
})();
