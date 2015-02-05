/* global angular */
/* global moment */
'use strict'; // jshint ignore:line


angular.module('lumx.date-picker', [])
    .controller('lxDatePickerController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window)
    {
        moment.locale($scope.locale);

        var $datePicker,
            $datePickerFilter,
            $datePickerContainer;

        this.init = function(element)
        {
            $datePicker = element.find('.lx-date-picker');
            $datePickerContainer = element;

            if (angular.isDefined($scope.model))
            {
                $scope.selected = {
                    model: moment($scope.model).format('LL'),
                    date: $scope.model
                };

                $scope.activeDate = moment($scope.model);
            }
            else
            {
                $scope.selected = {
                    model: undefined,
                    date: new Date()
                };

                $scope.activeDate = moment();
            }

            $scope.moment = moment;

            $scope.days = [];
            $scope.daysOfWeek = [moment.weekdaysMin(1), moment.weekdaysMin(2), moment.weekdaysMin(3), moment.weekdaysMin(4), moment.weekdaysMin(5), moment.weekdaysMin(6), moment.weekdaysMin(0)];
                
            $scope.years = [];

            for (var y = moment().year() - 100; y <= moment().year() + 100; y++)
            {
                $scope.years.push(y);
            }

            generateCalendar();
        };

        $scope.previousMonth = function()
        {
            $scope.activeDate = $scope.activeDate.subtract(1, 'month');
            generateCalendar();
        };

        $scope.nextMonth = function()
        {
            $scope.activeDate = $scope.activeDate.add(1, 'month');
            generateCalendar();
        };

        $scope.select = function(day)
        {
            $scope.selected = {
                model: day.format('LL'),
                date: day.toDate()
            };

            $scope.model = day.toDate();

            generateCalendar();
        };

        $scope.selectYear = function(year)
        {
            $scope.yearSelection = false;

            $scope.selected.model = moment($scope.selected.date).year(year).format('LL');
            $scope.selected.date = moment($scope.selected.date).year(year).toDate();
            $scope.model = moment($scope.selected.date).toDate();
            $scope.activeDate = $scope.activeDate.add(year - $scope.activeDate.year(), 'year');

            generateCalendar();
        };

        $scope.openPicker = function()
        {
            $scope.yearSelection = false;

            $datePickerFilter = angular.element('<div/>', {
                class: 'lx-date-filter'
            });

            $datePickerFilter
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
                $datePickerFilter.addClass('lx-date-filter--is-shown');
                $datePicker.addClass('lx-date-picker--is-shown');
            }, 100);
        };

        $scope.closePicker = function()
        {
            $datePickerFilter.removeClass('lx-date-filter--is-shown');
            $datePicker.removeClass('lx-date-picker--is-shown');

            $timeout(function()
            {
                $datePickerFilter.remove();

                $datePicker
                    .hide()
                    .appendTo($datePickerContainer);
            }, 600);
        };

        $scope.displayYearSelection = function()
        {
            var calendarHeight = angular.element('.lx-date-picker__calendar').outerHeight(),
                $yearSelector = angular.element('.lx-date-picker__year-selector');

            $yearSelector.css({ height: calendarHeight });

            $scope.yearSelection = true;
            
            $timeout(function()
            {
                var $activeYear = angular.element('.lx-date-picker__year--is-active');

                $yearSelector.scrollTop($yearSelector.scrollTop() + $activeYear.position().top - $yearSelector.height()/2 + $activeYear.height()/2);
            });
        };

        function generateCalendar()
        {
            var days = [],
                previousDay = angular.copy($scope.activeDate).date(0),
                firstDayOfMonth = angular.copy($scope.activeDate).date(1),
                lastDayOfMonth = angular.copy(firstDayOfMonth).endOf('month'),
                maxDays = angular.copy(lastDayOfMonth).date();

            $scope.emptyFirstDays = [];

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--)
            {
                $scope.emptyFirstDays.push({});
            }

            for (var j = 0; j < maxDays; j++)
            {
                var date = angular.copy(previousDay.add(1, 'days'));

                date.selected = angular.isDefined($scope.selected.model) && date.isSame($scope.selected.date, 'day');
                date.today = date.isSame(moment(), 'day');

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
                label: '@',
                locale: '@'
            },
            templateUrl: 'date-picker.html',
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
            }
        };
    });