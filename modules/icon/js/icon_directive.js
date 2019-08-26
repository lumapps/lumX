import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/icon.html';

/////////////////////////////

function IconDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        attrs.$observe('lxPath', (path) => {
            el.addClass(`${CSS_PREFIX}-icon--path`);
            el.find('path').attr('d', path);
        });

        attrs.$observe('lxId', (font) => {
            el.addClass(`${CSS_PREFIX}-icon--font mdi mdi-${font}`);
        });

        attrs.$observe('lxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--color-${color}`);
        });

        attrs.$observe('lxColorVariant', (colorVariant) => {
            if (!colorVariant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--color-variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--color-variant-${colorVariant}`);
        });

        attrs.$observe('lxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--size-${size}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template,
    };
}

/////////////////////////////

angular.module('lumx.icon').directive('lxIcon', IconDirective);

/////////////////////////////

export { IconDirective };
