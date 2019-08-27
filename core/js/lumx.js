/* eslint-disable import/unambiguous */

angular.module('lumx.utils.depth', []);
angular.module('lumx.utils.enter-keypress', []);
angular.module('lumx.utils.event-scheduler', []);
angular.module('lumx.utils.focus-on-init', []);
angular.module('lumx.utils.focus-trap', []);
angular.module('lumx.utils.stop-propagation', []);
angular.module('lumx.utils.transclude-replace', []);
angular.module('lumx.utils.utils', []);

angular.module('lumx.utils', [
    'lumx.utils.depth',
    'lumx.utils.enter-keypress',
    'lumx.utils.event-scheduler',
    'lumx.utils.focus-on-init',
    'lumx.utils.focus-trap',
    'lumx.utils.stop-propagation',
    'lumx.utils.transclude-replace',
    'lumx.utils.utils',
]);

angular.module('lumx.button', []);
angular.module('lumx.checkbox', []);
angular.module('lumx.chip', []);
angular.module('lumx.data-table', []);
angular.module('lumx.date-picker', []);
angular.module('lumx.dialog', ['lumx.utils.event-scheduler']);
angular.module('lumx.dropdown', ['lumx.utils.event-scheduler']);
angular.module('lumx.fab', []);
angular.module('lumx.file-input', []);
angular.module('lumx.icon', []);
angular.module('lumx.list', []);
angular.module('lumx.notification', ['lumx.utils.event-scheduler']);
angular.module('lumx.progress', []);
angular.module('lumx.radio-button', []);
angular.module('lumx.ripple', []);
angular.module('lumx.search-filter', []);
angular.module('lumx.select', []);
angular.module('lumx.stepper', []);
angular.module('lumx.switch', []);
angular.module('lumx.tabs', []);
angular.module('lumx.text-field', []);
angular.module('lumx.tooltip', []);

angular.module('lumx', [
    'lumx.button',
    'lumx.checkbox',
    'lumx.chip',
    'lumx.data-table',
    'lumx.date-picker',
    'lumx.dialog',
    'lumx.dropdown',
    'lumx.fab',
    'lumx.file-input',
    'lumx.icon',
    'lumx.list',
    'lumx.notification',
    'lumx.progress',
    'lumx.radio-button',
    'lumx.ripple',
    'lumx.search-filter',
    'lumx.select',
    'lumx.stepper',
    'lumx.switch',
    'lumx.tabs',
    'lumx.text-field',
    'lumx.tooltip',
    'lumx.utils',
]);
