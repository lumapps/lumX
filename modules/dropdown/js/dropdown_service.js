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
     * @param {string}  dropdownId      The dropdown identifier.
     * @param {boolean} isDocumentClick Whether the method has been called on document click or not.
     */
    function closeDropdown(dropdownId, isDocumentClick) {
        $rootScope.$broadcast('lx-dropdown__close', dropdownId, isDocumentClick);
    }

    /**
     * Close the active dropdown.
     *
     * @param {boolean} isDocumentClick Whether the method has been called on document click or not.
     */
    function closeActiveDropdown(isDocumentClick) {
        if (_activeDropdownIds.length > 0) {
            closeDropdown(_activeDropdownIds[_activeDropdownIds.length - 1], isDocumentClick);
        }
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
    service.closeActiveDropdown = closeActiveDropdown;
    service.isOpen = isOpen;
    service.open = openDropdown;
    service.registerDropdownId = registerDropdownId;
    service.unregisterDropdownId = unregisterDropdownId;
    service.updateActiveDropdownPosition = updateActiveDropdownPosition;
}

/////////////////////////////

angular.module('lumx.dropdown').service('LxDropdownService', DropdownService);

/////////////////////////////

export { DropdownService };
