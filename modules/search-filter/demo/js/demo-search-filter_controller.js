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

        function autocomplete(_newValue, _cb, _errCb)
        {
            if (_newValue)
            {
                $http.get('http://www.omdbapi.com/?s=' + escape(_newValue))
                    .then(function updateSuccess(response)
                    {
                        $timeout(function()
                        {
                            var items = [];

                            vm.autocompleteIcon = undefined;

                            if (response.data && response.data.Search)
                            {
                                items = response.data.Search.map(function(object) { return object.Title; });
                            }

                            _cb(items);
                        }, 1000);
                    })
                    .catch(function updateError()
                    {
                        _errCb('Error');
                    });
            }
            else
            {
                vm.autocompleteIcon = 'clock';

                _cb(['History 1', 'History 2',  'History 3'])
            }
        }
    }
})();