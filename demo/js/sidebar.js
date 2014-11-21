/* global angular */
'use strict'; // jshint ignore:line

var sidebar = angular.module('Sidebar', []).service('SidebarService', function()
{
    var sidebarIsShown = false;

    function toggleSidebar()
    {
        sidebarIsShown = !sidebarIsShown;
    }

    return {
        isSidebarShown: function()
        {
            return sidebarIsShown;
        },
        toggleSidebar: toggleSidebar
    };
});
