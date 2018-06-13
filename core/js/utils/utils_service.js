(function()
{
    'use strict';

    angular
        .module('lumx.utils.utils')
        .service('LxUtils', LxUtils);

    function LxUtils()
    {
        var service = this;
        var alreadyDisabledScroll = false;

        service.debounce = debounce;
        service.disableBodyScroll = disableBodyScroll;
        service.escapeRegexp = escapeRegexp;
        service.generateUUID = generateUUID;

        ////////////

        // http://underscorejs.org/#debounce (1.8.3)
        function debounce(func, wait, immediate)
        {
            var timeout, args, context, timestamp, result;

            wait = wait || 500;

            var later = function()
            {
                var last = Date.now() - timestamp;

                if (last < wait && last >= 0)
                {
                    timeout = setTimeout(later, wait - last);
                }
                else
                {
                    timeout = null;
                    if (!immediate)
                    {
                        result = func.apply(context, args);
                        if (!timeout)
                        {
                            context = args = null;
                        }
                    }
                }
            };

            var debounced = function()
            {
                context = this;
                args = arguments;
                timestamp = Date.now();
                var callNow = immediate && !timeout;
                if (!timeout)
                {
                    timeout = setTimeout(later, wait);
                }
                if (callNow)
                {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };

            debounced.clear = function()
            {
                clearTimeout(timeout);
                timeout = context = args = null;
            };

            return debounced;
        }

        function disableBodyScroll()
        {
            var body = document.body;
            var documentElement = document.documentElement;

            if (!alreadyDisabledScroll) {
                var prevDocumentStyle = documentElement.style.cssText || '';
                var prevBodyStyle = body.style.cssText || '';
                var viewportTop = (document.scrollingElement) ?
                    document.scrollingElement.scrollTop : window.scrollY || window.pageYOffset || body.scrollTop;
                viewportTop = viewportTop || 0;
            }


            var clientWidth = body.clientWidth;
            var hasVerticalScrollbar = body.scrollHeight > window.innerHeight + 1;

            if (hasVerticalScrollbar)
            {
              angular.element('body').css({
                overflow: 'hidden',
              });
            }

            if (body.clientWidth < clientWidth)
            {
              body.style.overflow = 'hidden';
            }

            // This should be applied after the manipulation to the body, because
            // adding a scrollbar can potentially resize it, causing the measurement
            // to change.
            if (hasVerticalScrollbar)
            {
              documentElement.style.overflowY = 'scroll';
            }

            // This attribution prevents this function to consider the css it sets
            // to body and documents to be the 'previous' css attributes to recover.
            alreadyDisabledScroll = true;

            return function restoreScroll()
            {
                if (!alreadyDisabledScroll) {
                    return;
                }

                // Reset the inline style CSS to the previous.
                body.style.cssText = prevBodyStyle;
                documentElement.style.cssText = prevDocumentStyle;
                
                // The body loses its scroll position while being fixed.
                if (document.scrollingElement) {
                    document.scrollingElement.scrollTop = viewportTop;
                } else {
                    body.scrollTop = viewportTop;
                }

                alreadyDisabledScroll = false;
            };
        }

        /**
         * Escape all RegExp special characters in a string.
         *
         * @param  {string} strToEscape The string to escape RegExp special char in.
         * @return {string} The escapes string.
         */
        function escapeRegexp(strToEscape) {
            return strToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        function generateUUID()
        {
            var d = new Date().getTime();

            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
            {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8))
                    .toString(16);
            });

            return uuid.toUpperCase();
        }
    }
})();
