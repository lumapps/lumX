/* eslint-disable angular/component-limit */
(function IIFE() {
    'use strict';

    /////////////////////////////

    /**
     * Highlights text in a string that matches another string.
     *
     * Taken from AngularUI Bootstrap Typeahead
     * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
     */
    HighlightFilter.$inject = ['LxUtils'];
    function HighlightFilter(LxUtils) {
        return function highlightCode(matchItem, query, html) {
            if (!html) {
                return (query && matchItem) ?
                    matchItem.replace(
                        new RegExp(LxUtils.escapeRegexp(query), 'gi'),
                        '<span class="lx-select-choices__pane-choice--highlight">$&</span>'
                    ) : matchItem;
            }

            var el = angular.element('<div>' + matchItem + '</div>');
            if (el.children().length) {
                angular.forEach(el.children(), function forEachNodes(node) {
                    if (node.nodeName !== 'SPAN') {
                        return;
                    }

                    var nodeEl = angular.element(node);
                    nodeEl.html(highlightCode(nodeEl.text(), query, false));
                });
            } else {
                el.html(highlightCode(el.text(), query, false));
            }

            return el.html();
        };
    }

    /////////////////////////////

    /**
     * Blocks the propagation of an event in the DOM.
     *
     * @param  {string}    stopPropagation The name of the event (or events) to be stopped.
     * @return {Directive} The stop propagation directive.
     */
    function StopPropagationDirective() {
        return function stopPropagationCode(scope, el, attrs) {
            el.on(attrs.lxStopPropagation, function stopPropagation(evt) {
                evt.stopPropagation();
            });
        };
    }

    /////////////////////////////

    /**
     * Place here only small, highly re-usable directives.
     * For a big complex directive, use a separate own file.
     * For a directive specific to your application, place it in your application.
     */
    angular.module('lumx.utils.directives')
        .directive('lxStopPropagation', StopPropagationDirective);

    angular.module('lumx.utils.filters')
        .filter('lxHighlight', HighlightFilter);
})();
