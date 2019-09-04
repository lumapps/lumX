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
