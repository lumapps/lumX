(function()
{
    'use strict';

    angular
        .module('lumx-demo', [
            'lumx',
            'ui.router',
            'hljs',
            'Controllers',
            'Directives',
            'Services'
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
                            templateUrl: '/includes/layout/sub-nav/sub-nav-getting-started.html'
                        }
                    },
                    redirectTo: 'app.getting-started.installation'
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
                .state('app.getting-started.customization',
                {
                    url: '/customization',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/getting-started/customization.html'
                        }
                    }
                })
                .state('app.getting-started.contribute',
                {
                    url: '/contribute',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/getting-started/contribute.html'
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
                            templateUrl: '/includes/layout/sub-nav/sub-nav-css.html'
                        }
                    },
                    redirectTo: 'app.css.color'
                })
                .state('app.css.color',
                {
                    url: '/color',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/css/color.html'
                        }
                    }
                })
                .state('app.css.flexbox',
                {
                    url: '/flexbox',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/css/flexbox.html'
                        }
                    }
                })
                .state('app.css.mixin',
                {
                    url: '/mixin',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/css/mixin.html'
                        }
                    }
                })
                .state('app.css.typography',
                {
                    url: '/typography',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/css/typography.html'
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
                            templateUrl: '/includes/layout/sub-nav/sub-nav-components.html'
                        }
                    },
                    redirectTo: 'app.components.button'
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
                })
                .state('app.components.card',
                {
                    url: '/card',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/card/card.html'
                        }
                    }
                })
                .state('app.components.checkbox',
                {
                    url: '/checkbox',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/checkbox/checkbox.html',
                            controller: 'DemoCheckboxController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.chip',
                {
                    url: '/chip',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/chip/chip.html'
                        }
                    }
                })
                .state('app.components.data-table',
                {
                    url: '/data-table',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/data-table/data-table.html',
                            controller: 'DemoDataTableController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.date-picker',
                {
                    url: '/date-picker',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/date-picker/date-picker.html',
                            controller: 'DemoDatePickerController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.dialog',
                {
                    url: '/dialog',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/dialog/dialog.html',
                            controller: 'DemoDialogController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.dropdown',
                {
                    url: '/dropdown',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/dropdown/dropdown.html',
                            controller: 'DemoDropdownController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.fab',
                {
                    url: '/fab',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/fab/fab.html'
                        }
                    }
                })
                .state('app.components.file-input',
                {
                    url: '/file-input',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/file-input/file-input.html',
                            controller: 'DemoFileInputController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.icon',
                {
                    url: '/icon',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/icon/icon.html'
                        }
                    }
                })
                .state('app.components.list',
                {
                    url: '/list',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/list/list.html'
                        }
                    }
                })
                .state('app.components.notification',
                {
                    url: '/notification',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/notification/notification.html',
                            controller: 'DemoNotificationController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.progress',
                {
                    url: '/progress',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/progress/progress.html',
                            controller: 'DemoProgressController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.radio-button',
                {
                    url: '/radio-button',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/radio-button/radio-button.html',
                            controller: 'DemoRadioButtonController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.search-filter',
                {
                    url: '/search-filter',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/search-filter/search-filter.html',
                            controller: 'DemoSearchFilterController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.select',
                {
                    url: '/select',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/select/select.html',
                            controller: 'DemoSelectController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.switch',
                {
                    url: '/switch',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/switch/switch.html',
                            controller: 'DemoSwitchController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.tabs',
                {
                    url: '/tabs',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/tabs/tabs.html',
                            controller: 'DemoTabsController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.text-field',
                {
                    url: '/text-field',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/text-field/text-field.html',
                            controller: 'DemoTextFieldController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.components.toolbar',
                {
                    url: '/toolbar',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/toolbar/toolbar.html'
                        }
                    }
                })
                .state('app.components.tooltip',
                {
                    url: '/tooltip',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/includes/modules/tooltip/tooltip.html'
                        }
                    }
                });
        })
        .run(['$rootScope', '$state', 'LayoutService', function($rootScope, $state, LayoutService)
        {
            $rootScope.$state = $state;
            $rootScope.LayoutService = LayoutService;

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams)
            {
                if (toState.redirectTo)
                {
                    event.preventDefault();
                    $state.go(toState.redirectTo, toParams)
                }
            });
        }]);

    angular.module('Controllers', []);
    angular.module('Directives', []);
    angular.module('Services', []);
})();