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
                        .then(function updateSuccess(response)
                        {
                            if (response.data)
                            {
                                vm.selectAjax.list = response.data.Search;
                            }
                            vm.selectAjax.loading = false;
                        })
                        .catch(function updateError()
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
                        .then(function toSelectionSuccess(response)
                        {
                            if (response.data)
                            {
                                callback(response.data.Search[0]);
                            }
                        })
                        .catch(function toSelectionError()
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
        vm.selectVegetables = [
            {
                name: 'Broccoli',
                type: 'Brassica'
            },
            {
                name: 'Cabbage',
                type: 'Brassica'
            },
            {
                name: 'Carrot',
                type: 'Umbelliferous'
            }
        ];
        vm.newValueTransformer = function(_newValue) {
            return {
                name: _newValue,
                type: 'Unknown'
            };
        };
        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
            selectedPeopleSections: [],
            selectedVegetables: []
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
