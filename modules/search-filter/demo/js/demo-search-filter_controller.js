(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoSearchFilterController', DemoSearchFilterController);

    DemoSearchFilterController.$inject = ['$http', '$q', '$timeout'];

    function DemoSearchFilterController($http, $q, $timeout)
    {
        var vm = this;

        vm.autocomplete = autocomplete;

        vm.searchFilter = {
            first: undefined,
            second: undefined,
            third: undefined,
            fourth: undefined,
            fifth: undefined,
            sixth: undefined,
            autocomplete: undefined
        };

        ////////////

        function autocomplete(_newValue)
        {
            var deferred = $q.defer();

            $http.get('http://www.omdbapi.com/?s=' + escape(_newValue))
                .then(function updateSuccess(response)
                {
                    $timeout(function()
                    {
                        if (response.data && response.data.Search)
                        {
                            deferred.resolve(response.data.Search.map(function(object) { return object.Title; }));
                        }
                        else
                        {
                            deferred.resolve([]);
                        }
                    }, 1000);
                })
                .catch(function updateError()
                {
                    deferred.reject('Error');
                });

            return deferred.promise;
        }
    }
})();