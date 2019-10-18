/* eslint-disable global-require, import/no-commonjs, import/no-unassigned-import, import/unambiguous */
import { setCustomColors } from '@lumx/core/js/custom-colors';

/////////////////////////////

function AppDefaultConfig($locationProvider, $stateProvider, markedProvider) {
    $locationProvider.html5Mode({
        enabled: true,
    });

    markedProvider.setOptions({ breaks: true, gfm: true });

    $stateProvider
        .state({
            name: 'app',
            url: '/',
            views: {
                'main-nav': {
                    controller: 'MainNavController',
                    controllerAs: 'vm',
                    template: require('./layout/main-nav/main-nav.html'),
                },
            },
        })
        .state('app.foundations', {
            abstract: true,
        })
        .state('app.foundations.colors', {
            url: 'colors',
            views: {
                'main@': {
                    controller: 'DemoColorsController',
                    controllerAs: 'vm',
                    template: require('./foundations/colors/demo.html'),
                },
            },
        })
        .state('app.foundations.typography', {
            url: 'typography',
            views: {
                'main@': {
                    template: require('./foundations/typography/demo.html'),
                },
            },
        })
        .state('app.components', {
            abstract: true,
        })
        .state('app.components.button', {
            url: 'button',
            views: {
                'main@': {
                    controller: 'DemoButtonController',
                    controllerAs: 'vm',
                    template: require('./components/button/demo.html'),
                },
            },
        })
        .state('app.components.checkbox', {
            url: 'checkbox',
            views: {
                'main@': {
                    controller: 'DemoCheckboxController',
                    controllerAs: 'vm',
                    template: require('./components/checkbox/demo.html'),
                },
            },
        })
        .state('app.components.chip', {
            url: 'chip',
            views: {
                'main@': {
                    controller: 'DemoChipController',
                    controllerAs: 'vm',
                    template: require('./components/chip/demo.html'),
                },
            },
        })
        .state('app.components.date-picker', {
            url: 'date-picker',
            views: {
                'main@': {
                    controller: 'DemoDatePickerController',
                    controllerAs: 'vm',
                    template: require('./components/date-picker/demo.html'),
                },
            },
        })
        .state('app.components.dialog', {
            url: 'dialog',
            views: {
                'main@': {
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    template: require('./components/dialog/demo.html'),
                },
            },
        })
        .state('app.components.dropdown', {
            url: 'dropdown',
            views: {
                'main@': {
                    controller: 'DemoDropdownController',
                    controllerAs: 'vm',
                    template: require('./components/dropdown/demo.html'),
                },
            },
        })
        .state('app.components.grid', {
            url: 'grid',
            views: {
                'main@': {
                    template: require('./components/grid/demo.html'),
                },
            },
        })
        .state('app.components.list', {
            url: 'list',
            views: {
                'main@': {
                    controller: 'DemoListController',
                    controllerAs: 'vm',
                    template: require('./components/list/demo.html'),
                },
            },
        })
        .state('app.components.notification', {
            url: 'notification',
            views: {
                'main@': {
                    controller: 'DemoNotificationController',
                    controllerAs: 'vm',
                    template: require('./components/notification/demo.html'),
                },
            },
        })
        .state('app.components.progress', {
            url: 'progress',
            views: {
                'main@': {
                    template: require('./components/progress/demo.html'),
                },
            },
        })
        .state('app.components.radio-button', {
            url: 'radio-button',
            views: {
                'main@': {
                    controller: 'DemoRadioButtonController',
                    controllerAs: 'vm',
                    template: require('./components/radio-button/demo.html'),
                },
            },
        })
        .state('app.components.select', {
            url: 'select',
            views: {
                'main@': {
                    controller: 'DemoSelectController',
                    controllerAs: 'vm',
                    template: require('./components/select/demo.html'),
                },
            },
        })
        .state('app.components.switch', {
            url: 'switch',
            views: {
                'main@': {
                    controller: 'DemoSwitchController',
                    controllerAs: 'vm',
                    template: require('./components/switch/demo.html'),
                },
            },
        })
        .state('app.components.table', {
            url: 'table',
            views: {
                'main@': {
                    controller: 'DemoTableController',
                    controllerAs: 'vm',
                    template: require('./components/table/demo.html'),
                },
            },
        })
        .state('app.components.tabs', {
            url: 'tabs',
            views: {
                'main@': {
                    controller: 'DemoTabsController',
                    controllerAs: 'vm',
                    template: require('./components/tabs/demo.html'),
                },
            },
        })
        .state('app.components.text-field', {
            url: 'text-field',
            views: {
                'main@': {
                    controller: 'DemoTextFieldController',
                    controllerAs: 'vm',
                    template: require('./components/text-field/demo.html'),
                },
            },
        })
        .state('app.components.thumbnail', {
            url: 'thumbnail',
            views: {
                'main@': {
                    template: require('./components/thumbnail/demo.html'),
                },
            },
        })
        .state('app.components.toolbar', {
            url: 'toolbar',
            views: {
                'main@': {
                    controller: 'DemoToolbarController',
                    controllerAs: 'vm',
                    template: require('./components/toolbar/demo.html'),
                },
            },
        })
        .state('app.components.tooltip', {
            url: 'tooltip',
            views: {
                'main@': {
                    template: require('./components/tooltip/demo.html'),
                },
            },
        });
}

AppDefaultConfig.$inject = ['$locationProvider', '$stateProvider', 'markedProvider'];

function AppDefaultRun($rootScope) {
    /**
     * Prevent scroll on main areas of the app.
     *
     * @param {Event} evt The scroll event.
     */
    function scrollHandler(evt) {
        evt.preventDefault();
    }

    $rootScope.$on('lumx-scroll__disable', () => {
        angular.element('.main-nav, .main').on('mousewheel touchmove', scrollHandler);
    });

    $rootScope.$on('lumx-scroll__restore', () => {
        angular.element('.main-nav, .main').off('mousewheel touchmove', scrollHandler);
    });

    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);

    const { sheet } = styleTag;

    setCustomColors(sheet, 'material', {
        primary: {
            D2: '#fea41c',
            D1: '#ffb71f',
            // eslint-disable-next-line id-length
            N: '#ffc525',
            L1: 'rgba(255, 197, 37, 0.8)',
            L2: 'rgba(255, 197, 37, 0.6)',
            L3: 'rgba(255, 197, 37, 0.4)',
            L4: 'rgba(255, 197, 37, 0.2)',
            L5: 'rgba(255, 197, 37, 0.1)',
            L6: 'rgba(255, 197, 37, 0.05)',
        },
        secondary: {
            D2: '#c2395a',
            D1: '#d83e5e',
            // eslint-disable-next-line id-length
            N: '#e94361',
            L1: 'rgba(233, 67, 97, 0.8)',
            L2: 'rgba(233, 67, 97, 0.6)',
            L3: 'rgba(233, 67, 97, 0.4)',
            L4: 'rgba(233, 67, 97, 0.2)',
            L5: 'rgba(233, 67, 97, 0.1)',
            L6: 'rgba(233, 67, 97, 0.05)',
        },
    });
}

AppDefaultRun.$inject = ['$rootScope'];

/////////////////////////////

angular
    .module('lumx-demo', ['lumx', 'ui.router', 'hljs', 'hc.marked'])
    .config(AppDefaultConfig)
    .run(AppDefaultRun);
