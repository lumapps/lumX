(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoSearchFilterController', DemoSearchFilterController);

    DemoSearchFilterController.$inject = ['$http', '$timeout', 'LxNotificationService'];

    function DemoSearchFilterController($http, $timeout, LxNotificationService)
    {
        var vm = this;

        vm.autocomplete = autocomplete;
        vm.displaySelectedValue = displaySelectedValue;

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
                $http.get('https://swapi.co/api/people/?search=' + escape(_newValue))
                    .then(function updateSuccess(response)
                    {
                        $timeout(function()
                        {
                            var items = [];

                            vm.autocompleteIcon = undefined;

                            if (response.data && response.data.results)
                            {
                                items = response.data.results.map(function(object) { return object.name; });
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

                _cb(['History 1', 'History 2',  'History 3']);
            }
        }

        function displaySelectedValue(_value)
        {
            LxNotificationService.info('You selected: ' + _value);
        }
    }
})();