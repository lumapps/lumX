import PopperJs from 'popper.js';

import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/popover.html';

/////////////////////////////

function PopoverController(LxDepthService, $element, $scope, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The source element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _sourceEl;

    /**
     * The target element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _targetEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the popover is open or not.
     *
     * @type {boolean}
     */
    lx.isOpen = false;

    /**
     * The popover uuid.
     *
     * @type {string}
     */
    lx.uuid = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close popover.
     */
    function _close() {
        lx.isOpen = false;

        $timeout(() => {
            if (angular.isDefined(_sourceEl)) {
                _sourceEl.focus();
            }
        });
    }

    /**
     * Open popover.
     */
    function _open() {
        LxDepthService.increase();

        $element.css('z-index', LxDepthService.get());

        // eslint-disable-next-line no-new
        new PopperJs(_targetEl, $element, {
            modifiers: {
                offset: { enabled: true, offset: `0, ${lx.offset}` },
            },
            placement: lx.position || 'auto',
        });

        lx.isOpen = true;
    }

    /**
     * Register the source element that triggered the popover.
     *
     * @param {element} sourceEl The source element that triggered the popover.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /**
     * Register the target element to position the popover.
     *
     * @param {element} targetEl The target element to position the popover.
     */
    function _registerTarget(targetEl) {
        _targetEl = targetEl;
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given popover.
     *
     * @param {Event}  evt       The popover open event.
     * @param {string} popoverId The popover identifier.
     * @param {Object} params    An optional object that holds extra parameters.
     */
    $scope.$on('lx-popover__open', (evt, popoverId, params) => {
        if (popoverId === lx.uuid) {
            _registerTarget(angular.element(params.target));

            if (angular.isDefined(params.source)) {
                _registerSource(angular.element(params.source));
            }

            _open();
        }
    });

    /**
     * Close a given popover.
     *
     * @param {Event}  evt       The popover open event.
     * @param {Object} popoverId The popover identifier.
     */
    $scope.$on('lx-popover__close', (evt, popoverId) => {
        if (popoverId === lx.uuid && lx.isOpen) {
            _close();
        }
    });
}

/////////////////////////////

function PopoverDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (id) => {
            ctrl.uuid = id;
        });

        const defaultProps = {
            elevation: '3',
        };

        if (!attrs.lxElevation) {
            el.addClass(`${CSS_PREFIX}-popover--elevation-${defaultProps.elevation}`);
        }

        attrs.$observe('lxElevation', (elevation) => {
            if (!elevation) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*popover--elevation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-popover--elevation-${elevation}`);
        });
    }

    return {
        bindToController: true,
        controller: PopoverController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            offset: '@?lxOffset',
            position: '@?lxPosition',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.popover').directive('lxPopover', PopoverDirective);

/////////////////////////////

export { PopoverDirective };
