/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.ripple', [])
    .directive('lxRipple', function()
    {
        return {
            restrict: 'A',
            link: function(scope, element, attrs)
            {
                var ripple, d, x, y;

                element
                    .css({
                        position: 'relative',
                        overflow: 'hidden'
                    })
                    .bind('mousedown', function(e)
                    {
                        if (element.find('.ripple').length === 0)
                        {
                            ripple = angular.element('<span/>', {
                                class: 'ripple'
                            });

                            if (attrs.lxRipple)
                            {
                                ripple.addClass('bgc-' + attrs.lxRipple);
                            }

                            element.prepend(ripple);
                        }
                        else
                        {
                            ripple = element.find('.ripple');
                        }
                             
                        ripple.removeClass('ripple--is-animated');
                         
                        if (!ripple.height() && !ripple.width())
                        {
                            d = Math.max(element.outerWidth(), element.outerHeight());

                            ripple.css({ height: d, width: d });
                        }
                         
                        x = e.pageX - element.offset().left - ripple.width() / 2;
                        y = e.pageY - element.offset().top - ripple.height() / 2;
                         
                        ripple.css({ top: y+'px', left: x+'px' }).addClass('ripple--is-animated');
                    });
            }
        };
    });