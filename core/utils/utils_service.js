function UtilsService() {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

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

    /////////////////////////////

    service.generateUUID = generateUUID;
}

/////////////////////////////

angular.module('lumx.utils.utils').service('LxUtilsService', UtilsService);

/////////////////////////////

export { UtilsService };
