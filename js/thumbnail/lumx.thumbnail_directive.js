/* global angular */
/* global Image */
'use strict'; // jshint ignore:line


angular.module('lumx.thumbnail', [])
    .controller('LxThumbnailController', ['$rootScope', '$scope', function($rootScope, $scope)
        {
            var scope = $scope.$new();

            this.init = function(element, attrs)
            {
                scope.element = element;

                scope.thumbnailSrc = attrs.thumbnailSrc;
                scope.thumbnailWidth = attrs.thumbnailWidth;
                scope.thumbnailHeight = attrs.thumbnailHeight;

                this.prepareImage();
            };

            this.prepareImage = function()
            {
                var self = this,
                    img = new Image();

                img.src = scope.thumbnailSrc;

                scope.element.css({
                    'width': scope.thumbnailWidth,
                    'height': scope.thumbnailHeight
                });

                scope.element.addClass('thumbnail--is-loading');

                img.onload = function()
                {
                    scope.originalWidth = img.width;
                    scope.originalHeight = img.height;

                    self.addImage();
                };
            };

            this.addImage = function()
            {
                var imageSizeWidthRatio = scope.thumbnailWidth / scope.originalWidth,
                    imageSizeWidth = scope.thumbnailWidth,
                    imageSizeHeight = scope.originalHeight * imageSizeWidthRatio;

                if (imageSizeHeight < scope.thumbnailHeight)
                {
                    var resizeFactor = scope.thumbnailHeight / imageSizeHeight;

                    imageSizeHeight = scope.thumbnailHeight;
                    imageSizeWidth = resizeFactor * imageSizeWidth;
                }

                scope.element.removeClass('thumbnail--is-loading');

                scope.element.css({
                    'background': 'url(' + scope.thumbnailSrc + ') no-repeat',
                    'background-position': 'center',
                    'background-size': imageSizeWidth + 'px ' + imageSizeHeight + 'px',
                    'overflow': 'hidden'
                });

                $rootScope.$broadcast('THUMBNAIL_LOADED', scope.thumbnailSrc);
            };
        }])
    .directive('lxThumbnail', function()
    {
        return {
            restrict: 'A',
            controller: 'LxThumbnailController',
            scope: {},
            link: function(scope, element, attrs, ctrl)
            {
                scope.init = 0;

                attrs.$observe('thumbnailSrc', function()
                {
                    if (attrs.thumbnailSrc)
                    {
                        scope.init = scope.init + 1;
                    }
                });

                attrs.$observe('thumbnailWidth', function()
                {
                    if (attrs.thumbnailWidth)
                    {
                        scope.init = scope.init + 1;
                    }
                });

                attrs.$observe('thumbnailHeight', function()
                {
                    if (attrs.thumbnailHeight)
                    {
                        scope.init = scope.init + 1;
                    }
                });

                scope.$watch('init', function(newValue)
                {
                    if (newValue === 3)
                    {
                        ctrl.init(element, attrs);
                        element.addClass('thumbnail');
                    }
                });

                scope.$watch(function()
                {
                    return attrs.thumbnailSrc;
                },
                function(newValue, oldValue)
                {
                    if (newValue !== oldValue)
                    {
                        ctrl.init(element, attrs);
                    }
                });

                scope.$watch(function()
                {
                    return attrs.thumbnailWidth;
                },
                function(newValue, oldValue)
                {
                    if (newValue !== oldValue)
                    {
                        ctrl.init(element, attrs);
                    }
                });

                scope.$watch(function()
                {
                    return attrs.thumbnailHeight;
                },
                function(newValue, oldValue)
                {
                    if (newValue !== oldValue)
                    {
                        ctrl.init(element, attrs);
                    }
                });
            }
        };
    });