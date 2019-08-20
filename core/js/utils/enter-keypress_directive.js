import { ENTER_KEY_CODE } from '@lumx/core/js/constants';

/////////////////////////////

function EnterKeypressDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        el.on('keydown keypress', (evt) => {
            if (evt.which === ENTER_KEY_CODE) {
                scope.$apply(function evalExpression() {
                    scope.$eval(attrs.lxEnterKeypress, { $event: evt });
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

angular.module('lumx.utils.enter-keypress').directive('lxEnterKeypress', EnterKeypressDirective);

/////////////////////////////

export { EnterKeypressDirective };
