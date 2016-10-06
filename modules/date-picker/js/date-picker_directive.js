(function()
{
    'use strict';

    angular
        .module('lumx.date-picker')
        .directive('lxDatePicker', lxDatePicker);

    lxDatePicker.$inject = ['LxDatePickerService', 'LxUtils'];

    function lxDatePicker(LxDatePickerService, LxUtils)
    {
        return {
            restrict: 'AE',
            templateUrl: 'date-picker.html',
            scope:
            {
                autoClose: '=?lxAutoClose',
                callback: '&?lxCallback',
                color: '@?lxColor',
                escapeClose: '=?lxEscapeClose',
                inputFormat: '@?lxInputFormat',
                maxDate: '=?lxMaxDate',
                ngModel: '=',
                minDate: '=?lxMinDate',
                locale: '@lxLocale'
            },
            link: link,
            controller: LxDatePickerController,
            controllerAs: 'lxDatePicker',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            if (angular.isDefined(attrs.id))
            {
                attrs.$observe('id', function(_newId)
                {
                    scope.lxDatePicker.pickerId = _newId;
                    LxDatePickerService.registerScope(scope.lxDatePicker.pickerId, scope);
                });
            }
            else
            {
                scope.lxDatePicker.pickerId = LxUtils.generateUUID();
                LxDatePickerService.registerScope(scope.lxDatePicker.pickerId, scope);
            }
        }
    }

    LxDatePickerController.$inject = ['$element', '$scope', '$timeout', '$transclude', 'LxDatePickerService', 'LxUtils'];

    function LxDatePickerController($element, $scope, $timeout, $transclude, LxDatePickerService, LxUtils)
    {
        var lxDatePicker = this;
        var input;
        var modelController;
        var timer1;
        var timer2;
        var watcher1;
        var watcher2;

        lxDatePicker.closeDatePicker = closeDatePicker;
        lxDatePicker.displayYearSelection = displayYearSelection;
        lxDatePicker.hideYearSelection = hideYearSelection;
        lxDatePicker.getDateFormatted = getDateFormatted;
        lxDatePicker.nextMonth = nextMonth;
        lxDatePicker.openDatePicker = openDatePicker;
        lxDatePicker.previousMonth = previousMonth;
        lxDatePicker.select = select;
        lxDatePicker.selectYear = selectYear;

        lxDatePicker.autoClose = angular.isDefined(lxDatePicker.autoClose) ? lxDatePicker.autoClose : true;
        lxDatePicker.color = angular.isDefined(lxDatePicker.color) ? lxDatePicker.color : 'primary';
        lxDatePicker.element = $element.find('.lx-date-picker');
        lxDatePicker.escapeClose = angular.isDefined(lxDatePicker.escapeClose) ? lxDatePicker.escapeClose : true;
        lxDatePicker.isOpen = false;
        lxDatePicker.moment = moment;
        lxDatePicker.yearSelection = false;
        lxDatePicker.uuid = LxUtils.generateUUID();

        $transclude(function(clone)
        {
            if (clone.length)
            {
                lxDatePicker.hasInput = true;

                timer1 = $timeout(function()
                {
                    input = $element.find('.lx-date-input input');
                    modelController = input.data('$ngModelController');

                    watcher2 = $scope.$watch(function()
                    {
                        return modelController.$viewValue;
                    }, function(newValue, oldValue)
                    {
                        if (angular.isUndefined(newValue))
                        {
                            lxDatePicker.ngModel = undefined;
                        }
                    });
                });
            }
        });

        watcher1 = $scope.$watch(function()
        {
            return lxDatePicker.ngModel;
        }, init);

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer1);
            $timeout.cancel(timer2);

            if (angular.isFunction(watcher1))
            {
                watcher1();
            }

            if (angular.isFunction(watcher2))
            {
                watcher2();
            }
        });

        ////////////

        function closeDatePicker()
        {
            LxDatePickerService.close(lxDatePicker.pickerId);
        }

        function displayYearSelection()
        {
            lxDatePicker.yearSelection = true;

            timer2 = $timeout(function()
            {
                var yearSelector = angular.element('.lx-date-picker__year-selector');
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

            var previousDay = angular.copy(lxDatePicker.ngModelMoment).date(0);
            var firstDayOfMonth = angular.copy(lxDatePicker.ngModelMoment).date(1);
            var lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
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

                if (angular.isDefined(lxDatePicker.minDate) && date.toDate() < lxDatePicker.minDate)
                {
                    date.disabled = true;
                }

                if (angular.isDefined(lxDatePicker.maxDate) && date.toDate() > lxDatePicker.maxDate)
                {
                    date.disabled = true;
                }

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
            var dateFormatted = lxDatePicker.ngModelMoment.format('llll').replace(lxDatePicker.ngModelMoment.format('LT'), '').trim().replace(lxDatePicker.ngModelMoment.format('YYYY'), '').trim();
            var dateFormattedLastChar = dateFormatted.slice(-1);

            if (dateFormattedLastChar === ',')
            {
                dateFormatted = dateFormatted.slice(0, -1);
            }

            return dateFormatted;
        }

        function init()
        {
            moment.locale(lxDatePicker.locale);

            lxDatePicker.ngModelMoment = angular.isDefined(lxDatePicker.ngModel) ? moment(angular.copy(lxDatePicker.ngModel)) : moment();
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
            lxDatePicker.ngModelMoment = lxDatePicker.ngModelMoment.add(1, 'month');

            generateCalendar();
        }

        function openDatePicker()
        {
            LxDatePickerService.open(lxDatePicker.pickerId);
        }

        function previousMonth()
        {
            lxDatePicker.ngModelMoment = lxDatePicker.ngModelMoment.subtract(1, 'month');

            generateCalendar();
        }

        function select(_day)
        {
            if (!_day.disabled)
            {
                lxDatePicker.ngModel = _day.toDate();
                lxDatePicker.ngModelMoment = angular.copy(_day);

                if (angular.isDefined(lxDatePicker.callback))
                {
                    lxDatePicker.callback(
                    {
                        newDate: lxDatePicker.ngModel
                    });
                }

                if (angular.isDefined(modelController) && lxDatePicker.inputFormat)
                {
                    modelController.$setViewValue(angular.copy(_day).format(lxDatePicker.inputFormat));
                    modelController.$render();
                }

                generateCalendar();
            }
        }

        function selectYear(_year)
        {
            lxDatePicker.yearSelection = false;

            lxDatePicker.ngModelMoment = lxDatePicker.ngModelMoment.year(_year);

            generateCalendar();
        }
    }
})();