import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function GridDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            orientation: 'horizontal',
            wrap: 'nowrap',
        };

        if (!attrs.lxOrientation) {
            el.addClass(`${CSS_PREFIX}-grid--orientation-${defaultProps.orientation}`);
        }

        attrs.$observe('lxOrientation', (orientation) => {
            if (!orientation) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--orientation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--orientation-${orientation}`);
        });

        if (!attrs.lxWrap) {
            el.addClass(`${CSS_PREFIX}-grid--wrap-${defaultProps.wrap}`);
        }

        attrs.$observe('lxWrap', (wrap) => {
            if (!wrap) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--wrap-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--wrap-${wrap}`);
        });

        attrs.$observe('lxHAlign', (hAlign) => {
            if (!hAlign) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--hAlign-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--h-align-${hAlign}`);
        });

        attrs.$observe('lxVAlign', (vAlign) => {
            if (!vAlign) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--vAlign-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--v-align-${vAlign}`);
        });

        attrs.$observe('lxGutter', (gutter) => {
            if (!gutter) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--gutter-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--gutter-${gutter}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: '<div class="lumx-grid" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.grid').directive('lxGrid', GridDirective);

/////////////////////////////

export { GridDirective };
