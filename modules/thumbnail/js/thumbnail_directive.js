import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from '../views/thumbnail.html';

/////////////////////////////

function ThumbnailController() {
    // eslint-disable-next-line consistent-this
    const lx = this;

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

    /////////////////////////////

    lx.getBackgroundImage = getBackgroundImage;
}

/////////////////////////////

function ThumbnailDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            aspectRatio: 'original',
            variant: 'squared',
        };

        if (!attrs.lxAspectRatio) {
            el.addClass(`${CSS_PREFIX}-thumbnail--aspect-ratio-${defaultProps.aspectRatio}`);
        }

        attrs.$observe('lxAspectRatio', (aspectRatio) => {
            if (!aspectRatio) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--aspect-ratio-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--aspect-ratio-${aspectRatio}`);
        });

        attrs.$observe('lxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--size-${size}`);
        });

        if (!attrs.lxVariant) {
            el.addClass(`${CSS_PREFIX}-thumbnail--variant-${defaultProps.variant}`);
        }

        attrs.$observe('lxVariant', (variant) => {
            if (!variant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--variant-${variant}`);
        });
    }

    return {
        bindToController: true,
        controller: ThumbnailController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
            aspectRatio: '@?lxAspectRatio',
            fillHeight: '=?lxFillHeight',
            image: '@lxImage',
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.thumbnail').directive('lxThumbnail', ThumbnailDirective);

/////////////////////////////

export { ThumbnailDirective };
