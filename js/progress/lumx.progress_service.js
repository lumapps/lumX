/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.progress', [])
    .service('LxProgressService', ['$timeout', '$interval', function($timeout, $interval)
    {
        var progressCircularIsShown = false,
            progressCircularInterval,
            progressCircular,
            progressCircularBackground,
            progressCircularMask1,
            progressCircularMask2,
            progressCircularMask3,
            progressCircularMask3Translate,
            progressCircularCenter,
            progressLinearIsShown = false,
            progressLinear,
            progressLinearBackground,
            progressLinearFirstBar,
            progressLinearSecondBar;

        function init()
        {
            // Circular
            progressCircular = angular.element('<div/>', { class: 'progress-circular' });
            progressCircularBackground = angular.element('<div/>', { class: 'progress-circular__background' });
            progressCircularMask1 = angular.element('<div/>', { class: 'progress-circular__mask1' });
            progressCircularMask2 = angular.element('<div/>', { class: 'progress-circular__mask2' });
            progressCircularMask3 = angular.element('<div/>', { class: 'progress-circular__mask3' });
            progressCircularMask3Translate = angular.element('<div/>', { class: 'progress-circular__mask3-translate' });
            progressCircularCenter = angular.element('<div/>', { class: 'progress-circular__center' });

            progressCircularMask3.append(progressCircularMask3Translate);

            progressCircular
                .append(progressCircularBackground)
                .append(progressCircularMask1)
                .append(progressCircularMask2)
                .append(progressCircularMask3)
                .append(progressCircularCenter);

            // Linear
            progressLinear = angular.element('<div/>', { class: 'progress-linear' });
            progressLinearBackground = angular.element('<div/>', { class: 'progress-linear__background' });
            progressLinearFirstBar = angular.element('<div/>', { class: 'progress-linear__bar progress-linear__bar--first' });
            progressLinearSecondBar = angular.element('<div/>', { class: 'progress-linear__bar progress-linear__bar--second' });

            progressLinear
                .append(progressLinearBackground)
                .append(progressLinearFirstBar)
                .append(progressLinearSecondBar);
        }

        function showCircular(foreground, background, container)
        {
            if (!progressCircularIsShown)
            {
                showCircularProgress(foreground, background, container);
            }
        }

        function hideCircular()
        {
            if (progressCircularIsShown)
            {
                hideCircularProgress();
            }
        }

        function showCircularProgress(foreground, background, container)
        {
            progressCircularIsShown = true;

            progressCircularBackground.css({ backgroundColor: foreground });
            progressCircularMask1.removeAttr('style').css({ backgroundColor: background });
            progressCircularMask2.removeAttr('style').css({ backgroundColor: background });
            progressCircularMask3.removeAttr('style');
            progressCircularMask3Translate.removeAttr('style').css({ backgroundColor: background });
            progressCircularCenter.css({ backgroundColor: background });

            progressCircularMask1.css({ transform: 'rotate(-10deg)' });
            progressCircularMask2.css({ transform: 'rotate(10deg)' });

            if (angular.isDefined(container))
            {
                progressCircular.appendTo(container);
            }
            else
            {
                progressCircular.appendTo('body');
            }

            $timeout(function()
            {
                progressCircular.addClass('progress-circular--is-shown');

                animateCircularProgress();

                progressCircularInterval = $interval(animateCircularProgress, 2000);
            });
        }

        function hideCircularProgress()
        {
            progressCircular.removeClass('progress-circular--is-shown');

            $timeout(function()
            {
                progressCircularMask1.transitionStop();
                progressCircularMask2.transitionStop();
                progressCircularMask3.transitionStop();
                progressCircularMask3Translate.transitionStop();

                progressCircular.remove();

                progressCircularIsShown = false;

                $interval.cancel(progressCircularInterval);
            }, 600);
        }

        function animateCircularProgress()
        {
            progressCircularMask1
                .transition({ rotate: '+=250deg', delay: 1000 }, 1000, 'easeInOutQuint');

            progressCircularMask2
                .transition({ rotate: '+=250deg' }, 1000, 'easeInOutQuint');

            progressCircularMask3
                .transition({ rotate: '+=125deg' }, 1000, 'easeInOutQuint')
                .transition({ rotate: '+=125deg' }, 1000, 'easeInOutQuint');

            progressCircularMask3Translate
                .transition({ y: '25px' }, 1000, 'easeInOutQuint')
                .transition({ y: '0' }, 1000, 'easeInOutQuint');
        }

        function showLinear(color, container)
        {
            if (!progressLinearIsShown)
            {
                showLinearProgress(color, container);
            }
        }

        function hideLinear()
        {
            if (progressLinearIsShown)
            {
                hideLinearProgress();
            }
        }

        function showLinearProgress(color, container)
        {
            progressLinearIsShown = true;

            progressLinearBackground.css({ backgroundColor: color });
            progressLinearFirstBar.css({ backgroundColor: color });
            progressLinearSecondBar.css({ backgroundColor: color });

            if (angular.isDefined(container))
            {
                progressLinear.appendTo(container);
            }
            else
            {
                progressLinear.appendTo('body');
            }

            $timeout(function()
            {
                progressLinear.addClass('progress-linear--is-shown');
            });
        }

        function hideLinearProgress()
        {
            progressLinear.removeClass('progress-linear--is-shown');

            $timeout(function()
            {
                progressLinear.remove();

                progressLinearIsShown = false;
            }, 400);
        }

        init();

        return {
            circular: {
                show: showCircular,
                hide: hideCircular
            },
            linear: {
                show: showLinear,
                hide: hideLinear
            }
        };
    }]);
