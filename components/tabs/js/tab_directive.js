import template from '../views/tab.html';

/////////////////////////////

function TabController($scope, LxUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The parent controller.
     *
     * @type {Object}
     */
    let _parentController;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The current tab properties.
     *
     * @type {Object}
     */
    lx.tab = {};

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Check if the current tab is active.
     *
     * @return {boolean} Whether the current tab is active or not.
     */
    function isTabActive() {
        return _parentController.isTabActive(lx.tab.index);
    }

    /**
     * Register the tab to the parent controller at init.
     *
     * @param {Object} parentController The parent controller.
     * @param {number} tabIndex         The tab index.
     */
    function registerTab(parentController, tabIndex) {
        _parentController = parentController;

        lx.tab = {
            icon: lx.icon,
            index: tabIndex,
            label: lx.label,
            uuid: LxUtilsService.generateUUID(),
        };

        _parentController.addTab(lx.tab);
    }

    /////////////////////////////

    lx.isTabActive = isTabActive;
    lx.registerTab = registerTab;

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the current tab disabled state.
     *
     * @param {boolean} isDisabled Whether the tab is disabled or not.
     */
    $scope.$watch('lx.isDisabled', function isDisableddWatcher(isDisabled) {
        lx.tab.isDisabled = isDisabled;

        _parentController.updateTab(lx.tab);
    });

    /**
     * Remove the current tab on destroy.
     */
    $scope.$on('$destroy', () => {
        _parentController.removeTab(lx.tab);
    });
}

/////////////////////////////

function TabDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls) {
        ctrls[0].registerTab(ctrls[1], el.index());
    }

    return {
        bindToController: true,
        controller: TabController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxTab', '^lxTabs'],
        restrict: 'E',
        scope: {
            icon: '@?lxIcon',
            isDisabled: '=?ngDisabled',
            label: '@?lxLabel',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.tabs').directive('lxTab', TabDirective);

/////////////////////////////

export { TabDirective };
