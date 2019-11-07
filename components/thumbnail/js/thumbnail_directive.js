import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/thumbnail.html';

/////////////////////////////

function ThumbnailController() {
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

        const align = lx.align ? lx.align : _DEFAULT_PROPS.align;
        const aspectRatio = lx.aspectRatio ? lx.aspectRatio : _DEFAULT_PROPS.aspectRatio;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        const variant = lx.variant ? lx.variant : _DEFAULT_PROPS.variant;

        classes.push(`${CSS_PREFIX}-thumbnail--align-${align}`);
        classes.push(`${CSS_PREFIX}-thumbnail--aspect-ratio-${aspectRatio}`);
        classes.push(`${CSS_PREFIX}-thumbnail--theme-${theme}`);
        classes.push(`${CSS_PREFIX}-thumbnail--variant-${variant}`);

        if (lx.fillHeight) {
            classes.push(`${CSS_PREFIX}-thumbnail--fill-height`);
        }

        if (lx.size) {
            classes.push(`${CSS_PREFIX}-thumbnail--size-${lx.size}`);
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
