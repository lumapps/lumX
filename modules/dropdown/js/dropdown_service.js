(function()
{
    'use strict';

    angular
        .module('lumx.dropdown')
        .service('LxDropdownService', LxDropdownService);

    LxDropdownService.$inject = ['$timeout'];

    function LxDropdownService($timeout)
    {
        var service = this;
        var scopes = {};

        service.closeAll = closeAll;
        service.getScope = getScope;
        service.open = open;
        service.registerScope = registerScope;
        service.removeScope = removeScope;

        ////////////

        function closeAll(_uuid)
        {
            for (var uuid in scopes)
            {
                if (uuid !== _uuid)
                {
                    scopes[uuid].lxDropdown.closeDropdownMenu();
                }
            }
        }

        function getScope(_uuid)
        {
            return scopes[_uuid];
        }

        function open(_uuid, _target)
        {
            scopes[_uuid].lxDropdown.registerDropdownToggle(angular.element(_target));

            $timeout(function()
            {
                scopes[_uuid].lxDropdown.openDropdownMenu();
            });
        }

        function registerScope(_scope)
        {
            scopes[_scope.lxDropdown.uuid] = _scope;
        }

        function removeScope(_uuid)
        {
            delete scopes[_uuid];
        }
    }
})();