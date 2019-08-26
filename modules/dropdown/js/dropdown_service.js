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
    let _activeDropdownId;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close a given dropdown.
     *
     * @param {string} dropdownId The dropdown identifier.
     */
    function closeDropdown(dropdownId) {
        $rootScope.$broadcast('lx-dropdown__close', dropdownId);
    }

    /**
     * Close the active dropdown.
     */
    function closeActiveDropdown() {
        if (angular.isDefined(_activeDropdownId)) {
            closeDropdown(_activeDropdownId);
        }
    }

    /**
     * Check if a given dropdown is open.
     *
     * @param  {string}  dropdownId The dropdown identifier.
     * @return {boolean} Whether the given dropdown is open or not.
     */
    function isOpen(dropdownId) {
        return _activeDropdownId === dropdownId;
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
     * Register the active dropdown identifier.
     *
     * @param {string} dropdownId The dropdown identifier.
     */
    function registerActiveDropdownId(dropdownId) {
        _activeDropdownId = dropdownId;
    }

    /**
     * Reset the active dropdown identifier.
     */
    function resetActiveDropdownId() {
        _activeDropdownId = undefined;
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
    service.registerActiveDropdownId = registerActiveDropdownId;
    service.resetActiveDropdownId = resetActiveDropdownId;
    service.updateActiveDropdownPosition = updateActiveDropdownPosition;
}

/////////////////////////////

angular.module('lumx.dropdown').service('LxDropdownService', DropdownService);

/////////////////////////////

export { DropdownService };
