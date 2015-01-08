/* global angular */
/* global escape */
'use strict'; // jshint ignore:line

var app = angular.module('lx', ['ngRoute', 'lumx', 'hljs', 'Sidebar']);

app.config(function($locationProvider, $routeProvider)
{
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.
        when('/', {
            templateUrl: '/demo/includes/homepage/homepage.html'
        }).
        when('/getting-started/installation', {
            templateUrl: '/demo/includes/start/installation.html'
        }).
        when('/getting-started/customization', {
            templateUrl: '/demo/includes/start/customization.html'
        }).
        when('/getting-started/contribute', {
            templateUrl: '/demo/includes/start/contribute.html'
        }).
        when('/css/mixins', {
            templateUrl: '/demo/includes/css/mixins.html'
        }).
        when('/css/typography', {
            templateUrl: '/demo/includes/css/typography.html'
        }).
        when('/css/colors', {
            templateUrl: '/demo/includes/css/colors.html'
        }).
        when('/css/buttons', {
            templateUrl: '/demo/includes/css/buttons.html'
        }).
        when('/css/fab', {
            templateUrl: '/demo/includes/css/fab.html'
        }).
        when('/css/icons', {
            templateUrl: '/demo/includes/css/icons.html'
        }).
        when('/css/lists', {
            templateUrl: '/demo/includes/css/lists.html'
        }).
        when('/css/data-table', {
            templateUrl: '/demo/includes/css/data-table.html'
        }).
        when('/css/cards', {
            templateUrl: '/demo/includes/css/cards.html'
        }).
        when('/css/checkboxes', {
            templateUrl: '/demo/includes/css/checkboxes.html'
        }).
        when('/css/radio-buttons', {
            templateUrl: '/demo/includes/css/radio-buttons.html'
        }).
        when('/css/switches', {
            templateUrl: '/demo/includes/css/switches.html'
        }).
        when('/css/toolbars', {
            templateUrl: '/demo/includes/css/toolbars.html'
        }).
        when('/directives/dropdowns', {
            templateUrl: '/demo/includes/directives/dropdowns.html'
        }).
        when('/directives/tabs', {
            templateUrl: '/demo/includes/directives/tabs.html'
        }).
        when('/directives/text-fields', {
            templateUrl: '/demo/includes/directives/text-fields.html'
        }).
        when('/directives/search-filter', {
            templateUrl: '/demo/includes/directives/search-filter.html'
        }).
        when('/directives/selects', {
            templateUrl: '/demo/includes/directives/selects.html'
        }).
        when('/directives/file-inputs', {
            templateUrl: '/demo/includes/directives/file-inputs.html'
        }).
        when('/directives/tooltips', {
            templateUrl: '/demo/includes/directives/tooltips.html'
        }).
        when('/directives/dialogs', {
            templateUrl: '/demo/includes/directives/dialogs.html'
        }).
        when('/directives/date-picker', {
            templateUrl: '/demo/includes/directives/date-picker.html'
        }).
        when('/directives/thumbnails', {
            templateUrl: '/demo/includes/directives/thumbnails.html'
        }).
        when('/directives/scrollbar', {
            templateUrl: '/demo/includes/directives/scrollbar.html'
        })
        .when('/services/progress', {
            templateUrl: '/demo/includes/services/progress.html'
        });
});

app.controller('AppController',
               function($http, $scope, $location, LxNotificationService, LxDialogService, LxProgressService, SidebarService)
{
    $scope.SidebarService = SidebarService;

    $scope.checkHome = function()
    {
        return $location.path() === '/';
    };

    $scope.repo = {
        lastCommit: {
            date: undefined,
            sha: undefined,
            url: undefined
        },
        lastRelease: {
            name: undefined,
            tag: undefined
        }
    };

    $http.get('https://api.github.com/repos/lumapps/lumx/git/refs/heads/master').success(function(master)
    {
        $http.get(master.object.url).success(function(lastCommit)
        {
            $scope.repo.lastCommit.date = new Date(lastCommit.author.date);
            $scope.repo.lastCommit.sha = lastCommit.sha;
            $scope.repo.lastCommit.url = lastCommit.html_url;
        });
    });

    $http.get('https://api.github.com/repos/lumapps/lumx/releases').success(function(lastReleases)
    {
        var lastRelease = lastReleases[0] ? lastReleases[0] : lastReleases;
        $scope.repo.lastRelease.name = lastRelease.name;
        $scope.repo.lastRelease.tag = lastRelease.tag_name;
        $scope.repo.lastRelease.url = lastRelease.zipball_url;
    });

    $scope.people = [
        { name: 'Adam',      email: 'adam@email.com',      age: 10 },
        { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
        { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
        { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
        { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
        { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
        { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
        { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
    ];

    $scope.ajax = {
        selected: 'Inception',
        list: [],
        update: function(newFilter)
        {
            if (newFilter)
            {
                $scope.ajax.loading = true;
                $http.get('http://www.omdbapi.com/?s=' + escape(newFilter)).
                    success(function(data)
                    {
                        $scope.ajax.list = data.Search;
                        $scope.ajax.loading = false;
                    }).
                    error(function()
                    {
                        $scope.ajax.loading = false;
                    });
            }
            else
            {
                $scope.ajax.list = false;
            }
        },
        toModel: function(data, callback)
        {
            if (data)
            {
                callback(data.Title);
            }
            else
            {
                callback();
            }
        },
        toSelection: function(data, callback)
        {
            if (data)
            {
                $http.get('http://www.omdbapi.com/?s=' + escape(data)).
                    success(function(response)
                    {
                        callback(response.Search[0]);
                    }).
                    error(function()
                    {
                        callback();
                    });
            }
            else
            {
                callback();
            }
        },
        loading: false
    };

    $scope.cbSelect = {
        exec: function(newVal, oldVal)
        {
            LxNotificationService.notify('Change detected!');
            console.log('oldVal: ', oldVal);
            console.log('newVal: ', newVal);
        }
    };

    $scope.selects = {
        selectedPerson: undefined,
        selectedPersons: [$scope.people[2], $scope.people[4]]
    };

    $scope.tree = [
    {
        id: 1,
        children: [
        {
            id: 11,
            children: [{id: 111}]
        },
        {
            id: 12,
            children: [{id: 121}, {id: 122}]
        },
        {
            id: 13
        }]
    },
    {
        id: 2
    },
    {
        id: 3,
        children: [
        {
            id: 32,
            children: [{id: 321}, {id: 322}, {id: 323}]
        }]
    }];

    $scope.selectedTags = [$scope.people[1], $scope.people[2]];

    $scope.scrollbarHeight = 150;
    $scope.scrollbarContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus.';

    $scope.dropdownAlert = function()
    {
        LxNotificationService.info('Clicked!');
    };

    $scope.changeScrollbarHeight = function(height)
    {
        $scope.scrollbarHeight = height;
    };

    $scope.changeScrollbarContent = function(content)
    {
        $scope.scrollbarContent = content;
    };

    $scope.opendDialog = function(dialogId)
    {
        LxDialogService.open(dialogId);
    };

    $scope.closingDialog = function()
    {
        LxNotificationService.info('Dialog closed!');
    };

    $scope.showCircularProgress = function()
    {
        LxProgressService.circular.show('#5fa2db', '#progress');
    };

    $scope.hideCircularProgress = function()
    {
        LxProgressService.circular.hide();
    };

    $scope.showLinearProgress = function()
    {
        LxProgressService.linear.show('#5fa2db', '#progress');
    };

    $scope.hideLinearProgress = function()
    {
        LxProgressService.linear.hide();
    };

    $scope.searchFilter = {
        first: '',
        second: '',
        third: '',
        fourth: ''
    };

    $scope.textFields = {
        disabled: 'LumApps',
        firstName: 'Leeloo',
        lastName: '',
        firstEmail: 'bad-email',
        secondEmail: 'hello@lumapps.com',
        thirdEmail: 'hello@lumapps.com',
        description: '',
        disabledDark: 'LumApps',
        firstNameDark: 'Leeloo',
        lastNameDark: '',
        firstEmailDark: 'bad-email',
        secondEmailDark: 'hello@lumapps.com',
        thirdEmailDark: 'hello@lumapps.com',
        descriptionDark: ''
    };

    $scope.emailValidation = function(email)
    {
        return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(email);
    };

    $scope.$watch('searchFilter.first', function(newVal, oldVal)
    {
        console.log("Filter changed: '" + newVal + "' from '" + oldVal + "'");
    });

    $scope.datepicker = {
        date: new Date()
    };

    var tabIndex = 4;
    $scope.tabs = [
        { heading: 'Tab 1', content: 'Tab 1 content' },
        { heading: 'Tab 2', content: 'Tab 2 content' },
        { heading: 'Tab 3', content: 'Tab 3 content' }
    ];

    $scope.addTab = function()
    {
        $scope.tabs.push({ heading: 'Tab ' + tabIndex, content: 'Tab ' + tabIndex + ' content' });
        ++tabIndex;
    };

    $scope.removeFirstTab = function()
    {
        $scope.removeTab(0);
    };

    $scope.removeTab = function(idx)
    {
        if ($scope.tabs.length > idx)
        {
            $scope.tabs.splice(idx, 1);
        }
    };

    $scope.addPerson = function()
    {
        $scope.people.push({ name: 'Lorem', email: 'lorem@email.com', age: 99 })
    };
});
