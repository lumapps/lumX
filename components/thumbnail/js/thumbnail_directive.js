import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/thumbnail.html';

/////////////////////////////

function ThumbnailController() {
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
        align: 'left',
        aspectRatio: 'original',
        theme: 'light',
        variant: 'squared',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get background image according to image url.
     *
     * @return {Object} The image style properties.
     */
    function getBackgroundImage() {
        if (angular.isUndefined(lx.aspectRatio) || lx.aspectRatio === 'original') {
            return {};
        }

        return {
            backgroundImage: `url(${lx.image})`,
        };
    }

    /**
     * Get thumbnail classes.
     *
     * @return {Array} The list of thumbnail classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isUndefined(lx.align)) {
            classes.push(`${CSS_PREFIX}-thumbnail--align-${_DEFAULT_PROPS.align}`);
        } else {
            classes.push(`${CSS_PREFIX}-thumbnail--align-${lx.align}`);
        }

        if (angular.isUndefined(lx.aspectRatio)) {
            classes.push(`${CSS_PREFIX}-thumbnail--aspect-ratio-${_DEFAULT_PROPS.aspectRatio}`);
        } else {
            classes.push(`${CSS_PREFIX}-thumbnail--aspect-ratio-${lx.aspectRatio}`);
        }

        if (lx.fillHeight) {
            classes.push(`${CSS_PREFIX}-thumbnail--fill-height`);
        }

        if (angular.isDefined(lx.size)) {
            classes.push(`${CSS_PREFIX}-thumbnail--size-${lx.size}`);
        }

        if (angular.isUndefined(lx.theme)) {
            classes.push(`${CSS_PREFIX}-thumbnail--theme-${_DEFAULT_PROPS.theme}`);
        } else {
            classes.push(`${CSS_PREFIX}-thumbnail--theme-${lx.theme}`);
        }

        if (angular.isUndefined(lx.variant)) {
            classes.push(`${CSS_PREFIX}-thumbnail--variant-${_DEFAULT_PROPS.variant}`);
        } else {
            classes.push(`${CSS_PREFIX}-thumbnail--variant-${lx.variant}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getBackgroundImage = getBackgroundImage;
    lx.getClasses = getClasses;
}

/////////////////////////////

function ThumbnailDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ThumbnailController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
            aspectRatio: '@?lxAspectRatio',
            fillHeight: '=?lxFillHeight',
            image: '@lxImage',
            size: '@?lxSize',
            theme: '@?lxTheme',
            variant: '@?lxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.thumbnail').directive('lxThumbnail', ThumbnailDirective);

/////////////////////////////

export { ThumbnailDirective };
