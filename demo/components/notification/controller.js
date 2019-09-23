function DemoNotificationController(LxNotificationService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Display a notification.
     *
     * @param {string} type The type of notification to display.
     *                      Possible values are: 'info', 'success', 'warning' or 'error'.
     */
    function notify(type) {
        if (type === 'info') {
            LxNotificationService.info('Lorem Ipsum', 'Undo', () => {
                LxNotificationService.success('Callback');
            });
        } else if (type === 'success') {
            LxNotificationService.success('Lorem Ipsum');
        } else if (type === 'warning') {
            LxNotificationService.warning('Lorem Ipsum');
        } else if (type === 'error') {
            LxNotificationService.error('Lorem Ipsum');
        }
    }

    /////////////////////////////

    vm.notify = notify;
}

/////////////////////////////

angular.module('lumx-demo').controller('DemoNotificationController', DemoNotificationController);

/////////////////////////////

export { DemoNotificationController };
