/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.progress', [])
    .directive('lxProgress', function()
    {
        return {
            restrict: 'A',
            link: function(scope, element)
            {
                element.find('.progress-circular__mask1')
                        .css({ transform: 'rotate(-10deg)' });

                element.find('.progress-circular__mask2')
                        .css({ transform: 'rotate(10deg)' });

                function animate() {
                    element.find('.progress-circular__mask1')
                        .transition({ rotate: '+=250deg', delay: 1000, queue: false }, 1000, 'easeInOutQuint', function() { animate(); });

                    element.find('.progress-circular__mask2')
                        .transition({ rotate: '+=250deg', queue: false }, 1000, 'easeInOutQuint');

                    element.find('.progress-circular__mask3-spin')
                        .transition({ rotate: '+=125deg' }, 1000, 'easeInOutQuint')
                        .transition({ rotate: '+=125deg' }, 1000, 'easeInOutQuint');

                    element.find('.progress-circular__mask3-translate')
                        .transition({ y: '25px' }, 1000, 'easeInOutQuint')
                        .transition({ y: '0' }, 1000, 'easeInOutQuint');
                }

                animate();
            }
        };
    });