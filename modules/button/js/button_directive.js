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
        if (isAnchor(attrs)) {
            return `<a class="${CSS_PREFIX}-button" ng-transclude></a>`;
        }

        return `<button class="${CSS_PREFIX}-button" ng-transclude></button>`;
    }

    function link(scope, el, attrs) {
        if (!attrs.lumxVariant || attrs.lumxVariant === 'button') {
            const leftIcon = el.find('i:first-child');
            const rightIcon = el.find('i:last-child');
            const label = el.find('span');

            if (leftIcon.length > 0) {
                el.addClass(`${CSS_PREFIX}-button--has-left-icon`);
            }

            if (rightIcon.length > 0) {
                el.addClass(`${CSS_PREFIX}-button--has-right-icon`);
            }

            if (label.length === 0) {
                el.wrapInner('<span></span>');
            }
        }

        const isDefaultEmphasis = !attrs.lumxEmphasis || attrs.lumxEmphasis === 'high';

        const defaultProps = {
            color: isDefaultEmphasis ? 'primary' : 'dark',
            emphasis: 'high',
            size: 'm',
            theme: 'light',
            variant: 'button',
        };

        if (!attrs.lumxColor) {
            el.addClass(`${CSS_PREFIX}-button--color-${defaultProps.color}`);
        }

        attrs.$observe('lumxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--color-${color}`);
        });

        if (!attrs.lumxEmphasis) {
            el.addClass(`${CSS_PREFIX}-button--emphasis-${defaultProps.emphasis}`);
        }

        attrs.$observe('lumxEmphasis', (emphasis) => {
            if (!emphasis) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--emphasis-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--emphasis-${emphasis}`);
        });

        if (!attrs.lumxSize) {
            el.addClass(`${CSS_PREFIX}-button--size-${defaultProps.size}`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--size-${size}`);
        });

        if (!attrs.lumxTheme && isDefaultEmphasis) {
            el.addClass(`${CSS_PREFIX}-button--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--theme-${theme}`);
        });

        if (!attrs.lumxVariant) {
            el.addClass(`${CSS_PREFIX}-button--variant-${defaultProps.variant}`);
        }

        attrs.$observe('lumxVariant', (variant) => {
            if (!variant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--variant-${variant}`);
        });

        scope.$watch(attrs.lumxIsSelected, (isSelected) => {
            if (isSelected) {
                el.addClass(`${CSS_PREFIX}-button--is-selected`);
            } else {
                el.removeClass(`${CSS_PREFIX}-button--is-selected`);
            }
        });

        // Backward compatibility

        attrs.$observe('lxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--color-${color}`);
        });

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

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--size-${sizeFallback[size]}`);
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

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*button--emphasis-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-button--emphasis-${emphasisFallback[type]}`);

            if (type === 'fab' || type === 'icon') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--variant-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button--variant-icon`);
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
