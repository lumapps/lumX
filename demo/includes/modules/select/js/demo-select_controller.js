(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoSelectController', DemoSelectController);

    DemoSelectController.$inject = ['$http', '$scope', '$timeout', 'LxNotificationService'];

    function DemoSelectController($http, $scope, $timeout, LxNotificationService)
    {
        var vm = this;

        vm.callApi = callApi;
        vm.selectCallback = selectCallback;

        vm.selectAjax = {
            selected: 'Darth Vader',
            list: [],
            update: function(newFilter)
            {
                if (newFilter)
                {
                    vm.selectAjax.loading = true;

                    $http.get('https://swapi.co/api/people/?search=' + escape(newFilter))
                        .then(function updateSuccess(response)
                        {
                            if (response.data && response.data.results)
                            {
                                vm.selectAjax.list = response.data.results;
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
                    callback(data.name);
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
                    $http.get('https://swapi.co/api/people/?search=' + escape(data))
                        .then(function toSelectionSuccess(response)
                        {
                            if (response.data && response.data.results)
                            {
                                callback(response.data.results[0]);
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
        },
        {
            name: 'David',
            email: 'david@email.com',
            age: 42
        },
        {
            name: 'Julia',
            email: 'julia@email.com',
            age: 35
        },
        {
            name: 'Ahmed',
            email: 'ahmed@email.com',
            age: 31
        },
        {
            name: 'Sofia',
            email: 'sofia@email.com',
            age: 23
        },
        {
            name: 'Corinne',
            email: 'corinne@email.com',
            age: 54
        },
        {
            name: 'Nicolas',
            email: 'nicolas@email.com',
            age: 32
        },
        {
            name: 'Henry',
            email: 'henry@email.com',
            age: 18
        },
        {
            name: 'Carol',
            email: 'carol@email.com',
            age: 45
        },
        {
            name: 'Stephan',
            email: 'stephan@email.com',
            age: 36
        },
        {
            name: 'Elizabeth',
            email: 'elizabeth@email.com',
            age: 92
        },
        {
            name: 'François',
            email: 'francois@email.com',
            age: 45
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
        vm.selectPeopleMultipane = {
            '<i class="mdi mdi-human-male"></i> <span>Male humans</span>': {
                'Old': [
                    {
                        uid: '1',
                        name: 'Adam'
                    },
                    {
                        uid: '2',
                        name: 'Tom'
                    },
                    {
                        uid: '3',
                        name: 'Ben'
                    }
                ],
                'Middle aged': [
                    {
                        uid: '4',
                        name: 'Franck'
                    }
                ],
                'Young': [
                    {
                        uid: '5',
                        name: 'Wladimir'
                    },
                    {
                        uid: '6',
                        name: 'Jack'
                    }
                ],
            },
            '<i class="mdi mdi-human-female"></i> <span>Female</span>': {
                'France': {
                    'Old': [
                        {
                            uid: '7',
                            name: 'Sue Helen'
                        }
                    ],
                    'Middle aged': {
                        'Lorem': [
                            {
                                uid: '8',
                                name: 'Samantha'
                            },
                            {
                                uid: '9',
                                name: 'Estefanía'
                            },
                            {
                                uid: '10',
                                name: 'Natasha'
                            },
                            {
                                uid: '11',
                                name: 'Nicole'
                            },
                            {
                                uid: '12',
                                name: 'Kathy'
                            },
                            {
                                uid: '13',
                                name: 'Robin'
                            },
                            {
                                uid: '14',
                                name: 'Jessica'
                            },
                            {
                                uid: '15',
                                name: 'Reagan'
                            },
                            {
                                uid: '16',
                                name: 'Ariel'
                            },
                            {
                                uid: '17',
                                name: 'Krista'
                            },
                            {
                                uid: '18',
                                name: 'Lillie'
                            },
                            {
                                uid: '19',
                                name: 'Brittany'
                            },
                            {
                                uid: '20',
                                name: 'Tiffany'
                            },
                            {
                                uid: '21',
                                name: 'Alexa'
                            },
                            {
                                uid: '22',
                                name: 'Alison'
                            },
                            {
                                uid: '23',
                                name: 'Karen'
                            }
                        ],
                        'Ipsum': [
                            {
                                uid: '16',
                                name: 'Julia'
                            },
                            {
                                uid: '17',
                                name: 'Sofia'
                            }
                        ],
                    },
                    'Young': [
                        {
                            uid: '18',
                            name: 'Karin'
                        },
                        {
                            uid: '19',
                            name: 'Camillia'
                        }
                    ],
                },
                'US': [
                    {
                        uid: '16',
                        name: 'Katerin'
                    },
                    {
                        uid: '17',
                        name: 'Olga'
                    }
                ],
            }
        };
        vm.newValueTransformer = function(_newValue) {
            return {
                name: _newValue,
                type: 'Unknown'
            };
        };
        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
            selectedPeopleMax: [vm.selectPeople[3], vm.selectPeople[5]],
            selectedPeopleSections: [],
            selectedPeopleMultipane: undefined,
            selectedPeopleMultipaneMultiple: [],
            selectedVegetables: []
        };
        vm.multipaneLoading = true;
        vm.loadingInfiniteScroll = false;
        vm.pageInfiniteScroll = 0;

        $scope.$on('lx-dropdown__open-end', function onDropdownOpenEnd() {
            $timeout(function delayEndLoading() {
                vm.multipaneLoading = false;
            }, 1500);
        });

        ////////////

        function selectCallback(_newValue, _oldValue)
        {
            LxNotificationService.notify('Change detected');

            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }

        /**
         * Call sample API.
         *
         * @return {Promise} Promise containing an array of users.
         */
        function callApi() {
            vm.pageInfiniteScroll++;
            vm.loadingInfiniteScroll = true;

            return $http
                .get(
                    'https://randomuser.me/api/?results=10&seed=lumapps&page=' + vm.pageInfiniteScroll
                )
                .then(function(response) {
                    if (response.data && response.data.results) {
                        return response.data.results.map(function(person) {
                            return {
                                name: person.name.first,
                                email: person.email,
                                age: person.dob.age
                            };
                        });
                    } else {
                        return [];
                    }
                })
                .catch(function() {
                    return [];
                })
                .finally(function() {
                    vm.loadingInfiniteScroll = false;
                });
        }
    }
})();
