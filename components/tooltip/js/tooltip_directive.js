import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function TooltipController($element, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Delay before showing the tooltip on source element mouse enter.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _HOVER_DELAY = 500;

    /**
     * The offset from the target.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _OFFSET = 8;

    /**
     * The tooltip element.
     *
     * @type {element}
     */
    let _hoverTimeout;

    /**
     * The tooltip label element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltip;

    /**
     * The source element mouse enter timeout.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltipArrow;

    /**
     * The source element mouse enter timeout.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltipInner;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the tooltip position according to the position parameter.
     */
    function _setTooltipPosition() {
        const targetProps = {
            height: $element.outerHeight(),
            left: $element.offset().left,
            top: $element.offset().top,
            width: $element.outerWidth(),
        };
        const tooltipPosition = angular.isDefined(lx.position) ? lx.position : 'top';
        const tooltipProps = {};

        _tooltip.addClass(`${CSS_PREFIX}-tooltip--position-${tooltipPosition}`).appendTo('body');

        /* eslint-disable no-magic-numbers */
        if (tooltipPosition === 'top') {
            tooltipProps.x = targetProps.left - _tooltip.outerWidth() / 2 + targetProps.width / 2;
            tooltipProps.y = targetProps.top - _tooltip.outerHeight() - _OFFSET;
        } else if (tooltipPosition === 'bottom') {
            tooltipProps.x = targetProps.left - _tooltip.outerWidth() / 2 + targetProps.width / 2;
            tooltipProps.y = targetProps.top + targetProps.height + _OFFSET;
        } else if (tooltipPosition === 'left') {
            tooltipProps.x = targetProps.left - _tooltip.outerWidth() - _OFFSET;
            tooltipProps.y = targetProps.top + targetProps.height / 2 - _tooltip.outerHeight() / 2;
        } else if (tooltipPosition === 'right') {
            tooltipProps.x = targetProps.left + targetProps.width + _OFFSET;
            tooltipProps.y = targetProps.top + targetProps.height / 2 - _tooltip.outerHeight() / 2;
        }

        _tooltip.css({
            transform: `translate3d(${tooltipProps.x}px, ${tooltipProps.y}px, 0px)`,
        });
        /* eslint-enable no-magic-numbers */
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Hide the tooltip on source element mouse leave.
     */
    function hideTooltip() {
        if (angular.isUndefined(_tooltip)) {
            return;
        }

        $timeout.cancel(_hoverTimeout);

        _tooltip.remove();
        _tooltip = undefined;
    }

    /**
     * Show the tooltip on source element mouse enter.
     */
    function showTooltip() {
        if (angular.isDefined(_tooltip) || angular.isUndefined(lx.text) || !lx.text) {
            return;
        }

        _tooltip = angular.element('<div/>', {
            class: `${CSS_PREFIX}-tooltip`,
        });

        _tooltipArrow = angular.element('<div/>', {
            class: `${CSS_PREFIX}-tooltip__arrow`,
        });

        _tooltipInner = angular.element('<span/>', {
            class: `${CSS_PREFIX}-tooltip__inner`,
            text: lx.text,
        });

        _tooltip.append(_tooltipArrow).append(_tooltipInner);

        _hoverTimeout = $timeout(_setTooltipPosition, _HOVER_DELAY);
    }

    /////////////////////////////

    lx.hideTooltip = hideTooltip;
    lx.showTooltip = showTooltip;
}

/////////////////////////////

function TooltipDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('lxTooltip', (text) => {
            ctrl.text = text;
        });

        attrs.$observe('lxTooltipPosition', (position) => {
            ctrl.position = position;
        });

        el.on('mouseenter', ctrl.showTooltip);
        el.on('mouseleave', ctrl.hideTooltip);

        scope.$on('$destroy', () => {
            ctrl.hideTooltip();
            el.off();
        });
    }

    return {
        bindToController: true,
        controller: TooltipController,
        controllerAs: 'lx',
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module('lumx.tooltip').directive('lxTooltip', TooltipDirective);

/////////////////////////////

export { TooltipDirective };
