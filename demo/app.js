(function()
{
    'use strict';

    angular
        .module('lumx-demo', [
            'lumx',
            'ui.router',
            'hljs',
            'Directives'
        ])
        .config(function($locationProvider, $stateProvider)
        {
            $locationProvider.html5Mode(
            {
                enabled: true,
                requireBase: false
            });

            $stateProvider
                .state('app',
                {
                    abstract: true,
                    views:
                    {
                        'header':
                        {
                            templateUrl: '/includes/layout/header/header.html'
                        }
                    }
                })
                .state('app.home',
                {
                    url: '/',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/home/home.html'
                        }
                    }
                })
                .state('app.getting-started',
                {
                    url: '/getting-started',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/includes/layout/sidebar/sidebar-getting-started.html'
                        }
                    }
                })
                .state('app.getting-started.installation',
                {
                    url: '/installation',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/getting-started/installation.html'
                        }
                    }
                })
                .state('app.css',
                {
                    url: '/css',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/includes/layout/sidebar/sidebar-css.html'
                        }
                    }
                })
                .state('app.components',
                {
                    url: '/components',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/includes/layout/sidebar/sidebar-components.html'
                        }
                    }
                })
                .state('app.components.button',
                {
                    url: '/button',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/button/button.html'
                        }
                    }
                });
        });
})();