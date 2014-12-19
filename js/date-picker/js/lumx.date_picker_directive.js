/* global angular */
/* global moment */
'use strict'; // jshint ignore:line


angular.module('lumx.date-picker', [])
    .controller('lxDatePickerController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window)
    {
        var locale = $window.navigator.language !== null ? $window.navigator.language : $window.navigator.browserLanguage,
            $element,
            $dateFilter,
            $datePicker;

        this.init = function(element)
        {
            $scope.selectedDate = {
                date: undefined,
                formatted: undefined
            };

            $element = element;
            $datePicker = element.find('.lx-date-picker');

            $scope.localeData = moment().locale(locale).localeData();
            $scope.now = moment().locale(locale);
            $scope.month = $scope.month || moment().locale(locale).startOf('day');
            $scope.days = [];
            $scope.daysOfWeek = [$scope.localeData._weekdaysMin[1], $scope.localeData._weekdaysMin[2], $scope.localeData._weekdaysMin[3], $scope.localeData._weekdaysMin[4], $scope.localeData._weekdaysMin[5], $scope.localeData._weekdaysMin[6], $scope.localeData._weekdaysMin[0]];

            generateCalendar();
        };

        this.updateModel = function(val)
        {
            if (angular.isDefined(val)) {
                $scope.selectedDate = {
                    date: moment(val).locale(locale),
                    formatted: moment(val).locale(locale).format('LL')
                };
            }
        };

        $scope.previousMonth = function()
        {
            $scope.month = $scope.month.subtract(1, 'month');
            generateCalendar();
        };

        $scope.nextMonth = function()
        {
            $scope.month = $scope.month.add(1, 'month');
            generateCalendar();
        };

        $scope.select = function(day)
        {
            $scope.selectedDate = {
                date: moment(day).locale(locale),
                formatted: moment(day).locale(locale).format('LL')
            };

            $scope.model = day;

            generateCalendar();
        };

        $scope.openPicker = function()
        {
            $dateFilter = angular.element('<div/>', {
                class: 'lx-date-filter'
            });

            $dateFilter
                .appendTo('body')
                .bind('click', function()
                {
                    $scope.closePicker();
                });

            $datePicker
                .appendTo('body')
                .show();

            $timeout(function()
            {
                $dateFilter.addClass('lx-date-filter--is-shown');
                $datePicker.addClass('lx-date-picker--is-shown');
            }, 100);
        };

        $scope.closePicker = function()
        {
            $dateFilter.removeClass('lx-date-filter--is-shown');
            $datePicker.removeClass('lx-date-picker--is-shown');

            $timeout(function()
            {
                $dateFilter.remove();

                $datePicker
                    .hide()
                    .appendTo($element);
            }, 600);
        };

        function generateCalendar()
        {
            var previousDay = moment($scope.month).locale(locale).date(0),
                firstDayOfMonth = moment($scope.month).locale(locale).date(1),
                days = [],
                lastDayOfMonth = moment(firstDayOfMonth).locale(locale).endOf('month'),
                maxDays = lastDayOfMonth.date();

            $scope.emptyFirstDays = [];

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--)
            {
                $scope.emptyFirstDays.push({});
            }

            for (var j = 0; j < maxDays; j++)
            {
                var date = moment(previousDay.add(1, 'days')).locale(locale);
                date.selected = date.isSame($scope.selectedDate.date, 'day') && angular.isDefined($scope.selectedDate.date);
                date.today = date.isSame($scope.now, 'day');
                days.push(date);
            }

            $scope.emptyLastDays = [];

            for (var k = 7 - (lastDayOfMonth.day() === 0 ? 7 : lastDayOfMonth.day()); k > 0; k--)
            {
                $scope.emptyLastDays.push({});
            }
            
            $scope.days = days;
        }
    }])
    .directive('lxDatePicker', function()
    {
        return {
            restrict: 'AE',
            controller: 'lxDatePickerController',
            scope: {
                model: '=',
                label: '@'
            },
            templateUrl: 'lumx.date_picker.html',
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
                scope.$watch('model', function (newVal)
                {
                    ctrl.updateModel(newVal);
                });
            }
        };
    });