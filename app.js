/* global angular */
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
        when('/css/colors', {
            templateUrl: '/demo/includes/css/colors.html'
        }).
        when('/css/buttons', {
            templateUrl: '/demo/includes/css/button.html'
        }).
        when('/css/icons', {
            templateUrl: '/demo/includes/css/icon.html'
        }).
        when('/css/lists', {
            templateUrl: '/demo/includes/css/list.html'
        }).
        when('/css/cards', {
            templateUrl: '/demo/includes/css/card.html'
        }).
        when('/css/checkboxes', {
            templateUrl: '/demo/includes/css/checkbox.html'
        }).
        when('/css/radio-buttons', {
            templateUrl: '/demo/includes/css/radio-button.html'
        }).
        when('/css/switches', {
            templateUrl: '/demo/includes/css/switch.html'
        }).
        when('/css/toolbars', {
            templateUrl: '/demo/includes/css/toolbar.html'
        }).
        when('/directives/fab', {
            templateUrl: '/demo/includes/directives/fab.html'
        }).
        when('/directives/dropdowns', {
            templateUrl: '/demo/includes/directives/dropdown.html'
        }).
        when('/directives/file-inputs', {
            templateUrl: '/demo/includes/directives/file-input.html'
        }).
        when('/directives/tabs', {
            templateUrl: '/demo/includes/directives/tabs.html'
        }).
        when('/directives/text-fields', {
            templateUrl: '/demo/includes/directives/text-field.html'
        }).
        when('/directives/search-filter', {
            templateUrl: '/demo/includes/directives/search-filter.html'
        }).
        when('/directives/selects', {
            templateUrl: '/demo/includes/directives/select.html'
        }).
        when('/directives/tooltips', {
            templateUrl: '/demo/includes/directives/tooltip.html'
        }).
        when('/directives/dialogs', {
            templateUrl: '/demo/includes/directives/dialog.html'
        }).
        when('/directives/thumbnails', {
            templateUrl: '/demo/includes/directives/thumbnail.html'
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

    $scope.cbSelect = {
        exec: function(){
            LxNotificationService.notify('Change detected!');
        }
    };

    $scope.selectedPerson = [];
    $scope.selectedPersons = [$scope.people[2], $scope.people[4]];

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

    $scope.showCircularProgress = function()
    {
        LxProgressService.circular.show('#5fa2db', '#fff', '#progress');
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
});
