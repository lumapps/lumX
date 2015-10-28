(function()
{
    'use strict';

    angular
        .module('lumx.date-picker', [])
        .directive('lxDatePicker', lxDatePicker);

    /* @ngInject */
    function lxDatePicker()
    {
        return {
            restrict: 'AE',
            templateUrl: 'date-picker.html',
            scope:
            {
                ngModel: '=',
                allowClear: '=?lxAllowClear',
                color: '@?lxColor',
                inputFixedLabel: '=?lxInputFixedLabel',
                inputIcon: '@?lxInputIcon',
                inputLabel: '@?lxInputLabel',
                locale: '@lxLocale'
            },
            controller: LxDatePickerController,
            controllerAs: 'lxDatePicker',
            bindToController: true,
            replace: true,
        };
    }

    /* @ngInject */
    function LxDatePickerController($element, $scope, $timeout)
    {
        var lxDatePicker = this;
        var datePicker = $element.find('.lx-date-picker');
        var datePickerFilter;

        lxDatePicker.clearDate = clearDate;
        lxDatePicker.closePicker = closePicker;
        lxDatePicker.displayYearSelection = displayYearSelection;
        lxDatePicker.hideYearSelection = hideYearSelection;
        lxDatePicker.getDateFormatted = getDateFormatted;
        lxDatePicker.nextMonth = nextMonth;
        lxDatePicker.openPicker = openPicker;
        lxDatePicker.previousMonth = previousMonth;
        lxDatePicker.select = select;
        lxDatePicker.selectYear = selectYear;

        lxDatePicker.color = angular.isDefined(lxDatePicker.color) ? lxDatePicker.color : 'primary';
        lxDatePicker.isOpen = false;
        lxDatePicker.moment = moment;
        lxDatePicker.yearSelection = false;

        init();

        ////////////

        function clearDate()
        {
            lxDatePicker.ngModelMomentFormatted = undefined;
            lxDatePicker.ngModel = undefined;
        }

        function closePicker()
        {
            if (!lxDatePicker.isOpen)
            {
                return;
            }

            datePickerFilter.removeClass('lx-date-filter--is-shown');
            datePicker.removeClass('lx-date-picker--is-shown');

            $timeout(function()
            {
                datePickerFilter.remove();

                datePicker
                    .hide()
                    .appendTo($element);

                lxDatePicker.isOpen = false;
            }, 600);
        }

        function displayYearSelection()
        {
            lxDatePicker.yearSelection = true;

            $timeout(function()
            {
                var yearSelector = datePicker.find('.lx-date-picker__year-selector');
                var activeYear = yearSelector.find('.lx-date-picker__year--is-active');

                yearSelector.scrollTop(yearSelector.scrollTop() + activeYear.position().top - yearSelector.height() / 2 + activeYear.height() / 2);
            });
        }

        function hideYearSelection()
        {
            lxDatePicker.yearSelection = false;
        }

        function generateCalendar()
        {
            lxDatePicker.days = [];

            var previousDay = moment(lxDatePicker.ngModel).date(0);
            var firstDayOfMonth = moment(lxDatePicker.ngModel).date(1);
            var lastDayOfMonth = firstDayOfMonth.endOf('month');
            var maxDays = lastDayOfMonth.date();

            lxDatePicker.emptyFirstDays = [];

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--)
            {
                lxDatePicker.emptyFirstDays.push(
                {});
            }

            for (var j = 0; j < maxDays; j++)
            {
                var date = angular.copy(previousDay.add(1, 'days'));

                date.selected = angular.isDefined(lxDatePicker.ngModel) && date.isSame(lxDatePicker.ngModel, 'day');
                date.today = date.isSame(moment(), 'day');

                lxDatePicker.days.push(date);
            }

            lxDatePicker.emptyLastDays = [];

            for (var k = 7 - (lastDayOfMonth.day() === 0 ? 7 : lastDayOfMonth.day()); k > 0; k--)
            {
                lxDatePicker.emptyLastDays.push(
                {});
            }
        }

        function getDateFormatted()
        {
            return moment(lxDatePicker.ngModel).format('llll').replace(moment(lxDatePicker.ngModel).format('LT'), '').trim().replace(moment(lxDatePicker.ngModel).format('YYYY'), '').trim();
        }

        function init()
        {
            moment.locale(lxDatePicker.locale);

            lxDatePicker.ngModelMomentFormatted = angular.isDefined(lxDatePicker.ngModel) ? moment(lxDatePicker.ngModel).format('LL') : undefined;
            lxDatePicker.days = [];
            lxDatePicker.daysOfWeek = [moment.weekdaysMin(1), moment.weekdaysMin(2), moment.weekdaysMin(3), moment.weekdaysMin(4), moment.weekdaysMin(5), moment.weekdaysMin(6), moment.weekdaysMin(0)];
            lxDatePicker.years = [];

            for (var y = moment().year() - 100; y <= moment().year() + 100; y++)
            {
                lxDatePicker.years.push(y);
            }

            generateCalendar();
        }

        function nextMonth()
        {
            lxDatePicker.ngModelMomentFormatted = moment(lxDatePicker.ngModel).add(1, 'month').format('LL');
            lxDatePicker.ngModel = moment(lxDatePicker.ngModel).add(1, 'month').toDate();

            generateCalendar();
        }

        function openPicker()
        {
            if (lxDatePicker.isOpen)
            {
                return;
            }

            lxDatePicker.isOpen = true;

            $timeout(function()
            {
                lxDatePicker.yearSelection = false;

                datePickerFilter = angular.element('<div/>',
                {
                    class: 'lx-date-filter'
                });

                datePickerFilter
                    .appendTo('body')
                    .bind('click', function()
                    {
                        $scope.$apply(function()
                        {
                            closePicker();
                        });
                    });

                datePicker
                    .appendTo('body')
                    .show();

                $timeout(function()
                {
                    datePickerFilter.addClass('lx-date-filter--is-shown');
                    datePicker.addClass('lx-date-picker--is-shown');
                }, 100);
            });
        }

        function previousMonth()
        {
            lxDatePicker.ngModelMomentFormatted = moment(lxDatePicker.ngModel).subtract(1, 'month').format('LL');
            lxDatePicker.ngModel = moment(lxDatePicker.ngModel).subtract(1, 'month').toDate();

            generateCalendar();
        }

        function select(_day)
        {
            lxDatePicker.ngModelMomentFormatted = _day.format('LL');
            lxDatePicker.ngModel = _day.toDate();

            generateCalendar();
        }

        function selectYear(_year)
        {
            lxDatePicker.yearSelection = false;

            lxDatePicker.ngModelMomentFormatted = moment(lxDatePicker.ngModel).year(_year).format('LL');
            lxDatePicker.ngModel = moment(lxDatePicker.ngModel).year(_year).toDate();

            generateCalendar();
        }
    }
})();