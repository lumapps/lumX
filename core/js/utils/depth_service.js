(function()
{
    'use strict';

    angular
        .module('lumx.utils.depth')
        .service('LxDepthService', LxDepthService);

    function LxDepthService()
    {
        var service = this;
        var depth = 1000;

        service.getDepth = getDepth;
        service.register = register;

        ////////////

        function getDepth()
        {
            return depth;
        }

        function register()
        {
            depth++;
        }
    }
})();