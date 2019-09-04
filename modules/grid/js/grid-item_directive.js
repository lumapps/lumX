import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function GridItemDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        attrs.$observe('lxAlign', (align) => {
            if (!align) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--align-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--align-${align}`);
        });

        attrs.$observe('lxOrder', (order) => {
            if (!order) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--order-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--order-${order}`);
        });

        attrs.$observe('lxWidth', (width) => {
            if (!width) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--width-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--width-${width}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: '<div class="lumx-grid-item" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.grid').directive('lxGridItem', GridItemDirective);

/////////////////////////////

export { GridItemDirective };
