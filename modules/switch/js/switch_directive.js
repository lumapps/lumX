import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/switch.html';

/////////////////////////////

function SwitchController(LxUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The model controller.
     *
     * @type {Object}
     */
    let _modelController;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The switch id.
     *
     * @type {string}
     */
    lx.switchId = LxUtilsService.generateUUID();

    /**
     * Whether the directive has helper slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasHelper = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasLabel = false;

    /**
     * Whether the directive has transcluded content if no transclude slot.
     *
     * @type {boolean}
     */
    lx.hasTranscluded = false;

    /**
     * The model view value.
     *
     * @type {string}
     */
    lx.viewValue = undefined;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;

        _modelController.$render = function onModelRender() {
            lx.viewValue = _modelController.$viewValue;
        };
    }

    /**
     * Update model controller view value on switch click.
     */
    function updateViewValue() {
        if (angular.isUndefined(_modelController)) {
            lx.viewValue = !lx.viewValue;

            return;
        }

        _modelController.$setViewValue(!_modelController.$viewValue);
        _modelController.$render();
    }

    /////////////////////////////

    lx.setModelController = setModelController;
    lx.updateViewValue = updateViewValue;
}

/////////////////////////////

function SwitchDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        if (ctrls[1]) {
            ctrls[0].setModelController(ctrls[1]);
        }

        if (transclude.isSlotFilled('label')) {
            ctrls[0].hasLabel = true;
        }

        if (transclude.isSlotFilled('helper')) {
            ctrls[0].hasHelper = true;
        }

        if (!ctrls[0].hasLabel && !ctrls[0].hasHelper) {
            transclude((clone) => {
                if (clone.length > 0) {
                    ctrls[0].hasTranscluded = true;
                }
            });
        }

        attrs.$observe('disabled', (isDisabled) => {
            el.find('input').attr('disabled', isDisabled);

            if (isDisabled) {
                el.addClass(`${CSS_PREFIX}-switch--is-disabled`);
            } else {
                el.removeClass(`${CSS_PREFIX}-switch--is-disabled`);
            }
        });

        attrs.$observe('checked', (isChecked) => {
            el.find('input').attr('checked', isChecked);

            ctrls[0].viewValue = isChecked;
        });
    }

    return {
        bindToController: true,
        controller: SwitchController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxSwitch', '?ngModel'],
        restrict: 'E',
        scope: {
            position: '@?lxPosition',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            helper: '?lxSwitchHelp',
            label: '?lxSwitchLabel',
        },
    };
}

/////////////////////////////

angular.module('lumx.switch').directive('lxSwitch', SwitchDirective);

/////////////////////////////

export { SwitchDirective };
