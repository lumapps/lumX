function DropdownService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The active dropdown identifier.
     *
     * @type {string}
     */
    const _activeDropdownIds = [];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given dropdown.
     *
     * @param {string}  dropdownId        The dropdown identifier.
     * @param {boolean} onOpen            Whether the order has been asked on dropdown open or not.
     * @param {boolean} isDocumentKeyDown Whether the order has been asked on document key down or not.
     */
    function closeDropdown(dropdownId, onOpen, isDocumentKeyDown) {
        $rootScope.$broadcast('lx-dropdown__close', dropdownId, onOpen, isDocumentKeyDown);
    }

    /**
     * Close the last opened dropdown.
     *
     * @param {boolean} onOpen            Whether the order has been asked on dropdown open or not.
     * @param {boolean} isDocumentKeyDown Whether the order has been asked on document key down or not.
     */
    function closeLastDropdown(onOpen, isDocumentKeyDown) {
        if (_activeDropdownIds.length > 0) {
            closeDropdown(_activeDropdownIds[_activeDropdownIds.length - 1], onOpen, isDocumentKeyDown);
        }
    }

    /**
     * Get last dropdown id.
     *
     * @return {string} The last dropdown id.
     */
    function getLastDropdownId() {
        return _activeDropdownIds[_activeDropdownIds.length - 1];
    }

    /**
     * Check if a given dropdown is open.
     *
     * @param  {string}  dropdownId The dropdown identifier.
     * @return {boolean} Whether the given dropdown is open or not.
     */
    function isOpen(dropdownId) {
        return _activeDropdownIds.includes(dropdownId);
    }

    /**
     * Open a given dropdown.
     *
     * @param {string} dropdownId The dropdown identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    function openDropdown(dropdownId, params) {
        $rootScope.$broadcast('lx-dropdown__open', dropdownId, params);
    }

    /**
     * Register the given dropdown identifier.
     *
     * @param {string} dropdownId The dropdown identifier.
     */
    function registerDropdownId(dropdownId) {
        _activeDropdownIds.push(dropdownId);
    }

    /**
     * Unegister the given dropdown identifier.
     *
     * @param {string} dropdownId The dropdown identifier.
     */
    function unregisterDropdownId(dropdownId) {
        _activeDropdownIds.splice(_activeDropdownIds.indexOf(dropdownId), 1);
    }

    /**
     * Update the active dropdown position.
     */
    function updateActiveDropdownPosition() {
        $rootScope.$broadcast('lx-dropdown__update');
    }

    /////////////////////////////

    service.close = closeDropdown;
    service.closeLastDropdown = closeLastDropdown;
    service.getLastDropdownId = getLastDropdownId;
    service.isOpen = isOpen;
    service.open = openDropdown;
    service.registerDropdownId = registerDropdownId;
    service.unregisterDropdownId = unregisterDropdownId;
    service.updateActiveDropdownPosition = updateActiveDropdownPosition;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Update the active dropdown position on scroll.
     */
    window.addEventListener('scroll', service.updateActiveDropdownPosition, true);
}

/////////////////////////////

angular.module('lumx.dropdown').service('LxDropdownService', DropdownService);

/////////////////////////////

export { DropdownService };
