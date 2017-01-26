(function()
{
    'use strict';

    angular
        .module('lumx.dropdown')
        .service('LxDropdownService', LxDropdownService);

    LxDropdownService.$inject = ['$document', '$rootScope', '$timeout'];

    function LxDropdownService($document, $rootScope, $timeout)
    {
        var service = this;
        var activeDropdownUuid;

        service.close = close;
        service.closeActiveDropdown = closeActiveDropdown;
        service.open = open;
        service.isOpen = isOpen;
        service.registerActiveDropdownUuid = registerActiveDropdownUuid;
        service.resetActiveDropdownUuid = resetActiveDropdownUuid;

        $document.on('click', closeActiveDropdown);

        ////////////

        function close(_uuid)
        {
            $rootScope.$broadcast('lx-dropdown__close',
            {
                uuid: _uuid
            });
        }

        function closeActiveDropdown()
        {
            $rootScope.$broadcast('lx-dropdown__close',
            {
                uuid: activeDropdownUuid
            });
        }

        function open(_uuid, _target)
        {
            $rootScope.$broadcast('lx-dropdown__open',
            {
                uuid: _uuid,
                target: _target
            });
        }

        function isOpen(_uuid)
        {
            return activeDropdownUuid === _uuid;
        }

        function registerActiveDropdownUuid(_uuid)
        {
            activeDropdownUuid = _uuid;
        }

        function resetActiveDropdownUuid()
        {
            activeDropdownUuid = undefined;
        }
    }
})();