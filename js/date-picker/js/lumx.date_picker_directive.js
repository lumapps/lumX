/* global angular */
/* global moment */
'use strict'; // jshint ignore:line


angular.module('lumx.date-picker', [])
    .controller('lxDatePickerController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window)
    {
        moment.locale($window.navigator.language !== null ? $window.navigator.language : $window.navigator.browserLanguage);

        var $element,
            $dateFilter,
            $datePicker;

        this.init = function(element)
        {
            if ($scope.model)
            {
                $scope.selectedDate = {
                    date: moment($scope.model),
                    formatted: moment($scope.model).format('LL')
                };
            }
            else
            {
                $scope.selectedDate = {
                    date: undefined,
                    formatted: undefined
                };
            }

            $element = element;
            $datePicker = element.find('.lx-date-picker');

            var momentDaysOfWeek = moment().localeData()._weekdaysMin;

            $scope.localeData = moment().localeData();
            $scope.now = moment();
            $scope.month = $scope.month || moment().startOf('day');
            $scope.days = [];
            $scope.daysOfWeek = [momentDaysOfWeek[1], momentDaysOfWeek[2], momentDaysOfWeek[3], momentDaysOfWeek[4], momentDaysOfWeek[5], momentDaysOfWeek[6], momentDaysOfWeek[0]];

            generateCalendar();
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
                date: moment(day),
                formatted: moment(day).format('LL')
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
            var previousDay = moment($scope.month).date(0),
                firstDayOfMonth = moment($scope.month).date(1),
                days = [],
                lastDayOfMonth = moment(firstDayOfMonth).endOf('month'),
                maxDays = lastDayOfMonth.date();

            $scope.emptyFirstDays = [];

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--)
            {
                $scope.emptyFirstDays.push({});
            }

            for (var j = 0; j < maxDays; j++)
            {
                var date = moment(previousDay.add(1, 'days'));
                date.selected = date.isSame($scope.selectedDate.date, 'day');
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
                model: '='
            },
            templateUrl: 'lumx.date_picker.html',
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
            }
        };
    });