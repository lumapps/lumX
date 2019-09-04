function DemoSelectController($http) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The configuration for the "Ajax" select demo.
     *
     * @type {Object}
     */
    vm.selectAjax = {
        list: [],
        loading: false,
        selected: ['Bossk', 'Boba Fett'],
        toModel(person, cb) {
            if (person) {
                cb(person.name);
            } else {
                cb();
            }
        },
        toSelection(personName, cb) {
            if (personName) {
                $http
                    .get(`https://swapi.co/api/people/?search=${escape(personName)}`)
                    .then(function toSelectionSuccess(response) {
                        if (response.data && response.data.results) {
                            cb(response.data.results[0]);
                        }
                    })
                    .catch(function toSelectionError() {
                        cb();
                    });
            } else {
                cb();
            }
        },
        update(newFilter) {
            if (newFilter) {
                vm.selectAjax.loading = true;

                $http
                    .get(`https://swapi.co/api/people/?search=${escape(newFilter)}`)
                    .then((response) => {
                        if (response.data && response.data.results) {
                            vm.selectAjax.list = response.data.results;
                        }
                    })
                    .finally(() => {
                        vm.selectAjax.loading = false;
                    });
            } else {
                vm.selectAjax.list = false;
            }
        },
    };

    /**
     * The list of person to display in the "People" select.
     *
     * @type {Array<Object>}
     * @constant
     * @readonly
     */
    vm.selectPeople = [
        {
            // eslint-disable-next-line no-magic-numbers
            age: 10,
            email: 'adam@email.com',
            name: 'Adam',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 12,
            email: 'amalie@email.com',
            name: 'Amalie',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 30,
            email: 'wladimir@email.com',
            name: 'Wladimir',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 31,
            email: 'samantha@email.com',
            name: 'Samantha',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 16,
            email: 'estefanía@email.com',
            name: 'Estefanía',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 54,
            email: 'natasha@email.com',
            name: 'Natasha',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 43,
            email: 'nicole@email.com',
            name: 'Nicole',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 21,
            email: 'adrian@email.com',
            name: 'Adrian',
        },
    ];

    /**
     * The models of some select in the demo page.
     *
     * @type {Object}
     */
    vm.selectModel = {
        selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
        selectedPerson: undefined,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * The callback to execute when a value has been selected in the "Ajax" select.
     */
    function selectCallback() {
        // eslint-disable-next-line no-console
        console.log('New value: ', vm.selectAjax.selected);
    }

    /////////////////////////////

    vm.selectCallback = selectCallback;

    /////////////////////////////

    /**
     * Initialize the controller.
     */
    function init() {
        $http.get('https://swapi.co/api/people/?search=bo').then((response) => {
            if (response.data && response.data.results) {
                vm.selectAjax.list = response.data.results;
            }
        });
    }

    init();
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoSelectController', DemoSelectController);

/////////////////////////////

export { DemoSelectController };
