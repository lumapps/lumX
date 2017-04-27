(function()
{
    'use strict';

    angular
        .module('lumx.utils.utils')
        .service('LxUtils', LxUtils);

    function LxUtils()
    {
        var service = this;

        service.debounce = debounce;
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