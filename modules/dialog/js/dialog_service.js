(function()
{
    'use strict';

    angular
        .module('lumx.dialog')
        .service('LxDialogService', LxDialogService);

    LxDialogService.$inject = ['$rootScope'];

    function LxDialogService($rootScope)
    {
        var service = this;

        service.open = open;
        service.close = close;

        ////////////

        function open(_dialogId)
        {
            $rootScope.$broadcast('lx-dialog__open', _dialogId);
        }

        function close(_dialogId)
        {
            $rootScope.$broadcast('lx-dialog__close', _dialogId);
        }
    }
})();