import { ENTER_KEY_CODE } from '@lumx/core/js/constants';

/////////////////////////////

function EnterKeydownDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        el.on('keydown', (evt) => {
            if (evt.which === ENTER_KEY_CODE) {
                scope.$apply(() => {
                    scope.$eval(attrs.lxEnterKeydown, { $event: evt });
                });

                evt.preventDefault();
            }
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module('lumx.utils.enter-keydown').directive('lxEnterKeydown', EnterKeydownDirective);

/////////////////////////////

export { EnterKeydownDirective };
