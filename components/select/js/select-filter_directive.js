import { CSS_PREFIX, DOWN_KEY_CODE, ESCAPE_KEY_CODE } from '@lumx/core/js/constants';

/////////////////////////////

function SelectFilterDirective() {
    'ngInject';

    function link(scope, el) {
        el.focus().on('click keydown', (evt) => {
            if (evt.keyCode === ESCAPE_KEY_CODE) {
                return;
            }

            evt.stopPropagation();

            if (evt.keyCode === DOWN_KEY_CODE) {
                el.parent()
                    .next()
                    .find(`.${CSS_PREFIX}-list-item:first-child`)
                    .focus();
            }
        });

        scope.$on('$destroy', () => {
            el.off();
        });
    }

    return {
        link,
        restrict: 'A',
    };
}

/////////////////////////////

angular.module('lumx.select').directive('lxSelectFilter', SelectFilterDirective);

/////////////////////////////

export { SelectFilterDirective };
