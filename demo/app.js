/* eslint-disable global-require, import/no-commonjs, import/no-unassigned-import, import/unambiguous */

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
        .state('app.components.text-field', {
            url: 'text-field',
            views: {
                'main@': {
                    controller: 'DemoTextFieldController',
                    controllerAs: 'vm',
                    template: require('./components/text-field/demo.html'),
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
}

AppDefaultRun.$inject = ['$rootScope'];

/////////////////////////////

angular
    .module('lumx-demo', ['lumx', 'ui.router', 'hljs', 'hc.marked'])
    .config(AppDefaultConfig)
    .run(AppDefaultRun);
