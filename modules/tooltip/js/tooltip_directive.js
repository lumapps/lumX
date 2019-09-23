import PopperJs from 'popper.js';

import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function TooltipController($element, $timeout, LxDepthService) {
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
        _tooltip.appendTo('body');

        // eslint-disable-next-line no-new
        new PopperJs($element, _tooltip, {
            placement: lx.position || 'top',
            modifiers: {
                arrow: {
                    // eslint-disable-next-line id-blacklist
                    element: `.${CSS_PREFIX}-tooltip__arrow`,
                    enabled: true,
                },
            },
        });
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
        if (angular.isDefined(_tooltip)) {
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

        LxDepthService.increase();

        _tooltip
            .append(_tooltipArrow)
            .append(_tooltipInner)
            .css('z-index', LxDepthService.get());

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
        scope: {
            position: '@?lxTooltipPosition',
            text: '@lxTooltip',
        },
    };
}

/////////////////////////////

angular.module('lumx.tooltip').directive('lxTooltip', TooltipDirective);

/////////////////////////////

export { TooltipDirective };
