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
        service.handleScrollAfterRecompilation = handleScrollAfterRecompilation;
        service.open = open;
        service.isOpen = isOpen;
        service.registerActiveDropdownUuid = registerActiveDropdownUuid;
        service.resetActiveDropdownUuid = resetActiveDropdownUuid;

        ////////////

        function close(_uuid, isDocumentClick)
        {
            isDocumentClick = isDocumentClick || false;
            $rootScope.$broadcast('lx-dropdown__close',
            {
                documentClick: isDocumentClick,
                uuid: _uuid
            });
        }

        function closeActiveDropdown()
        {
            if (angular.isDefined(activeDropdownUuid) && activeDropdownUuid.length > 0) {
                $rootScope.$broadcast('lx-dropdown__close',
                {
                    documentClick: true,
                    uuid: activeDropdownUuid
                });
            }
        }

        function handleScrollAfterRecompilation(evt)
        {
            var dropdownElement;
            var registeredScrollTop = 0;

            dropdownElement = angular.element(evt.target).closest('.lx-select-choices.dropdown-menu--is-open')[0];

            if (angular.isDefined(dropdownElement)) {
                registeredScrollTop = dropdownElement.scrollTop;
            }

            if (registeredScrollTop > 0) {
                $timeout(function waitForDigestCycle() {
                    dropdownElement.scrollTop = registeredScrollTop;
                });
            }
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
