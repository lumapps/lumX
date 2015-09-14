/* global angular */

angular.module('lumx.utils', [
    'lumx.utils.transclude',
    'lumx.utils.transclude-replace',
    'lumx.utils.event-scheduler'
]);

angular.module('lumx', [
    'lumx.button',
    'lumx.date-picker',
    'lumx.dialog',
    'lumx.dropdown',
    'lumx.file-input',
    'lumx.notification',
    'lumx.progress',
    'lumx.ripple',
    'lumx.scrollbar',
    'lumx.search-filter',
    'lumx.select',
    'lumx.tabs',
    'lumx.text-field',
    'lumx.thumbnail',
    'lumx.tooltip',
    'lumx.utils'
]);
