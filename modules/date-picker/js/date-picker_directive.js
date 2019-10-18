import { CSS_PREFIX } from '@lumx/core/js/constants';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import template from '../views/date-picker.html';

/////////////////////////////

function DatePickerController($scope, $timeout, LxDatePickerService, LxUtilsService) {
    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The date picker header height.
     *
     * @type {number}
     */
    const _HEADER_HEIGHT = 92;

    /**
     * The calendar in moment format.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _calendar;

    /**
     * The input model controller.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _inputModelController;

    /**
     * The model controller.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _modelController;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * All days in the calendar.
     *
     * @type {Array}
     */
    lx.days = [];

    /**
     * All days of the week.
     *
     * @type {Array}
     */
    lx.daysOfWeek = [];

    /**
     * The monthly empty first days.
     *
     * @type {Array}
     */
    lx.emptyFirstDays = [];

    /**
     * The monthly empty last days.
     *
     * @type {Array}
     */
    lx.emptyLastDays = [];

    /**
     * Whether the component has a transcluded text field or not.
     *
     * @type {boolean}
     */
    lx.hasInput = false;

    /**
     * The date picker icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiChevronLeft,
        mdiChevronRight,
    };

    /**
     * The dialog identifier.
     *
     * @type {string}
     */
    lx.id = LxUtilsService.generateUUID();

    /**
     * All years in the calendar.
     *
     * @type {Array}
     */
    lx.years = [];

    /**
     * Whether the component is in year selection mode or not.
     *
     * @type {boolean}
     */
    lx.yearSelection = false;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Generate calendar.
     */
    function _generateCalendar() {
        if (angular.isUndefined(_calendar)) {
            _calendar = moment(angular.copy(_modelController.$viewValue));
        }

        lx.days.length = 0;
        lx.emptyFirstDays.length = 0;
        lx.emptyLastDays.length = 0;

        const previousDay = angular.copy(_calendar).date(0);
        const firstDayOfMonth = angular.copy(_calendar).date(1);
        const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
        const maxDays = lastDayOfMonth.date();

        // eslint-disable-next-line no-magic-numbers
        for (let i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
            lx.emptyFirstDays.push({});
        }

        for (let j = 0; j < maxDays; j++) {
            const date = angular.copy(previousDay.add(1, 'days'));

            date.isSelected =
                angular.isDefined(_modelController.$viewValue) && date.isSame(_modelController.$viewValue, 'day');
            date.isToday = date.isSame(moment(), 'day');

            if (angular.isDefined(lx.minDate)) {
                const minDate = angular.isString(lx.minDate) ? new Date(lx.minDate) : lx.minDate;

                if (date.toDate() < minDate) {
                    date.isDisabled = true;
                }
            }

            if (angular.isDefined(lx.maxDate)) {
                const maxDate = angular.isString(lx.maxDate) ? new Date(lx.maxDate) : lx.maxDate;

                if (date.toDate() > maxDate) {
                    date.isDisabled = true;
                }
            }

            lx.days.push(date);
        }

        // eslint-disable-next-line no-magic-numbers
        for (let k = 7 - (lastDayOfMonth.day() === 0 ? 7 : lastDayOfMonth.day()); k > 0; k--) {
            lx.emptyLastDays.push({});
        }
    }

    /**
     * Initialize the calendar days of week and years.
     */
    function _initCalendar() {
        moment.locale(lx.locale);

        /* eslint-disable no-magic-numbers */
        lx.daysOfWeek.push(moment.weekdaysMin(1));
        lx.daysOfWeek.push(moment.weekdaysMin(2));
        lx.daysOfWeek.push(moment.weekdaysMin(3));
        lx.daysOfWeek.push(moment.weekdaysMin(4));
        lx.daysOfWeek.push(moment.weekdaysMin(5));
        lx.daysOfWeek.push(moment.weekdaysMin(6));
        lx.daysOfWeek.push(moment.weekdaysMin(7));

        for (let y = moment().year() - 100; y <= moment().year() + 100; y++) {
            lx.years.push(y);
        }
        /* eslint-enable no-magic-numbers */
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Display component in year selector mode.
     */
    function displayYearSelection() {
        lx.yearSelection = true;

        $timeout(() => {
            const dialogWrapper = angular.element(`.${CSS_PREFIX}-dialog__content`);
            const activeYear = angular.element(`.${CSS_PREFIX}-date-picker__year--is-active`);

            $timeout(() => {
                /* eslint-disable no-magic-numbers */
                dialogWrapper.scrollTop(
                    activeYear.position().top -
                        dialogWrapper.outerHeight() / 2 +
                        activeYear.outerHeight() / 2 -
                        _HEADER_HEIGHT,
                );
                /* eslint-enable no-magic-numbers */
            });
        });
    }

    /**
     * Get day formatted regarding model.
     *
     * @return {string} The formatted day.
     */
    function getDayFormatted() {
        let dayFormatted = moment(_modelController.$viewValue)
            .format('llll')
            .replace(moment(_modelController.$viewValue).format('LT'), '')
            .trim()
            .replace(moment(_modelController.$viewValue).format('YYYY'), '')
            .trim();
        const dayormattedLastChar = dayFormatted.slice(-1);

        if (dayormattedLastChar === ',') {
            dayFormatted = dayFormatted.slice(0, -1);
        }

        return dayFormatted;
    }

    /**
     * Get month formatted regarding calendar position.
     *
     * @return {string} The formatted month.
     */
    function getMonthFormatted() {
        return _calendar.format('MMMM YYYY');
    }

    /**
     * Get year formatted regarding model.
     *
     * @return {string} The formatted year.
     */
    function getYearFormatted() {
        return moment(_modelController.$viewValue).format('YYYY');
    }

    /**
     * Display component in calendar mode.
     */
    function hideYearSelection() {
        lx.yearSelection = false;

        $timeout(() => {
            const dialogWrapper = angular.element(`.${CSS_PREFIX}-dialog__content`);

            dialogWrapper.scrollTop(0);
        });
    }

    /**
     * Whether the given year is active regarding the model or not.
     *
     * @param  {Object}  year The year to check.
     * @return {boolean} Whether the given year is active regarding the model or not.
     */
    function isYearActive(year) {
        return year.toString() === moment(_modelController.$viewValue).format('YYYY');
    }

    /**
     * Navigate to next month.
     */
    function nextMonth() {
        _calendar = _calendar.add(1, 'month');

        _generateCalendar();
    }

    /**
     * Open date picker.
     */
    function openDatePicker() {
        LxDatePickerService.open(lx.id);
    }

    /**
     * Navigate to previous month.
     */
    function previousMonth() {
        _calendar = _calendar.subtract(1, 'month');

        _generateCalendar();
    }

    /**
     * Select a given day.
     *
     * @param {Object} day The day to select.
     */
    function selectDay(day) {
        if (day.isDisabled) {
            return;
        }

        _modelController.$setViewValue(day.toDate());
        _calendar = angular.copy(day);

        if (angular.isDefined(lx.cb)) {
            lx.cb({
                newDate: _modelController.$viewValue,
            });
        }

        if (angular.isDefined(_inputModelController) && lx.inputFormat) {
            _inputModelController.$setViewValue(angular.copy(day).format(lx.inputFormat));
            _inputModelController.$render();
        }

        _generateCalendar();
    }

    /**
     * Select a given year.
     *
     * @param {Object} year The year to select.
     */
    function selectYear(year) {
        lx.yearSelection = false;

        _calendar = _calendar.year(year);

        _generateCalendar();
    }

    /**
     * Set the input model controller.
     *
     * @param {Object} inputModelController The input model controller.
     */
    function setInputModelController(inputModelController) {
        _inputModelController = inputModelController;
    }

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;
    }

    /////////////////////////////

    lx.displayYearSelection = displayYearSelection;
    lx.getDayFormatted = getDayFormatted;
    lx.getMonthFormatted = getMonthFormatted;
    lx.getYearFormatted = getYearFormatted;
    lx.hideYearSelection = hideYearSelection;
    lx.isYearActive = isYearActive;
    lx.nextMonth = nextMonth;
    lx.openDatePicker = openDatePicker;
    lx.previousMonth = previousMonth;
    lx.selectDay = selectDay;
    lx.selectYear = selectYear;
    lx.setInputModelController = setInputModelController;
    lx.setModelController = setModelController;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Generate calendar on dialog open.
     *
     * @param {Event}  evt      The dialog open event.
     * @param {string} dialogId The dialog identifier.
     */
    $scope.$on('lx-dialog__open-start', (evt, dialogId) => {
        if (dialogId === lx.id) {
            _generateCalendar();
        }
    });

    /////////////////////////////

    /**
     * Initialize the controller.
     */
    function init() {
        _initCalendar();
    }

    init();
}

/////////////////////////////

function DatePickerDirective($timeout) {
    function link(scope, el, attrs, ctrls, transclude) {
        attrs.$observe('id', (newId) => {
            ctrls[0].id = newId;
        });

        ctrls[0].setModelController(ctrls[1]);

        transclude(scope, (clone) => {
            if (clone.length > 0) {
                ctrls[0].hasInput = true;

                $timeout(() => {
                    const inputModelController = el
                        .find(`.${CSS_PREFIX}-date-picker__input input`)
                        .data('$ngModelController');

                    ctrls[0].setInputModelController(inputModelController);
                });
            }
        });
    }

    return {
        bindToController: true,
        controller: DatePickerController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxDatePicker', 'ngModel'],
        restrict: 'E',
        scope: {
            cb: '&?lxCallback',
            inputFormat: '@?lxInputFormat',
            locale: '@lxLocale',
            maxDate: '=?lxMaxDate',
            minDate: '=?lxMinDate',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.date-picker').directive('lxDatePicker', DatePickerDirective);

/////////////////////////////

export { DatePickerDirective };
