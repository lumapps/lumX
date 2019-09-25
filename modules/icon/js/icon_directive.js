import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/icon.html';

/////////////////////////////

function IconController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get link classes.
     *
     * @return {Array} The list of link classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isDefined(lx.color)) {
            classes.push(`${CSS_PREFIX}-icon--color-${lx.color}`);
        }

        if (angular.isDefined(lx.colorVariant)) {
            classes.push(`${CSS_PREFIX}-icon--color-variant-${lx.colorVariant}`);
        }

        if (angular.isDefined(lx.size)) {
            classes.push(`${CSS_PREFIX}-icon--size-${lx.size}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

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
    }

    return {
        bindToController: true,
        controller: IconController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
            colorVariant: '@?lxColorVariant',
            size: '@?lxSize',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.icon').directive('lxIcon', IconDirective);

/////////////////////////////

export { IconDirective };
