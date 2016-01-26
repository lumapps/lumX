(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoTextFieldController', DemoTextFieldController);

    function DemoTextFieldController()
    {
        var vm = this;

        vm.emailValidation = emailValidation;

        vm.textFields = {
            floating:
            {
                company: 'LumApps',
                firstName: 'Matthias',
                lastName: 'Manoukian'
            },
            fixed:
            {
                name: 'Matthias Manoukian',
                phone: '03 45 68 93 20',
                email: 'hello@lumapps.com',
                location: 'Tassin-la-Demi-Lune',
                emptyName: undefined,
                emptyPhone: undefined,
                emptyEmail: undefined,
                emptyLocation: undefined
            },
            textarea:
            {
                description: undefined
            },
            states:
            {
                company: 'LumApps',
                email: 'hello@lumapps.com',
                invalidEmail: 'invalid-email',
                repeatedEmail: 'hello@lumapps.com'
            },
            theme:
            {
                company: 'LumApps',
                name: 'Matthias Manoukian',
                phone: '03 45 68 93 20'
            }
        };

        ////////////

        function emailValidation(_email)
        {
            return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(_email);
        }
    }
})();