function DemoDialogController($scope, LxDialogService, LxNotificationService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The ids of the dialogs.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
    vm.dialogIds = [
        'default-dialog',
        'tiny-dialog',
        'regular-dialog',
        'big-dialog',
        'huge-dialog',
        'scroll-dialog',
        'action-dialog',
    ];

    /**
     * The ids of the source buttons.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
    vm.sourceIds = [
        'default-dialog-source',
        'tiny-dialog-source',
        'regular-dialog-source',
        'big-dialog-source',
        'huge-dialog-source',
        'scroll-dialog-source',
        'action-dialog-source',
    ];

    /**
     * The list of people to display in the dialog.
     *
     * @type {Array<Object>}
     * @constant
     * @readonly
     */
    vm.people = [
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

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Add a person to the list.
     */
    function addPerson() {
        vm.people.push({
            // eslint-disable-next-line no-magic-numbers
            age: 99,
            email: 'lorem@email.com',
            name: 'Lorem',
        });
    }

    /**
     * Display an alert dialog.
     */
    function alertDialog() {
        LxDialogService.alert({
            cb: function onAnswer() {
                LxNotificationService.info('Alert callback');
            },
            buttons: {
                ok: 'Agree',
            },
            source: '#alert-dialog-source',
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
            title: 'Lorem Ipsum',
        });
    }

    /**
     * Display a confirm dialog.
     */
    function confirmDialog() {
        LxDialogService.confirm({
            cb: function onAnswer(answer) {
                if (answer) {
                    LxNotificationService.success('Agree');
                } else {
                    LxNotificationService.error('Disagree');
                }
            },
            buttons: {
                cancel: 'Disagree',
                ok: 'Agree',
            },
            source: '#confirm-dialog-source',
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
            title: 'Lorem Ipsum',
        });
    }

    /**
     * Open the dialog.
     *
     * @param {string} id     The id of the dialog.
     * @param {string} source The id of the button.
     */
    function openDialog(id, source) {
        LxDialogService.open(id, {
            source: `#${source}`,
        });
    }

    /////////////////////////////

    vm.addPerson = addPerson;
    vm.alertDialog = alertDialog;
    vm.confirmDialog = confirmDialog;
    vm.openDialog = openDialog;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * When the dialog starts to open, log a message in the console.
     *
     * @param {Event}  evt      The dialog open start event.
     * @param {string} dialogId The id of the dialog that is starting to open.
     */
    $scope.$on('lx-dialog__open-start', (evt, dialogId) => {
        if (vm.dialogIds.includes(dialogId)) {
            // eslint-disable-next-line no-console
            console.log('Open start');
        }
    });

    /**
     * When the dialog has opened, log a message in the console.
     *
     * @param {Event}  evt      The dialog open end event.
     * @param {string} dialogId The id of the dialog that has opened.
     */
    $scope.$on('lx-dialog__open-end', (evt, dialogId) => {
        if (vm.dialogIds.includes(dialogId)) {
            // eslint-disable-next-line no-console
            console.log('Open end');
        }
    });

    /**
     * When the dialog starts to close, log a message in the console.
     *
     * @param {Event}  evt      The dialog close start event.
     * @param {string} dialogId The id of the dialog that is starting to close.
     */
    $scope.$on('lx-dialog__close-start', (evt, dialogId) => {
        if (vm.dialogIds.includes(dialogId)) {
            // eslint-disable-next-line no-console
            console.log('Close start');
        }
    });

    /**
     * When the dialog has closed, log a message in the console.
     *
     * @param {Event}  evt      The dialog close end event.
     * @param {string} dialogId The id of the dialog that has closed.
     */
    $scope.$on('lx-dialog__close-end', (evt, dialogId) => {
        if (vm.dialogIds.includes(dialogId)) {
            // eslint-disable-next-line no-console
            console.log('Close end');
        }
    });

    /**
     * When the user scrolls to the end of the dialog, log a message in the console.
     *
     * @param {Event}  evt      The dialog scroll end event.
     * @param {string} dialogId The id of the dialog that has been scrolled to the end.
     */
    $scope.$on('lx-dialog__scroll-end', (evt, dialogId) => {
        if (vm.dialogIds.includes(dialogId)) {
            // eslint-disable-next-line no-console
            console.log('Scroll end');
        }
    });
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoDialogController', DemoDialogController);

/////////////////////////////

export { DemoDialogController };
