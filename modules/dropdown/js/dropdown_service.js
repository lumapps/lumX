(function()
{
    'use strict';

    angular
        .module('lumx.dropdown')
        .service('LxDropdownService', LxDropdownService);

    LxDropdownService.$inject = [];

    function LxDropdownService()
    {
        var service = this;
        var scopes = {};

        service.closeAll = closeAll;
        service.getScope = getScope;
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