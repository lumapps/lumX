function MainNavController($state) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The states.
     *
     * @type {Array<Object>}
     * @constant
     */
    vm.STATES = [
        {
            label: 'Product',
            state: 'app.product',
            isOpen: $state.includes('app.product'),
            children: [
                {
                    label: 'Foundations',
                    state: 'app.product.foundations',
                    isOpen: $state.includes('app.product.foundations'),
                    children: [
                        {
                            label: 'Colors',
                            state: 'app.product.foundations.colors',
                        },
                        {
                            label: 'Typography',
                            state: 'app.product.foundations.typography',
                        },
                    ],
                },
                {
                    label: 'Components',
                    state: 'app.product.components',
                    isOpen: $state.includes('app.product.components'),
                    children: [
                        {
                            label: 'Avatar',
                            state: 'app.product.components.avatar',
                        },
                        {
                            label: 'Button',
                            state: 'app.product.components.button',
                        },
                        {
                            label: 'Checkbox',
                            state: 'app.product.components.checkbox',
                        },
                        {
                            label: 'Chip',
                            state: 'app.product.components.chip',
                        },
                        {
                            label: 'Comment block',
                            state: 'app.product.components.comment-block',
                        },
                        {
                            label: 'Dialog',
                            state: 'app.product.components.dialog',
                        },
                        {
                            label: 'Dropdown',
                            state: 'app.product.components.dropdown',
                        },
                        {
                            label: 'Editable media',
                            state: 'app.product.components.editable-media',
                        },
                        {
                            label: 'Expansion panel',
                            state: 'app.product.components.expansion-panel',
                        },
                        {
                            label: 'Grid',
                            state: 'app.product.components.grid',
                        },
                        {
                            label: 'Image block',
                            state: 'app.product.components.image-block',
                        },
                        {
                            label: 'Lightbox',
                            state: 'app.product.components.lightbox',
                        },
                        {
                            label: 'List',
                            state: 'app.product.components.list',
                        },
                        {
                            label: 'Notification',
                            state: 'app.product.components.notification',
                        },
                        {
                            label: 'Popover',
                            state: 'app.product.components.popover',
                        },
                        {
                            label: 'Post block',
                            state: 'app.product.components.post-block',
                        },
                        {
                            label: 'Progress',
                            state: 'app.product.components.progress',
                        },
                        {
                            label: 'Progress tracker',
                            state: 'app.product.components.progress-tracker',
                        },
                        {
                            label: 'Radio button',
                            state: 'app.product.components.radio-button',
                        },
                        {
                            label: 'Select',
                            state: 'app.product.components.select',
                        },
                        {
                            label: 'Side navigation',
                            state: 'app.product.components.side-navigation',
                        },
                        {
                            label: 'Slideshow',
                            state: 'app.product.components.slideshow',
                        },
                        {
                            label: 'Switch',
                            state: 'app.product.components.switch',
                        },
                        {
                            label: 'Table',
                            state: 'app.product.components.table',
                        },
                        {
                            label: 'Tabs',
                            state: 'app.product.components.tabs',
                        },
                        {
                            label: 'Text field',
                            state: 'app.product.components.text-field',
                        },
                        {
                            label: 'Thumbnail',
                            state: 'app.product.components.thumbnail',
                        },
                        {
                            label: 'Toolbar',
                            state: 'app.product.components.toolbar',
                        },
                        {
                            label: 'Tooltip',
                            state: 'app.product.components.tooltip',
                        },
                        {
                            label: 'User block',
                            state: 'app.product.components.user-block',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Brand',
            state: 'app.brand',
            isOpen: $state.includes('app.brand'),
        },
        {
            label: 'Partners',
            state: 'app.partners',
            isOpen: $state.includes('app.partners'),
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Go to state.
     *
     * @param {string} state The angular UI router state.
     */
    function goTo(state) {
        $state.go(state);
    }

    /**
     * Whether the given state equals the current state or not.
     *
     * @param  {string}  state The angular UI router state.
     * @return {boolean} Whether the given state equals the current state or not.
     */
    function isCurrent(state) {
        return $state.is(state);
    }

    /////////////////////////////

    vm.goTo = goTo;
    vm.isCurrent = isCurrent;
}

/////////////////////////////

angular.module('lumx-demo').controller('MainNavController', MainNavController);

/////////////////////////////

export { MainNavController };
