function PopoverService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given popover.
     *
     * @param {string} popoverId The popover identifier.
     */
    function closePopover(popoverId) {
        $rootScope.$broadcast('lx-popover__close', popoverId);
    }

    /**
     * Open a given popover.
     *
     * @param {string} popoverId The popover identifier.
     * @param {Object} params    An optional object that holds extra parameters.
     */
    function openPopover(popoverId, params) {
        $rootScope.$broadcast('lx-popover__open', popoverId, params);
    }

    /////////////////////////////

    service.close = closePopover;
    service.open = openPopover;
}

/////////////////////////////

angular.module('lumx.popover').service('LxPopoverService', PopoverService);

/////////////////////////////

export { PopoverService };
