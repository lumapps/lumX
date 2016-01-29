(function()
{
    'use strict';

    angular
        .module('lumx.icon')
        .directive('lxIcon', lxIcon);

    function lxIcon()
    {
        return {
            restrict: 'E',
            templateUrl: 'icon.html',
            scope:
            {
                color: '@?lxColor',
                id: '@lxId',
                size: '@?lxSize',
                type: '@?lxType'
            },
            controller: LxIconController,
            controllerAs: 'lxIcon',
            bindToController: true,
            replace: true
        };
    }

    function LxIconController()
    {
        var lxIcon = this;

        lxIcon.getClass = getClass;

        ////////////

        function getClass()
        {
            var iconClass = [];

            iconClass.push('mdi-' + lxIcon.id);

            if (angular.isDefined(lxIcon.size))
            {
                iconClass.push('icon--' + lxIcon.size);
            }

            if (angular.isDefined(lxIcon.color))
            {
                iconClass.push('icon--' + lxIcon.color);
            }

            if (angular.isDefined(lxIcon.type))
            {
                iconClass.push('icon--' + lxIcon.type);
            }

            return iconClass;
        }
    }
})();