import { CSS_PREFIX } from '@lumx/core/js/constants';

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
            buttonContent = `<a class="${CSS_PREFIX}-button" ng-transclude></a>`;
        } else {
            buttonContent = `<button class="${CSS_PREFIX}-button" ng-transclude></button>`;
        }

        if (attrs.lxHasBackground) {
            return `
                <div class="${CSS_PREFIX}-button-wrapper">
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

        const isDefaultEmphasis =
            (!attrs.lxType && !attrs.lxEmphasis) ||
            attrs.lxEmphasis === 'high' ||
            attrs.lxType === 'raised' ||
            attrs.lxType === 'fab';

        const defaultProps = {
            color: isDefaultEmphasis ? 'primary' : 'dark',
            emphasis: 'high',
            size: 'm',
            theme: 'light',
            variant: 'button',
        };

        if (!attrs.lxColor) {
            buttonEl.addClass(`${CSS_PREFIX}-button--color-${defaultProps.color}`);

            if (attrs.lxHasBackground && attrs.lxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-light`);
            }
        }

        attrs.$observe('lxColor', (color) => {
            if (!color) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--color-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--color-${color}`);

            if (attrs.lxHasBackground && attrs.lxEmphasis === 'low') {
                let wrapperColor = 'light';

                if (color === 'light') {
                    wrapperColor = 'dark';
                }

                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-${wrapperColor}`);
            }
        });

        if (!attrs.lxEmphasis) {
            buttonEl.addClass(`${CSS_PREFIX}-button--emphasis-${defaultProps.emphasis}`);
        }

        attrs.$observe('lxEmphasis', (emphasis) => {
            if (!emphasis) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--emphasis-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--emphasis-${emphasis}`);
        });

        if (!attrs.lxSize) {
            buttonEl.addClass(`${CSS_PREFIX}-button--size-${defaultProps.size}`);
        }

        attrs.$observe('lxSize', (size) => {
            if (!size) {
                return;
            }

            const sizeFallback = {
                xs: 's',
                s: 's',
                m: 'm',
                l: 'm',
                xl: 'm',
            };

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--size-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--size-${sizeFallback[size]}`);
        });

        if (!attrs.lxTheme && isDefaultEmphasis) {
            buttonEl.addClass(`${CSS_PREFIX}-button--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lxTheme', (theme) => {
            if (!theme) {
                return;
            }

            if (isDefaultEmphasis) {
                buttonEl
                    .removeClass((index, className) => {
                        return (className.match(/(?:\S|-)*button--theme-\S+/g) || []).join(' ');
                    })
                    .addClass(`${CSS_PREFIX}-button--theme-${theme}`);
            } else {
                const buttonColor = theme === 'light' ? 'dark' : 'light';

                buttonEl
                    .removeClass((index, className) => {
                        return (className.match(/(?:\S|-)*button--color-\S+/g) || []).join(' ');
                    })
                    .addClass(`${CSS_PREFIX}-button--color-${buttonColor}`);
            }

            if (attrs.lxHasBackground && attrs.lxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-${theme}`);
            }
        });

        if (!attrs.lxVariant) {
            buttonEl.addClass(`${CSS_PREFIX}-button--variant-${defaultProps.variant}`);

            if (attrs.lxHasBackground && attrs.lxEmphasis === 'low') {
                el.addClass(`${CSS_PREFIX}-button-wrapper--variant-${defaultProps.variant}`);
            }
        }

        attrs.$observe('lxVariant', (variant) => {
            if (!variant) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--variant-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--variant-${variant}`);

            if (attrs.lxHasBackground && attrs.lxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--variant-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--variant-${variant}`);
            }
        });

        attrs.$observe('lxType', (type) => {
            if (!type) {
                return;
            }

            const emphasisFallback = {
                raised: 'high',
                flat: 'low',
                fab: 'high',
                icon: 'low',
            };

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--emphasis-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--emphasis-${emphasisFallback[type]}`);

            if (type === 'fab' || type === 'icon') {
                buttonEl
                    .removeClass((index, className) => {
                        return (className.match(/(?:\S|-)*button--variant-\S+/g) || []).join(' ');
                    })
                    .addClass(`${CSS_PREFIX}-button--variant-icon`);
            }
        });

        scope.$watch(attrs.lxIsSelected, (isSelected) => {
            if (isSelected) {
                buttonEl.addClass(`${CSS_PREFIX}-button--is-selected`);
            } else {
                buttonEl.removeClass(`${CSS_PREFIX}-button--is-selected`);
            }
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: getTemplate,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.button').directive('lxButton', ButtonDirective);

/////////////////////////////

export { ButtonDirective };
