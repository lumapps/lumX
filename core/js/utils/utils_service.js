function UtilsService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Returns a function, that, as long as it continues to be invoked, will not be triggered.
     *
     * @param  {Function} func      The function to debounce.
     * @param  {number}   wait      The function will be called after it stops being called for N milliseconds.
     * @param  {boolean}  immediate Whether to trigger the function on the leading edge.
     * @return {Function} The debounced function.
     */
    function debounce(func, wait, immediate) {
        let args, context, result, timeout, timestamp;

        wait = wait || 500;

        const later = () => {
            const last = Date.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;

                if (!immediate) {
                    result = func.apply(context, args);

                    if (!timeout) {
                        // eslint-disable-next-line no-multi-assign
                        context = args = null;
                    }
                }
            }
        };

        const debounced = () => {
            context = this;
            // eslint-disable-next-line prefer-rest-params
            args = arguments;
            timestamp = Date.now();

            const callNow = immediate && !timeout;

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }

            if (callNow) {
                result = func.apply(context, args);
                // eslint-disable-next-line no-multi-assign
                context = args = null;
            }

            return result;
        };

        debounced.clear = () => {
            clearTimeout(timeout);
            // eslint-disable-next-line no-multi-assign
            timeout = context = args = null;
        };

        return debounced;
    }

    /**
     * Disable body scroll.
     */
    function disableBodyScroll() {
        $rootScope.$broadcast('lx-scroll__disable');
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

    /**
     * Generate a unique identifier.
     *
     * @return {string} A unique identifier.
     */
    function generateUUID() {
        /* eslint-disable no-bitwise, no-magic-numbers */
        let time = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            const random = (time + Math.random() * 16) % 16 | 0;
            time = Math.floor(time / 16);

            return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
        /* eslint-enable no-bitwise, no-magic-numbers */
    }

    /**
     * Restore body scroll.
     */
    function restoreBodyScroll() {
        $rootScope.$broadcast('lx-scroll__restore');
    }

    /////////////////////////////

    service.debounce = debounce;
    service.disableBodyScroll = disableBodyScroll;
    service.escapeRegexp = escapeRegexp;
    service.generateUUID = generateUUID;
    service.restoreBodyScroll = restoreBodyScroll;
}

/////////////////////////////

angular.module('lumx.utils.utils').service('LxUtilsService', UtilsService);

/////////////////////////////

export { UtilsService };
