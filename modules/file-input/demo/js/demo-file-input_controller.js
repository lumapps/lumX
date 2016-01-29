(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoFileInputController', DemoFileInputController);

    function DemoFileInputController()
    {
        var vm = this;

        vm.manageFile = manageFile;

        ////////////

        function manageFile(_file)
        {
            console.log(_file);
        }
    }
})();