(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoSelectController', DemoSelectController);

    DemoSelectController.$inject = ['$http', 'LxNotificationService'];

    function DemoSelectController($http, LxNotificationService)
    {
        var vm = this;

        vm.selectCallback = selectCallback;

        vm.selectAjax = {
            selected: 'Inception',
            list: [],
            update: function(newFilter)
            {
                if (newFilter)
                {
                    vm.selectAjax.loading = true;

                    $http.get('http://www.omdbapi.com/?s=' + escape(newFilter))
                        .success(function(data)
                        {
                            vm.selectAjax.list = data.Search;
                            vm.selectAjax.loading = false;
                        })
                        .error(function()
                        {
                            vm.selectAjax.loading = false;
                        });
                }
                else
                {
                    vm.selectAjax.list = false;
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
                    $http.get('http://www.omdbapi.com/?s=' + escape(data))
                        .success(function(response)
                        {
                            callback(response.Search[0]);
                        })
                        .error(function()
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
        vm.selectPeople = [
        {
            name: 'Adam',
            email: 'adam@email.com',
            age: 10
        },
        {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12
        },
        {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30
        },
        {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 31
        },
        {
            name: 'Estefanía',
            email: 'estefanía@email.com',
            age: 16
        },
        {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54
        },
        {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43
        },
        {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21
        }];
        vm.selectSections = {
            '<i class="mdi mdi-account"></i> <span>Sub header 1</span>': [
            {
                uid: '1',
                name: 'Adam'
            },
            {
                uid: '2',
                name: 'Amalie'
            },
            {
                uid: '3',
                name: 'Wladimir'
            },
            {
                uid: '4',
                name: 'Samantha'
            }],
            '<i class="mdi mdi-account"></i> <span>Sub header 2</span>': [
            {
                uid: '5',
                name: 'Estefanía'
            },
            {
                uid: '6',
                name: 'Natasha'
            },
            {
                uid: '7',
                name: 'Nicole'
            }]
        };
        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
            selectedPeopleSections: []
        };

        ////////////

        function selectCallback(_newValue, _oldValue)
        {
            LxNotificationService.notify('Change detected');

            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }
    }
})();