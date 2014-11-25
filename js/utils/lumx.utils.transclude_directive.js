/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.utils.transclude', [])
    .config(function($provide)
    {
        $provide.decorator('ngTranscludeDirective', ['$delegate', function($delegate)
        {
            $delegate.shift();

            return $delegate;
        }]);
    })
    .directive('ngTransclude', function()
    {
        return {
            restrict: 'EAC',
            link: function(scope, element, attrs, ctrl, transclude)
            {
                var iScopeType = attrs.ngTransclude || 'sibling';
                // console.log('iScopeType: ' + iScopeType);

                switch (iScopeType)
                {
                    case 'sibling':
                        transclude(function(clone)
                        {
                            element.empty();
                            element.append(clone);
                        });
                        break;
                    case 'parent':
                        transclude(scope, function(clone)
                        {
                            element.empty();
                            element.append(clone);
                        });
                        break;
                    case 'child':
                        var iChildScope = scope.$new();

                        transclude(iChildScope, function(clone)
                        {
                            element.empty();
                            element.append(clone);
                            element.on('$destroy', function()
                            {
                                iChildScope.$destroy();
                            });
                        });
                        break;
                }
            }
        };
    });
