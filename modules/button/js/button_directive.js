import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ButtonController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        emphasis: 'high',
        size: 'm',
        theme: 'light',
        variant: 'button',
    };

    /**
     * The emphasis fallback.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _EMPHASIS_FALLBACK = {
        raised: 'high',
        flat: 'low',
        fab: 'high',
        icon: 'low',
    };

    /**
     * The size fallback.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _SIZE_FALLBACK = {
        xs: 's',
        s: 's',
        m: 'm',
        l: 'm',
        xl: 'm',
    };

    /**
     * The variant fallback.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _VARIANT_FALLBACK = {
        raised: 'button',
        flat: 'button',
        fab: 'icon',
        icon: 'icon',
    };

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Whether button has default emphasis or not.
     *
     * @return {boolean} Whether button has default emphasis or not.
     */
    function _isDefaultEmphasis() {
        return (!lx.type && !lx.emphasis) || lx.emphasis === 'high' || lx.type === 'raised' || lx.type === 'fab';
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get button classes.
     *
     * @return {Array} The list of button classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isUndefined(lx.color)) {
            if (angular.isDefined(lx.theme) && !_isDefaultEmphasis()) {
                const buttonColor = lx.theme === 'light' ? 'dark' : 'light';
                classes.push(`${CSS_PREFIX}-button--color-${buttonColor}`);
            } else {
                const defaultColor = _isDefaultEmphasis() ? 'primary' : 'dark';
                classes.push(`${CSS_PREFIX}-button--color-${defaultColor}`);
            }

            // Backward compatibility.
            classes.push('btn--primary');
        } else {
            classes.push(`${CSS_PREFIX}-button--color-${lx.color}`);

            // Backward compatibility.
            classes.push(`btn--${lx.color}`);
        }

        if (angular.isUndefined(lx.emphasis)) {
            if (angular.isDefined(lx.type)) {
                classes.push(`${CSS_PREFIX}-button--emphasis-${_EMPHASIS_FALLBACK[lx.type]}`);
            } else {
                classes.push(`${CSS_PREFIX}-button--emphasis-${_DEFAULT_PROPS.emphasis}`);
            }
        } else {
            classes.push(`${CSS_PREFIX}-button--emphasis-${lx.emphasis}`);
        }

        if (lx.isSelected) {
            classes.push(`${CSS_PREFIX}-button--is-selected`);
        }

        if (angular.isUndefined(lx.size)) {
            classes.push(`${CSS_PREFIX}-button--size-${_DEFAULT_PROPS.size}`);

            // Backward compatibility.
            classes.push('btn--m');
        } else {
            classes.push(`${CSS_PREFIX}-button--size-${_SIZE_FALLBACK[lx.size]}`);

            // Backward compatibility.
            classes.push(`btn--${lx.size}`);
        }

        if (_isDefaultEmphasis()) {
            if (angular.isUndefined(lx.theme)) {
                classes.push(`${CSS_PREFIX}-button--theme-${_DEFAULT_PROPS.theme}`);
            } else {
                classes.push(`${CSS_PREFIX}-button--theme-${lx.theme}`);
            }
        }

        if (angular.isUndefined(lx.variant)) {
            if (angular.isDefined(lx.type)) {
                classes.push(`${CSS_PREFIX}-button--variant-${_VARIANT_FALLBACK[lx.type]}`);
            } else {
                classes.push(`${CSS_PREFIX}-button--variant-${_DEFAULT_PROPS.variant}`);
            }
        } else {
            classes.push(`${CSS_PREFIX}-button--variant-${lx.variant}`);
        }

        if (angular.isUndefined(lx.type)) {
            // Backward compatibility.
            classes.push('btn--raised');
        } else {
            // Backward compatibility.
            classes.push(`btn--${lx.type}`);
        }

        if (lx.customColors) {
            classes.push(`${CSS_PREFIX}-custom-colors`);
        }

        return classes;
    }

    /**
     * Get button wrapper classes.
     *
     * @return {Array} The list of button wrapper classes.
     */
    function getWrapperClasses() {
        const wrapperClasses = [];

        if (lx.hasBackground && lx.emphasis === 'low') {
            if (angular.isUndefined(lx.color)) {
                if (angular.isDefined(lx.theme)) {
                    wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--color-${lx.theme}`);
                } else {
                    wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--color-light`);
                }
            } else {
                let wrapperColor = 'light';

                if (lx.color === 'light') {
                    wrapperColor = 'dark';
                }

                wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--color-${wrapperColor}`);
            }

            if (angular.isUndefined(lx.variant)) {
                if (angular.isDefined(lx.type)) {
                    wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--variant-${_VARIANT_FALLBACK[lx.type]}`);
                } else {
                    wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--variant-${_DEFAULT_PROPS.variant}`);
                }
            } else {
                wrapperClasses.push(`${CSS_PREFIX}-button-wrapper--variant-${lx.variant}`);
            }
        }

        return wrapperClasses;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.getWrapperClasses = getWrapperClasses;
}

/////////////////////////////

function ButtonDirective() {
    'ngInject';

    /**
     * Whether the button needs to be converted to a link or not.
     *
     * @param  {Object}  attrs The directive attributes.
     * @return {boolean} Whether the button is an anchor or not.
     */
    function isAnchor(attrs) {
        return (
            angular.isDefined(attrs.href) ||
            angular.isDefined(attrs.ngHref) ||
            angular.isDefined(attrs.ngLink) ||
            angular.isDefined(attrs.uiSref)
        );
    }

    /**
     * Get button template according to type, color and size.
     *
     * @param  {Element} el    The directive element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The button html template.
     */
    function getTemplate(el, attrs) {
        let buttonContent;

        if (isAnchor(attrs)) {
            buttonContent = `<a class="${CSS_PREFIX}-button btn" ng-class="lx.getClasses()" ng-transclude></a>`;
        } else {
            buttonContent = `<button class="${CSS_PREFIX}-button btn" ng-class="lx.getClasses()" ng-transclude></button>`;
        }

        if (attrs.lxHasBackground) {
            return `
                <div class="${CSS_PREFIX}-button-wrapper" ng-class="lx.getWrapperClasses()">
                    ${buttonContent}
                </div>
            `;
        }

        return buttonContent;
    }

    function link(scope, el, attrs) {
        let buttonEl = el;

        if (attrs.lxHasBackground) {
            if (isAnchor(attrs)) {
                buttonEl = el.find('a');
            } else {
                buttonEl = el.find('button');
            }
        }

        if (
            (!attrs.lxVariant && !attrs.lxType) ||
            attrs.lxVariant === 'button' ||
            attrs.lxType === 'raised' ||
            attrs.lxType === 'flat'
        ) {
            const leftIcon = buttonEl.find('i:first-child');
            const rightIcon = buttonEl.find('i:last-child');
            const label = buttonEl.find('span');

            if (leftIcon.length > 0) {
                buttonEl.addClass(`${CSS_PREFIX}-button--has-left-icon`);
            }

            if (rightIcon.length > 0) {
                buttonEl.addClass(`${CSS_PREFIX}-button--has-right-icon`);
            }

            if (label.length === 0) {
                buttonEl.wrapInner('<span></span>');
            }
        }
    }

    return {
        bindToController: true,
        controller: ButtonController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
            customColors: '=?lxCustomColors',
            emphasis: '@?lxEmphasis',
            hasBackground: '=?lxHasBackground',
            size: '@?lxSize',
            theme: '@?lxTheme',
            type: '@?lxType',
            variant: '@?lxVariant',
        },
        template: getTemplate,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.button').directive('lxButton', ButtonDirective);

/////////////////////////////

export { ButtonDirective };
