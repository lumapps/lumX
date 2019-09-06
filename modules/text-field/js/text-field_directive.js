import { CSS_PREFIX } from '@lumx/core/js/constants';

import { mdiAlertCircle, mdiCheckCircle } from '@lumx/icons';

import template from '../views/text-field.html';

/////////////////////////////

function TextFieldController(LxUtilsService) {
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
     * The text field icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
    };

    /**
     * The input id.
     *
     * @type {string}
     */
    lx.inputId = LxUtilsService.generateUUID();

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Define if the model controller has a value or not.
     *
     * @return {boolean} Wether the model controller has a value or not.
     */
    function hasValue() {
        if (angular.isUndefined(_modelController) || angular.isUndefined(_modelController.$viewValue)) {
            return false;
        }

        return _modelController.$viewValue.length;
    }

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;
    }

    /////////////////////////////

    lx.hasValue = hasValue;
    lx.setModelController = setModelController;
}

/////////////////////////////

function TextFieldDirective($timeout) {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        const input = el.find('input');
        const modelController = input.data('$ngModelController');

        ctrl.setModelController(modelController);

        if (input.attr('id')) {
            ctrl.inputId = input.attr('id');
        } else {
            input.attr('id', ctrl.inputId);
        }

        input
            .on('focus', () => {
                el.addClass(`${CSS_PREFIX}-text-field--is-focus`);
            })
            .on('blur', () => {
                el.removeClass(`${CSS_PREFIX}-text-field--is-focus`);
            });

        attrs.$observe('disabled', (isDisabled) => {
            if (isDisabled) {
                el.addClass(`${CSS_PREFIX}-text-field--is-disabled`);
            } else {
                el.removeClass(`${CSS_PREFIX}-text-field--is-disabled`);
            }
        });

        scope.$watch(
            () => {
                return ctrl.focus;
            },
            (isfocus) => {
                if (angular.isDefined(isfocus) && isfocus) {
                    $timeout(() => {
                        input.focus();

                        ctrl.focus = false;
                    });
                }
            },
        );

        if (angular.isDefined(modelController.$$attr)) {
            modelController.$$attr.$observe('disabled', (isDisabled) => {
                if (isDisabled) {
                    el.addClass(`${CSS_PREFIX}-text-field--is-disabled`);
                } else {
                    el.removeClass(`${CSS_PREFIX}-text-field--is-disabled`);
                }
            });

            modelController.$$attr.$observe('placeholder', (placeholder) => {
                if (placeholder.length > 0) {
                    el.addClass(`${CSS_PREFIX}-text-field--has-placeholder`);
                } else {
                    el.removeClass(`${CSS_PREFIX}-text-field--has-placeholder`);
                }
            });
        }

        scope.$on('$destroy', () => {
            input.off();
        });
    }

    return {
        bindToController: true,
        controller: TextFieldController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            focus: '=?lxFocus',
            hasError: '=?lxError',
            helper: '@?lxHelper',
            icon: '@?lxIcon',
            isValid: '=?lxValid',
            label: '@?lxLabel',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.text-field').directive('lxTextField', TextFieldDirective);

/////////////////////////////

export { TextFieldDirective };
