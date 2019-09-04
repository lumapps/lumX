import { mdiCodeTags } from '@lumx/icons';

import template from './demo-block.html';

/////////////////////////////

function DemoBlockController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const demoBlock = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The component category.
     *
     * @type {string}
     */
    demoBlock.category = 'components';

    /**
     * The component name.
     *
     * @type {string}
     */
    demoBlock.component = undefined;

    /**
     * Wether to display the component in dark theme or not.
     *
     * @type {boolean}
     */
    demoBlock.hasDarkTheme = false;

    /**
     * Wheter the block displays a theme switcher or not.
     *
     * @type {boolean}
     */
    demoBlock.hasThemeSwitcher = true;

    /**
     * The main block icons.
     *
     * @type {Object}
     */
    demoBlock.icons = {
        mdiCodeTags,
    };

    /**
     * Wheter the code view is open or not.
     *
     * @type {boolean}
     */
    demoBlock.isCodeOpen = false;

    /**
     * The component partial to display.
     *
     * @type {string}
     */
    demoBlock.partial = undefined;

    /**
     * The component theme.
     *
     * @type {string}
     */
    demoBlock.theme = 'light';

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Toggle code visibility.
     */
    function toggleCode() {
        demoBlock.isCodeOpen = !demoBlock.isCodeOpen;
    }

    /**
     * Toggle component theme from light to dark and so on.
     */
    function toggleTheme() {
        if (demoBlock.hasDarkTheme) {
            demoBlock.theme = 'dark';
        } else {
            demoBlock.theme = 'light';
        }
    }

    /////////////////////////////

    demoBlock.toggleCode = toggleCode;
    demoBlock.toggleTheme = toggleTheme;
}

/////////////////////////////

function DemoBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        attrs.$observe('category', (category) => {
            ctrl.category = category;
        });

        attrs.$observe('component', (component) => {
            ctrl.component = component;
        });

        attrs.$observe('partial', (partial) => {
            ctrl.partial = partial;
        });

        attrs.$observe('hasThemeSwitcher', (hasThemeSwitcher) => {
            ctrl.hasThemeSwitcher = scope.$eval(hasThemeSwitcher);
        });
    }

    return {
        bindToController: true,
        controller: DemoBlockController,
        controllerAs: 'demoBlock',
        link,
        replace: true,
        restrict: 'E',
        scope: true,
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx-demo').directive('demoBlock', DemoBlockDirective);

/////////////////////////////

export { DemoBlockDirective };
