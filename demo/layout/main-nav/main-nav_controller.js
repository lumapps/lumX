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
            label: 'Foundations',
            state: 'app.foundations',
            isOpen: $state.includes('app.foundations'),
            children: [
                {
                    label: 'Colors',
                    state: 'app.foundations.colors',
                },
                {
                    label: 'Typography',
                    state: 'app.foundations.typography',
                },
            ],
        },
        {
            label: 'Components',
            state: 'app.components',
            isOpen: $state.includes('app.components'),
            children: [
                {
                    label: 'Avatar',
                    state: 'app.components.avatar',
                },
                {
                    label: 'Button',
                    state: 'app.components.button',
                },
                {
                    label: 'Checkbox',
                    state: 'app.components.checkbox',
                },
                {
                    label: 'Chip',
                    state: 'app.components.chip',
                },
                {
                    label: 'Comment block',
                    state: 'app.components.comment-block',
                },
                {
                    label: 'Dialog',
                    state: 'app.components.dialog',
                },
                {
                    label: 'Dropdown',
                    state: 'app.components.dropdown',
                },
                {
                    label: 'Editable media',
                    state: 'app.components.editable-media',
                },
                {
                    label: 'Expansion panel',
                    state: 'app.components.expansion-panel',
                },
                {
                    label: 'Grid',
                    state: 'app.components.grid',
                },
                {
                    label: 'Image block',
                    state: 'app.components.image-block',
                },
                {
                    label: 'Lightbox',
                    state: 'app.components.lightbox',
                },
                {
                    label: 'List',
                    state: 'app.components.list',
                },
                {
                    label: 'Notification',
                    state: 'app.components.notification',
                },
                {
                    label: 'Popover',
                    state: 'app.components.popover',
                },
                {
                    label: 'Post block',
                    state: 'app.components.post-block',
                },
                {
                    label: 'Progress',
                    state: 'app.components.progress',
                },
                {
                    label: 'Progress tracker',
                    state: 'app.components.progress-tracker',
                },
                {
                    label: 'Radio button',
                    state: 'app.components.radio-button',
                },
                {
                    label: 'Select',
                    state: 'app.components.select',
                },
                {
                    label: 'Side navigation',
                    state: 'app.components.side-navigation',
                },
                {
                    label: 'Slideshow',
                    state: 'app.components.slideshow',
                },
                {
                    label: 'Switch',
                    state: 'app.components.switch',
                },
                {
                    label: 'Table',
                    state: 'app.components.table',
                },
                {
                    label: 'Tabs',
                    state: 'app.components.tabs',
                },
                {
                    label: 'Text field',
                    state: 'app.components.text-field',
                },
                {
                    label: 'Thumbnail',
                    state: 'app.components.thumbnail',
                },
                {
                    label: 'Toolbar',
                    state: 'app.components.toolbar',
                },
                {
                    label: 'Tooltip',
                    state: 'app.components.tooltip',
                },
                {
                    label: 'User block',
                    state: 'app.components.user-block',
                },
            ],
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
