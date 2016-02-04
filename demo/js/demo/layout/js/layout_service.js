(function()
{
    'use strict';

    angular
        .module('Services')
        .service('LayoutService', LayoutService);

    LayoutService.$inject = [];

    function LayoutService()
    {
        var service = this;

        service.closePalmNav = closePalmNav;
        service.openPalmNav = openPalmNav;
        service.togglePalmNav = togglePalmNav;

        service.palmNavIsOpen = false;

        ////////////

        function closePalmNav()
        {
            service.palmNavIsOpen = false;
        }

        function openPalmNav()
        {
            service.palmNavIsOpen = true;
        }

        function togglePalmNav()
        {
            service.palmNavIsOpen = !service.palmNavIsOpen;
        }
    }
})();