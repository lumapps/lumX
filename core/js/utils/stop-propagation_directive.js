function StopPropagationDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        el.on(attrs.lxStopPropagation, (evt) => {
            evt.stopPropagation();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular.module('lumx.utils.stop-propagation').directive('lxStopPropagation', StopPropagationDirective);

/////////////////////////////

export { StopPropagationDirective };
