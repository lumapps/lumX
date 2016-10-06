(function()
{
    'use strict';

    angular
        .module('lumx.date-picker')
        .service('LxDatePickerService', LxDatePickerService);

    LxDatePickerService.$inject = ['$rootScope', '$timeout', 'LxDepthService', 'LxEventSchedulerService'];

    function LxDatePickerService($rootScope, $timeout, LxDepthService, LxEventSchedulerService)
    {
        var service = this;
        var activeDatePickerId;
        var datePickerFilter;
        var idEventScheduler;
        var scopeMap = {};

        service.close = closeDatePicker;
        service.open = openDatePicker;
        service.registerScope = registerScope;

        ////////////

        function closeDatePicker(_datePickerId)
        {
            if (angular.isDefined(idEventScheduler))
            {
                LxEventSchedulerService.unregister(idEventScheduler);
                idEventScheduler = undefined;
            }

            activeDatePickerId = undefined;

            $rootScope.$broadcast('lx-date-picker__close-start', _datePickerId);

            datePickerFilter.removeClass('lx-date-picker-filter--is-shown');
            scopeMap[_datePickerId].element.removeClass('lx-date-picker--is-shown');

            $timeout(function()
            {
                angular.element('body').removeClass('no-scroll-date-picker-' + scopeMap[_datePickerId].uuid);

                datePickerFilter.remove();

                scopeMap[_datePickerId].element
                    .hide()
                    .appendTo(scopeMap[_datePickerId].elementParent);

                scopeMap[_datePickerId].isOpen = false;
                $rootScope.$broadcast('lx-date-picker__close-end', _datePickerId);
            }, 600);
        }

        function onKeyUp(_event)
        {
            if (_event.keyCode == 27 && angular.isDefined(activeDatePickerId))
            {
                closeDatePicker(activeDatePickerId);
            }

            _event.stopPropagation();
        }

        function openDatePicker(_datePickerId)
        {
            LxDepthService.register();

            activeDatePickerId = _datePickerId;

            angular.element('body').addClass('no-scroll-date-picker-' + scopeMap[_datePickerId].uuid);

            datePickerFilter = angular.element('<div/>',
            {
                class: 'lx-date-picker-filter'
            });

            datePickerFilter
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            if (scopeMap[activeDatePickerId].autoClose)
            {
                datePickerFilter.on('click', function()
                {
                    closeDatePicker(activeDatePickerId);
                });
            }

            if (scopeMap[activeDatePickerId].escapeClose)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            scopeMap[activeDatePickerId].element
                .css('z-index', LxDepthService.getDepth() + 1)
                .appendTo('body')
                .show();

            $timeout(function()
            {
                $rootScope.$broadcast('lx-date-picker__open-start', activeDatePickerId);

                scopeMap[activeDatePickerId].isOpen = true;

                datePickerFilter.addClass('lx-date-picker-filter--is-shown');
                scopeMap[activeDatePickerId].element.addClass('lx-date-picker--is-shown');
            }, 100);

            $timeout(function()
            {
                $rootScope.$broadcast('lx-date-picker__open-end', activeDatePickerId);
            }, 700);
        }

        function registerScope(_datePickerId, _datePickerScope)
        {
            scopeMap[_datePickerId] = _datePickerScope.lxDatePicker;
        }
    }
})();