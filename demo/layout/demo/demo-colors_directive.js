import template from './demo-colors.html';

/////////////////////////////

function DemoColorsController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const demoColors = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get hue style.
     *
     * @param  {string} key The hue key.
     * @param  {Object} hue The hue font color, hexadecimal code and opacity.
     * @return {Array}  The hue classes.
     */
    function getHueStyle(key, hue) {
        const classes = [];

        classes.push(`lumx-theme-background-${demoColors.color}-${key}`);
        classes.push(`lumx-theme-color-${hue.fontColor}-N`);

        return classes;
    }

    /////////////////////////////

    demoColors.getHueStyle = getHueStyle;
}

/////////////////////////////

function DemoColorsDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: DemoColorsController,
        controllerAs: 'demoColors',
        replace: true,
        restrict: 'E',
        scope: {
            color: '@',
            colors: '=',
            theme: '@',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx-demo').directive('demoColors', DemoColorsDirective);

/////////////////////////////

export { DemoColorsDirective };
