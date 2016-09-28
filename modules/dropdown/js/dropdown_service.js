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

        service.closeActiveDropdown = closeActiveDropdown;
        service.open = open;
        service.registerActiveDropdownUuid = registerActiveDropdownUuid;
        service.resetActiveDropdownUuid = resetActiveDropdownUuid;

        $document.on('click', closeActiveDropdown);

        ////////////

        function closeActiveDropdown()
        {
            $rootScope.$broadcast('lx-dropdown__close-active-dropdown',
            {
                uuid: activeDropdownUuid
            });
        }

        function open(_uuid, _target)
        {
            angular.element(_target).on('click', function(_event)
            {
                _event.stopPropagation();
            });

            closeActiveDropdown();

            activeDropdownUuid = _uuid;

            $rootScope.$broadcast('lx-dropdown__open',
            {
                uuid: _uuid,
                target: _target
            });
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