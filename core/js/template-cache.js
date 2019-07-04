angular.module("lumx.dropdown").run(['$templateCache', function(a) { a.put('dropdown.html', '<div class="dropdown"\n' +
    '     ng-class="{ \'dropdown--has-toggle\': lxDropdown.hasToggle,\n' +
    '                 \'dropdown--is-open\': lxDropdown.isOpen }"\n' +
    '     ng-transclude></div>\n' +
    '');
	a.put('dropdown-toggle.html', '<div class="dropdown-toggle" ng-transclude></div>\n' +
    '');
	a.put('dropdown-menu.html', '<div class="dropdown-menu">\n' +
    '    <div class="dropdown-menu__content" ng-transclude ng-if="lxDropdownMenu.parentCtrl.isOpen"></div>\n' +
    '</div>\n' +
    '');
	 }]);
angular.module("lumx.file-input").run(['$templateCache', function(a) { a.put('file-input.html', '<div class="input-file">\n' +
    '    <span class="input-file__label">{{ lxFileInput.label }}</span>\n' +
    '    <span class="input-file__filename">{{ lxFileInput.fileName }}</span>\n' +
    '    <input type="file" class="input-file__input" accept="{{ lxFileInput.accept }}">\n' +
    '</div>\n' +
    '');
	 }]);
angular.module("lumx.text-field").run(['$templateCache', function(a) { a.put('text-field.html', '<div class="text-field"\n' +
    '     ng-class="{ \'text-field--error\': lxTextField.error,\n' +
    '                 \'text-field--fixed-label\': lxTextField.fixedLabel && !lxTextField.hasPlaceholder,\n' +
    '                 \'text-field--has-icon\': lxTextField.icon,\n' +
    '                 \'text-field--has-value\': lxTextField.hasValue(),\n' +
    '                 \'text-field--is-active\': lxTextField.isActive || lxTextField.hasPlaceholder,\n' +
    '                 \'text-field--is-disabled\': lxTextField.ngDisabled,\n' +
    '                 \'text-field--is-focus\': lxTextField.isFocus,\n' +
    '                 \'text-field--theme-light\': !lxTextField.theme || lxTextField.theme === \'light\',\n' +
    '                 \'text-field--theme-dark\': lxTextField.theme === \'dark\',\n' +
    '                 \'text-field--valid\': lxTextField.valid }">\n' +
    '    <div class="text-field__icon" ng-if="lxTextField.icon">\n' +
    '        <i class="mdi mdi-{{ lxTextField.icon }}"></i>\n' +
    '    </div>\n' +
    '\n' +
    '    <label class="text-field__label">\n' +
    '        {{ lxTextField.label }}\n' +
    '    </label>\n' +
    '\n' +
    '    <div ng-transclude></div>\n' +
    '\n' +
    '    <span class="text-field__clear" ng-click="lxTextField.clearInput($event)" ng-if="lxTextField.allowClear">\n' +
    '        <i class="mdi mdi-close-circle"></i>\n' +
    '    </span>\n' +
    '</div>\n' +
    '');
	 }]);
angular.module("lumx.search-filter").run(['$templateCache', function(a) { a.put('search-filter.html', '<div class="search-filter" ng-class="lxSearchFilter.getClass()">\n' +
    '    <div class="search-filter__container">\n' +
    '        <div class="search-filter__button">\n' +
    '            <lx-button type="submit" lx-size="l" lx-color="{{ lxSearchFilter.color }}" lx-type="icon" ng-click="lxSearchFilter.openInput()">\n' +
    '                <i class="mdi mdi-magnify"></i>\n' +
    '            </lx-button>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="search-filter__input" ng-transclude></div>\n' +
    '\n' +
    '        <div class="search-filter__clear">\n' +
    '            <lx-button type="button" lx-size="l" lx-color="{{ lxSearchFilter.color }}" lx-type="icon" ng-click="lxSearchFilter.clearInput()">\n' +
    '                <i class="mdi mdi-close"></i>\n' +
    '            </lx-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="search-filter__loader" ng-if="lxSearchFilter.isLoading">\n' +
    '        <lx-progress lx-type="linear"></lx-progress>\n' +
    '    </div>\n' +
    '\n' +
    '    <lx-dropdown id="{{ lxSearchFilter.dropdownId }}" lx-effect="none" lx-width="100%" ng-if="lxSearchFilter.autocomplete">\n' +
    '        <lx-dropdown-menu class="search-filter__autocomplete-list">\n' +
    '            <ul>\n' +
    '                <li ng-repeat="item in lxSearchFilter.autocompleteList track by $index">\n' +
    '                    <a class="search-filter__autocomplete-item"\n' +
    '                       ng-class="{ \'search-filter__autocomplete-item--is-active\': lxSearchFilter.activeChoiceIndex === $index }"\n' +
    '                       ng-click="lxSearchFilter.selectItem(item)"\n' +
    '                       ng-bind-html="item | lxSearchHighlight:lxSearchFilter.modelController.$viewValue:lxSearchFilter.icon"></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </lx-dropdown-menu>\n' +
    '    </lx-dropdown>\n' +
    '</div>');
	 }]);
angular.module("lumx.select").run(['$templateCache', function(a) { a.put('select.html', '<div class="lx-select"\n' +
    '     ng-class="{ \'lx-select--error\': lxSelect.error,\n' +
    '                 \'lx-select--fixed-label\': lxSelect.fixedLabel && lxSelect.viewMode === \'field\',\n' +
    '                 \'lx-select--is-active\': (!lxSelect.multiple && lxSelect.getSelectedModel()) || (lxSelect.multiple && lxSelect.getSelectedModel().length) || (lxSelect.choicesViewMode === \'panes\' && lxSelect.areChoicesOpened()),\n' +
    '                 \'lx-select--is-disabled\': lxSelect.ngDisabled,\n' +
    '                 \'lx-select--is-multiple\': lxSelect.multiple,\n' +
    '                 \'lx-select--is-unique\': !lxSelect.multiple,\n' +
    '                 \'lx-select--theme-light\': !lxSelect.theme || lxSelect.theme === \'light\',\n' +
    '                 \'lx-select--theme-dark\': lxSelect.theme === \'dark\',\n' +
    '                 \'lx-select--valid\': lxSelect.valid,\n' +
    '                 \'lx-select--custom-style\': lxSelect.customStyle,\n' +
    '                 \'lx-select--default-style\': !lxSelect.customStyle,\n' +
    '                 \'lx-select--view-mode-field\': !lxSelect.multiple || (lxSelect.multiple && lxSelect.viewMode === \'field\'),\n' +
    '                 \'lx-select--view-mode-chips\': lxSelect.multiple && lxSelect.viewMode === \'chips\',\n' +
    '                 \'lx-select--panes\': lxSelect.choicesViewMode === \'panes\',\n' +
    '                 \'lx-select--with-filter\': lxSelect.displayFilter,\n' +
    '                 \'lx-select--autocomplete\': lxSelect.autocomplete }">\n' +
    '    <span class="lx-select-label" ng-if="!lxSelect.autocomplete">\n' +
    '        {{ lxSelect.label }}\n' +
    '    </span>\n' +
    '\n' +
    '    <lx-dropdown id="dropdown-{{ lxSelect.uuid }}" lx-width="{{ (lxSelect.choicesViewMode === \'panes\') ? \'\' : \'100%\' }}"\n' +
    '                 lx-effect="{{ lxSelect.autocomplete ? \'none\' : \'expand\' }}">\n' +
    '        <ng-transclude></ng-transclude>\n' +
    '    </lx-dropdown>\n' +
    '</div>\n' +
    '');
	a.put('select-selected.html', '<div>\n' +
    '    <lx-dropdown-toggle ng-if="::!lxSelectSelected.parentCtrl.autocomplete">\n' +
    '        <ng-include src="\'select-selected-content.html\'"></ng-include>\n' +
    '    </lx-dropdown-toggle>\n' +
    '\n' +
    '    <ng-include src="\'select-selected-content.html\'" ng-if="::lxSelectSelected.parentCtrl.autocomplete"></ng-include>\n' +
    '</div>\n' +
    '');
	a.put('select-selected-content.html', '<div class="lx-select-selected-wrapper"\n' +
    '     ng-class="{ \'lx-select-selected-wrapper--with-filter\': !lxSelectSelected.parentCtrl.ngDisabled && lxSelectSelected.parentCtrl.areChoicesOpened() && (lxSelectSelected.parentCtrl.multiple || !lxSelectSelected.parentCtrl.getSelectedModel()) }"\n' +
    '     id="lx-select-selected-wrapper-{{ lxSelectSelected.parentCtrl.uuid }}">\n' +
    '    <div class="lx-select-selected"\n' +
    '         ng-if="!lxSelectSelected.parentCtrl.multiple">\n' +
    '        <span class="lx-select-selected__value"\n' +
    '              ng-bind-html="lxSelectSelected.parentCtrl.displaySelected()"\n' +
    '              ng-if="lxSelectSelected.parentCtrl.getSelectedModel()"></span>\n' +
    '\n' +
    '        <a class="lx-select-selected__clear"\n' +
    '           ng-click="lxSelectSelected.clearModel($event)"\n' +
    '           ng-if="lxSelectSelected.parentCtrl.allowClear && lxSelectSelected.parentCtrl.getSelectedModel()">\n' +
    '            <i class="mdi mdi-close-circle"></i>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-select-selected" ng-if="lxSelectSelected.parentCtrl.multiple">\n' +
    '        <span class="lx-select-selected__tag"\n' +
    '              ng-class="{ \'lx-select-selected__tag--is-active\': lxSelectSelected.parentCtrl.activeSelectedIndex === $index }"\n' +
    '              ng-click="lxSelectSelected.removeSelected(selected, $event)"\n' +
    '              ng-repeat="selected in lxSelectSelected.parentCtrl.getSelectedModel()"\n' +
    '              ng-bind-html="lxSelectSelected.parentCtrl.displaySelected(selected)"></span>\n' +
    '\n' +
    '        <input type="text"\n' +
    '               placeholder="{{ ::lxSelectSelected.parentCtrl.label }}"\n' +
    '               class="lx-select-selected__filter"\n' +
    '               ng-model="lxSelectSelected.parentCtrl.filterModel"\n' +
    '               ng-change="lxSelectSelected.parentCtrl.updateFilter()"\n' +
    '               ng-keydown="lxSelectSelected.parentCtrl.keyEvent($event)"\n' +
    '               ng-if="lxSelectSelected.parentCtrl.autocomplete && !lxSelectSelected.parentCtrl.ngDisabled">\n' +
    '    </div>\n' +
    '\n' +
    '    <lx-search-filter lx-dropdown-filter class="lx-select-selected__filter" ng-if="lxSelectSelected.parentCtrl.choicesViewMode === \'panes\' && !lxSelectSelected.parentCtrl.ngDisabled && lxSelectSelected.parentCtrl.areChoicesOpened() && (lxSelectSelected.parentCtrl.multiple || !lxSelectSelected.parentCtrl.getSelectedModel())">\n' +
    '        <input type="text"\n' +
    '               ng-model="lxSelectSelected.parentCtrl.filterModel"\n' +
    '               ng-change="lxSelectSelected.parentCtrl.updateFilter()"\n' +
    '               lx-stop-propagation="click">\n' +
    '    </lx-search-filter>\n' +
    '</div>\n' +
    '');
	a.put('select-choices.html', '<lx-dropdown-menu class="lx-select-choices"\n' +
    '                  ng-class="{ \'lx-select-choices--custom-style\': lxSelectChoices.parentCtrl.choicesCustomStyle,\n' +
    '                              \'lx-select-choices--default-style\': !lxSelectChoices.parentCtrl.choicesCustomStyle,\n' +
    '                              \'lx-select-choices--is-multiple\': lxSelectChoices.parentCtrl.multiple,\n' +
    '                              \'lx-select-choices--is-unique\': !lxSelectChoices.parentCtrl.multiple,\n' +
    '                              \'lx-select-choices--list\': lxSelectChoices.parentCtrl.choicesViewMode === \'list\',\n' +
    '                              \'lx-select-choices--multi-panes\': lxSelectChoices.parentCtrl.choicesViewMode === \'panes\' }">\n' +
    '    <ul ng-if="::lxSelectChoices.parentCtrl.choicesViewMode === \'list\'">\n' +
    '        <li class="lx-select-choices__filter" ng-if="::lxSelectChoices.parentCtrl.displayFilter && !lxSelectChoices.parentCtrl.autocomplete">\n' +
    '            <lx-search-filter lx-dropdown-filter>\n' +
    '                <input type="text" ng-model="lxSelectChoices.parentCtrl.filterModel" ng-change="lxSelectChoices.parentCtrl.updateFilter()">\n' +
    '            </lx-search-filter>\n' +
    '        </li>\n' +
    '        \n' +
    '        <div ng-if="::lxSelectChoices.isArray()">\n' +
    '            <li class="lx-select-choices__choice"\n' +
    '                ng-class="{ \'lx-select-choices__choice--is-selected\': lxSelectChoices.parentCtrl.isSelected(choice),\n' +
    '                            \'lx-select-choices__choice--is-disabled\': !lxSelectChoices.parentCtrl.isSelected(choice) && lxSelectChoices.parentCtrl.isMaxSelected(),\n' +
    '                            \'lx-select-choices__choice--is-focus\': lxSelectChoices.parentCtrl.activeChoiceIndex === $index }"\n' +
    '                ng-repeat="choice in lxSelectChoices.parentCtrl.choices | filterChoices:lxSelectChoices.parentCtrl.filter:lxSelectChoices.parentCtrl.filterModel"\n' +
    '                ng-bind-html="::lxSelectChoices.parentCtrl.displayChoice(choice)"\n' +
    '                ng-click="lxSelectChoices.parentCtrl.toggleChoice(choice, $event)"></li>\n' +
    '        </div>\n' +
    '\n' +
    '        <div ng-if="::!lxSelectChoices.isArray()">\n' +
    '            <li class="lx-select-choices__subheader"\n' +
    '                ng-repeat-start="(subheader, children) in lxSelectChoices.parentCtrl.choices"\n' +
    '                ng-bind-html="::lxSelectChoices.parentCtrl.displaySubheader(subheader)"></li>\n' +
    '\n' +
    '            <li class="lx-select-choices__choice"\n' +
    '                ng-class="{ \'lx-select-choices__choice--is-selected\': lxSelectChoices.parentCtrl.isSelected(choice),\n' +
    '                            \'lx-select-choices__choice--is-focus\': lxSelectChoices.parentCtrl.activeChoiceIndex === $index }"\n' +
    '                ng-repeat-end\n' +
    '                ng-repeat="choice in children | filterChoices:lxSelectChoices.parentCtrl.filter:lxSelectChoices.parentCtrl.filterModel"\n' +
    '                ng-bind-html="::lxSelectChoices.parentCtrl.displayChoice(choice)"\n' +
    '                ng-click="lxSelectChoices.parentCtrl.toggleChoice(choice, $event)"></li>\n' +
    '        </div>\n' +
    '\n' +
    '        <li class="lx-select-choices__subheader" ng-if="lxSelectChoices.parentCtrl.helperDisplayable()">\n' +
    '            {{ lxSelectChoices.parentCtrl.helperMessage }}\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '\n' +
    '    <div class="lx-select-choices__panes-wrapper" ng-if="lxSelectChoices.parentCtrl.choicesViewMode === \'panes\' && lxSelectChoices.parentCtrl.choicesViewSize === \'large\'" lx-stop-propagation="click">\n' +
    '        <div class="lx-select-choices__loader" ng-if="lxSelectChoices.parentCtrl.loading">\n' +
    '            <lx-progress lx-type="circular" lx-color="white" lx-diameter="60"></lx-progress>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="lx-select-choices__panes-container" ng-if="!lxSelectChoices.parentCtrl.loading">\n' +
    '            <div class="lx-select-choices__pane lx-select-choices__pane-{{ $index }}"\n' +
    '                 ng-class="{ \'lx-select-choices__pane--is-filtering\': lxSelectChoices.parentCtrl.matchingPaths !== undefined,\n' +
    '                             \'lx-select-choices__pane--first\': $first,\n' +
    '                             \'lx-select-choices__pane--last\': $last }"\n' +
    '                 ng-repeat="pane in lxSelectChoices.parentCtrl.panes">\n' +
    '                <div ng-repeat="(label, items) in pane"\n' +
    '                   class="lx-select-choices__pane-choice"\n' +
    '                   ng-class="{ \'lx-select-choices__pane-choice--is-selected\': lxSelectChoices.parentCtrl.isPaneToggled($parent.$index, label) || lxSelectChoices.parentCtrl.isSelected(items) || ($parent.$last && lxSelectChoices.parentCtrl.activeChoiceIndex === $index),\n' +
    '                               \'lx-select-choices__pane-choice--is-matching\': lxSelectChoices.parentCtrl.isMatchingPath($parent.$index, label),\n' +
    '                               \'lx-select-choices__pane-choice--is-leaf\': lxSelectChoices.isArray(pane) }"\n' +
    '                   ng-bind-html="(lxSelectChoices.isArray(pane)) ? lxSelectChoices.parentCtrl.displayChoice(items) : lxSelectChoices.parentCtrl.displaySubheader(label)"\n' +
    '                   ng-click="lxSelectChoices.parentCtrl.togglePane($event, $parent.$index, label, true)">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-select-choices__panes-wrapper" ng-if="lxSelectChoices.parentCtrl.choicesViewMode === \'panes\' && lxSelectChoices.parentCtrl.choicesViewSize === \'small\'" lx-stop-propagation="click">\n' +
    '        <div class="lx-select-choices__loader" ng-if="lxSelectChoices.parentCtrl.loading">\n' +
    '            <lx-progress lx-type="circular" lx-color="white" lx-diameter="60"></lx-progress>\n' +
    '        </div>\n' +
    '        <div class="lx-select-choices__panes-container" ng-if="!lxSelectChoices.parentCtrl.loading">\n' +
    '            <div class="lx-select-choices__pane lx-select-choices__pane"\n' +
    '                ng-class="{ \'lx-select-choices__pane--is-filtering\': lxSelectChoices.parentCtrl.matchingPaths !== undefined,\n' +
    '                            \'lx-select-choices__pane--first\': $first,\n' +
    '                            \'lx-select-choices__pane--last\': $last }"\n' +
    '                ng-repeat="pane in lxSelectChoices.parentCtrl.panes">\n' +
    '                <div ng-include="\'select-choices-accordion.html\'" ng-init="level = 0"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <lx-progress lx-type="linear" lx-color="primary" ng-if="lxSelectChoices.parentCtrl.loading"></lx-progress>\n' +
    '</lx-dropdown-menu>\n' +
    '');
	a.put('select-choices-accordion.html', '<div ng-repeat="(label, items) in pane">\n' +
    '    <div class="lx-select-choices__pane-choice lx-select-choices__pane-{{ level }}"\n' +
    '         ng-class="{ \'lx-select-choices__pane-choice--is-selected\': lxSelectChoices.parentCtrl.isPaneToggled(level, label) || lxSelectChoices.parentCtrl.isSelected(items),\n' +
    '                \'lx-select-choices__pane-choice--is-matching\': lxSelectChoices.parentCtrl.isMatchingPath(level, label),\n' +
    '                \'lx-select-choices__pane-choice--is-leaf\': lxSelectChoices.isArray(pane) }"\n' +
    '         ng-bind-html="(lxSelectChoices.isArray(pane)) ? lxSelectChoices.parentCtrl.displayChoice(items) : lxSelectChoices.parentCtrl.displaySubheader(label)"\n' +
    '         ng-click="lxSelectChoices.parentCtrl.togglePane($event, level, label, true)"></div>\n' +
    '\n' +
    '    <div ng-include="\'select-choices-accordion.html\'"\n' +
    '         ng-if="!lxSelectChoices.isArray(pane) && lxSelectChoices.parentCtrl.isPaneToggled(level,label)"\n' +
    '         ng-init="pane = items; level = level + 1"></div>\n' +
    '</div>\n' +
    '');
	 }]);
angular.module("lumx.tabs").run(['$templateCache', function(a) { a.put('tabs.html', '<div class="tabs tabs--layout-{{ lxTabs.layout }} tabs--theme-{{ lxTabs.theme }} tabs--color-{{ lxTabs.color }} tabs--indicator-{{ lxTabs.indicator }}">\n' +
    '    <div class="tabs__panes" ng-if="lxTabs.viewMode === \'gather\' && lxTabs.bottomPosition" ng-transclude></div>\n' +
    '    <div class="tabs__links">\n' +
    '        <a class="tabs__link"\n' +
    '           ng-class="{ \'tabs__link--is-active\': lxTabs.tabIsActive(tab.index),\n' +
    '                       \'tabs__link--is-disabled\': tab.disabled }"\n' +
    '           ng-repeat="tab in lxTabs.tabs"\n' +
    '           ng-click="lxTabs.setActiveTab(tab)"\n' +
    '           lx-ripple>\n' +
    '           <i class="mdi mdi-{{ tab.icon }}" ng-if="tab.icon"></i>\n' +
    '           <span ng-if="tab.label">{{ tab.label }}</span>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="tabs__panes" ng-if="lxTabs.viewMode === \'gather\' && !lxTabs.bottomPosition" ng-transclude></div>\n' +
    '    <div class="tabs__indicator" ng-class="{\'tabs__indicator--top\': !lxTabs.bottomPosition, \'tabs__indicator--bottom\': lxTabs.bottomPosition}"></div>\n' +
    '</div>\n' +
    '');
	a.put('tabs-panes.html', '<div class="tabs tabs--separate">\n' +
    '    <div class="tabs__panes" ng-transclude></div>\n' +
    '</div>');
	a.put('tab.html', '<div class="tabs__pane" ng-class="{ \'tabs__pane--is-disabled\': lxTab.ngDisabled }">\n' +
    '    <div ng-if="lxTab.tabIsActive()" ng-transclude></div>\n' +
    '</div>\n' +
    '');
	a.put('tab-pane.html', '<div class="tabs__pane" ng-transclude></div>\n' +
    '');
	 }]);
angular.module("lumx.date-picker").run(['$templateCache', function(a) { a.put('date-picker.html', '<div class="lx-date">\n' +
    '    <!-- Date picker input -->\n' +
    '    <div class="lx-date-input" ng-click="lxDatePicker.openDatePicker()" ng-if="lxDatePicker.hasInput">\n' +
    '        <ng-transclude></ng-transclude>\n' +
    '    </div>\n' +
    '    \n' +
    '    <!-- Date picker -->\n' +
    '    <div class="lx-date-picker lx-date-picker--{{ lxDatePicker.color }}">\n' +
    '        <div ng-if="lxDatePicker.isOpen">\n' +
    '            <!-- Date picker: header -->\n' +
    '            <div class="lx-date-picker__header">\n' +
    '                <a class="lx-date-picker__current-year"\n' +
    '                   ng-class="{ \'lx-date-picker__current-year--is-active\': lxDatePicker.yearSelection }"\n' +
    '                   ng-click="lxDatePicker.displayYearSelection()">\n' +
    '                    {{ lxDatePicker.moment(lxDatePicker.ngModel).format(\'YYYY\') }}\n' +
    '                </a>\n' +
    '\n' +
    '                <a class="lx-date-picker__current-date"\n' +
    '                   ng-class="{ \'lx-date-picker__current-date--is-active\': !lxDatePicker.yearSelection }"\n' +
    '                   ng-click="lxDatePicker.hideYearSelection()">\n' +
    '                    {{ lxDatePicker.getDateFormatted() }}\n' +
    '                </a>\n' +
    '            </div>\n' +
    '            \n' +
    '            <!-- Date picker: content -->\n' +
    '            <div class="lx-date-picker__content">\n' +
    '                <!-- Calendar -->\n' +
    '                <div class="lx-date-picker__calendar" ng-if="!lxDatePicker.yearSelection">\n' +
    '                    <div class="lx-date-picker__nav">\n' +
    '                        <lx-button lx-size="l" lx-color="black" lx-type="icon" ng-click="lxDatePicker.previousMonth()">\n' +
    '                            <i class="mdi mdi-chevron-left"></i>\n' +
    '                        </lx-button>\n' +
    '\n' +
    '                        <span>{{ lxDatePicker.ngModelMoment.format(\'MMMM YYYY\') }}</span>\n' +
    '                        \n' +
    '                        <lx-button lx-size="l" lx-color="black" lx-type="icon" ng-click="lxDatePicker.nextMonth()">\n' +
    '                            <i class="mdi mdi-chevron-right"></i>\n' +
    '                        </lx-button>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="lx-date-picker__days-of-week">\n' +
    '                        <span ng-repeat="day in lxDatePicker.daysOfWeek">{{ day }}</span>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <div class="lx-date-picker__days">\n' +
    '                        <span class="lx-date-picker__day lx-date-picker__day--is-empty"\n' +
    '                              ng-repeat="x in lxDatePicker.emptyFirstDays">&nbsp;</span>\n' +
    '\n' +
    '                        <div class="lx-date-picker__day"\n' +
    '                             ng-class="{ \'lx-date-picker__day--is-selected\': day.selected,\n' +
    '                                         \'lx-date-picker__day--is-today\': day.today && !day.selected,\n' +
    '                                         \'lx-date-picker__day--is-disabled\': day.disabled }"\n' +
    '                             ng-repeat="day in lxDatePicker.days">\n' +
    '                            <a ng-click="lxDatePicker.select(day)">{{ day ? day.format(\'D\') : \'\' }}</a>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <span class="lx-date-picker__day lx-date-picker__day--is-empty"\n' +
    '                              ng-repeat="x in lxDatePicker.emptyLastDays">&nbsp;</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Year selection -->\n' +
    '                <div class="lx-date-picker__year-selector" ng-if="lxDatePicker.yearSelection">\n' +
    '                    <a class="lx-date-picker__year"\n' +
    '                         ng-class="{ \'lx-date-picker__year--is-active\': year == lxDatePicker.moment(lxDatePicker.ngModel).format(\'YYYY\') }"\n' +
    '                         ng-repeat="year in lxDatePicker.years"\n' +
    '                         ng-click="lxDatePicker.selectYear(year)"\n' +
    '                         ng-if="lxDatePicker.yearSelection">\n' +
    '                        {{ year }}\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Actions -->\n' +
    '            <div class="lx-date-picker__actions">\n' +
    '                <lx-button lx-color="{{ lxDatePicker.color }}" lx-type="flat" ng-click="lxDatePicker.closeDatePicker()">\n' +
    '                    Ok\n' +
    '                </lx-button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
	 }]);
angular.module("lumx.progress").run(['$templateCache', function(a) { a.put('progress.html', '<div class="progress-container progress-container--{{ lxProgress.lxType }} progress-container--{{ lxProgress.lxColor }} {{ lxProgress.lxClass }}">\n' +
    '    <div class="progress-circular"\n' +
    '         ng-if="lxProgress.lxType === \'circular\'"\n' +
    '         ng-style="lxProgress.getProgressDiameter()">\n' +
    '        <svg class="progress-circular__svg">\n' +
    '            <g transform="translate(50 50)">\n' +
    '                <g class="progress-circular__g">\n' +
    '                    <circle class="progress-circular__path" cx="0" cy="0" r="20" fill="none" stroke-width="4" stroke-miterlimit="10" ng-style="lxProgress.getCircularProgressValue()"></circle>\n' +
    '                </g>\n' +
    '            </g>\n' +
    '        </svg>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="progress-linear" ng-if="lxProgress.lxType === \'linear\'">\n' +
    '        <div class="progress-linear__background"></div>\n' +
    '        <div class="progress-linear__bar progress-linear__bar--first" ng-style="lxProgress.getLinearProgressValue()"></div>\n' +
    '        <div class="progress-linear__bar progress-linear__bar--second"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
	 }]);
angular.module("lumx.button").run(['$templateCache', function(a) { a.put('link.html', '<a ng-transclude lx-ripple></a>\n' +
    '');
	a.put('button.html', '<button ng-transclude lx-ripple></button>\n' +
    '');
	 }]);
angular.module("lumx.checkbox").run(['$templateCache', function(a) { a.put('checkbox.html', '<div class="checkbox checkbox--{{ lxCheckbox.lxColor }}"\n' +
    '     ng-class="{ \'checkbox--theme-light\': !lxCheckbox.lxTheme || lxCheckbox.lxTheme === \'light\',\n' +
    '                 \'checkbox--theme-dark\': lxCheckbox.lxTheme === \'dark\' }">\n' +
    '    <input id="{{ lxCheckbox.getCheckboxId() }}"\n' +
    '           type="checkbox"\n' +
    '           class="checkbox__input"\n' +
    '           name="{{ lxCheckbox.name }}"\n' +
    '           ng-model="lxCheckbox.ngModel"\n' +
    '           ng-true-value="{{ lxCheckbox.ngTrueValue }}"\n' +
    '           ng-false-value="{{ lxCheckbox.ngFalseValue }}"\n' +
    '           ng-change="lxCheckbox.triggerNgChange()"\n' +
    '           ng-disabled="lxCheckbox.ngDisabled">\n' +
    '    <label for="{{ lxCheckbox.getCheckboxId() }}" class="checkbox__label" ng-transclude ng-if="!lxCheckbox.getCheckboxHasChildren()"></label>\n' +
    '    <ng-transclude-replace ng-if="lxCheckbox.getCheckboxHasChildren()"></ng-transclude-replace>\n' +
    '</div>\n' +
    '');
	a.put('checkbox-label.html', '<label for="{{ lxCheckboxLabel.getCheckboxId() }}" class="checkbox__label" ng-transclude></label>\n' +
    '');
	a.put('checkbox-help.html', '<span class="checkbox__help" ng-transclude></span>\n' +
    '');
	 }]);
angular.module("lumx.radio-button").run(['$templateCache', function(a) { a.put('radio-group.html', '<div class="radio-group" ng-transclude></div>\n' +
    '');
	a.put('radio-button.html', '<div class="radio-button radio-button--{{ lxRadioButton.lxColor }}"\n' +
    '     ng-class="{ \'radio-button--theme-light\': !lxRadioButton.lxTheme || lxRadioButton.lxTheme === \'light\',\n' +
    '                 \'radio-button--theme-dark\': lxRadioButton.lxTheme === \'dark\' }">\n' +
    '    <input id="{{ lxRadioButton.getRadioButtonId() }}"\n' +
    '           type="radio"\n' +
    '           class="radio-button__input"\n' +
    '           name="{{ lxRadioButton.name }}"\n' +
    '           ng-model="lxRadioButton.ngModel"\n' +
    '           ng-value="lxRadioButton.ngValue"\n' +
    '           ng-change="lxRadioButton.triggerNgChange()"\n' +
    '           ng-disabled="lxRadioButton.ngDisabled">\n' +
    '    <label for="{{ lxRadioButton.getRadioButtonId() }}" class="radio-button__label" ng-transclude ng-if="!lxRadioButton.getRadioButtonHasChildren()"></label>\n' +
    '    <ng-transclude-replace ng-if="lxRadioButton.getRadioButtonHasChildren()"></ng-transclude-replace>\n' +
    '</div>\n' +
    '');
	a.put('radio-button-label.html', '<label for="{{ lxRadioButtonLabel.getRadioButtonId() }}" class="radio-button__label" ng-transclude></label>\n' +
    '');
	a.put('radio-button-help.html', '<span class="radio-button__help" ng-transclude></span>\n' +
    '');
	 }]);
angular.module("lumx.stepper").run(['$templateCache', function(a) { a.put('stepper.html', '<div class="lx-stepper" ng-class="lxStepper.getClasses()">\n' +
    '    <div class="lx-stepper__header" ng-if="lxStepper.layout === \'horizontal\'">\n' +
    '        <div class="lx-stepper__nav">\n' +
    '            <lx-step-nav lx-active-index="{{ lxStepper.activeIndex }}" lx-step="step" ng-repeat="step in lxStepper.steps"></lx-step-nav>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="lx-stepper__feedback" ng-if="lxStepper.steps[lxStepper.activeIndex].feedback">\n' +
    '            <span>{{ lxStepper.steps[lxStepper.activeIndex].feedback }}</span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-stepper__steps" ng-transclude></div>\n' +
    '</div>');
	a.put('step.html', '<div class="lx-step" ng-class="lxStep.getClasses()">\n' +
    '    <div class="lx-step__nav" ng-if="lxStep.parent.layout === \'vertical\'">\n' +
    '        <lx-step-nav lx-active-index="{{ lxStep.parent.activeIndex }}" lx-step="lxStep.step"></lx-step-nav>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-step__wrapper" ng-if="lxStep.parent.activeIndex === lxStep.step.index">\n' +
    '        <div class="lx-step__content">\n' +
    '            <ng-transclude></ng-transclude>\n' +
    '\n' +
    '            <div class="lx-step__progress" ng-if="lxStep.step.isLoading">\n' +
    '                <lx-progress lx-type="circular"></lx-progress>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="lx-step__actions" ng-if="lxStep.parent.activeIndex === lxStep.step.index && lxStep.parent.controls">\n' +
    '            <div class="lx-step__action lx-step__action--continue">\n' +
    '                <lx-button ng-click="lxStep.submitStep()" ng-disabled="lxStep.isLoading">{{ lxStep.parent.labels.continue }}</lx-button>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="lx-step__action lx-step__action--cancel" ng-if="lxStep.parent.cancel">\n' +
    '                <lx-button lx-color="black" lx-type="flat" ng-click="lxStep.parent.cancel()" ng-disabled="lxStep.isLoading">{{ lxStep.parent.labels.cancel }}</lx-button>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="lx-step__action lx-step__action--back" ng-if="lxStep.parent.isLinear">\n' +
    '                <lx-button lx-color="black" lx-type="flat" ng-click="lxStep.previousStep()" ng-disabled="lxStep.isLoading || lxStep.step.index === 0">{{ lxStep.parent.labels.back }}</lx-button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
	a.put('step-nav.html', '<div class="lx-step-nav" ng-click="lxStepNav.parent.goToStep(lxStepNav.step.index)" ng-class="lxStepNav.getClasses()" lx-ripple>\n' +
    '    <div class="lx-step-nav__indicator lx-step-nav__indicator--index" ng-if="lxStepNav.step.isValid === undefined">\n' +
    '        <span>{{ lxStepNav.step.index + 1 }}</span>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-step-nav__indicator lx-step-nav__indicator--icon" ng-if="lxStepNav.step.isValid === true">\n' +
    '        <lx-icon lx-id="check" ng-if="!lxStepNav.step.isEditable"></lx-icon>\n' +
    '        <lx-icon lx-id="pencil" ng-if="lxStepNav.step.isEditable"></lx-icon>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-step-nav__indicator lx-step-nav__indicator--error" ng-if="lxStepNav.step.isValid === false">\n' +
    '        <lx-icon lx-id="alert"></lx-icon>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="lx-step-nav__wrapper">\n' +
    '        <div class="lx-step-nav__label">\n' +
    '            <span>{{ lxStepNav.step.label }}</span>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="lx-step-nav__state">\n' +
    '            <span ng-if="(lxStepNav.step.isValid === undefined || lxStepNav.step.isValid === true) && lxStepNav.step.isOptional">{{ lxStepNav.parent.labels.optional }}</span>\n' +
    '            <span ng-if="lxStepNav.step.isValid === false">{{ lxStepNav.step.errorMessage }}</span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
	 }]);
angular.module("lumx.switch").run(['$templateCache', function(a) { a.put('switch.html', '<div class="switch switch--{{ lxSwitch.lxColor }} switch--{{ lxSwitch.lxPosition }}"\n' +
    '     ng-class="{ \'switch--theme-light\': !lxSwitch.lxTheme || lxSwitch.lxTheme === \'light\',\n' +
    '                 \'switch--theme-dark\': lxSwitch.lxTheme === \'dark\' }">\n' +
    '    <input id="{{ lxSwitch.getSwitchId() }}"\n' +
    '           type="checkbox"\n' +
    '           class="switch__input"\n' +
    '           name="{{ lxSwitch.name }}"\n' +
    '           ng-model="lxSwitch.ngModel"\n' +
    '           ng-true-value="{{ lxSwitch.ngTrueValue }}"\n' +
    '           ng-false-value="{{ lxSwitch.ngFalseValue }}"\n' +
    '           ng-change="lxSwitch.triggerNgChange()"\n' +
    '           ng-disabled="lxSwitch.ngDisabled">\n' +
    '\n' +
    '    <label for="{{ lxSwitch.getSwitchId() }}" class="switch__label" ng-transclude ng-if="!lxSwitch.getSwitchHasChildren()"></label>\n' +
    '    <ng-transclude-replace ng-if="lxSwitch.getSwitchHasChildren()"></ng-transclude-replace>\n' +
    '</div>\n' +
    '');
	a.put('switch-label.html', '<label for="{{ lxSwitchLabel.getSwitchId() }}" class="switch__label" ng-transclude></label>\n' +
    '');
	a.put('switch-help.html', '<span class="switch__help" ng-transclude></span>\n' +
    '');
	 }]);
angular.module("lumx.fab").run(['$templateCache', function(a) { a.put('fab.html', '<div class="fab"\n' +
    '     ng-class="{ \'lx-fab--trigger-on-hover\': !lxFab.lxTriggerOnClick,\n' +
    '                 \'lx-fab--trigger-on-click\': lxFab.lxTriggerOnClick,\n' +
    '                 \'lx-fab--is-open\': lxFab.lxTriggerOnClick && lxFab.isOpen,\n' +
    '                 \'lx-fab--is-close\': lxFab.lxTriggerOnClick && !lxFab.isOpen }"\n' +
    '     ng-click="lxFab.toggleState()">\n' +
    '    <ng-transclude-replace></ng-transclude-replace>\n' +
    '</div>\n' +
    '');
	a.put('fab-trigger.html', '<div class="fab__primary" ng-transclude></div>\n' +
    '');
	a.put('fab-actions.html', '<div class="fab__actions fab__actions--{{ parentCtrl.lxDirection }}" ng-transclude></div>\n' +
    '');
	 }]);
angular.module("lumx.icon").run(['$templateCache', function(a) { a.put('icon.html', '<i class="icon mdi" ng-class="lxIcon.getClass()"></i>');
	 }]);
angular.module("lumx.data-table").run(['$templateCache', function(a) { a.put('data-table.html', '<div class="data-table-container">\n' +
    '    <table class="data-table"\n' +
    '           ng-class="{ \'data-table--bulk\': lxDataTable.bulk,\n' +
    '                       \'data-table--border\': lxDataTable.border,\n' +
    '                       \'data-table--thumbnail\': lxDataTable.thumbnail }">\n' +
    '        <thead>\n' +
    '            <tr ng-class="{ \'data-table__selectable-row\': lxDataTable.selectable,\n' +
    '                            \'data-table__selectable-row--is-selected\': lxDataTable.selectable && lxDataTable.allRowsSelected, }">\n' +
    '                <th align="center" ng-if="lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ lxDataTable.allRowsSelected ? \'accent\' : \'grey\' }}"\n' +
    '                               ng-click="lxDataTable.toggleAllSelected()"\n' +
    '                               ng-if="lxDataTable.selectable">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </th>\n' +
    '                <th align="center" ng-if="lxDataTable.selectable && !lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ lxDataTable.allRowsSelected ? \'accent\' : \'grey\' }}"\n' +
    '                               ng-click="lxDataTable.toggleAllSelected()">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </th>\n' +
    '                <th align="left"\n' +
    '                    ng-class=" { \'data-table__sortable-cell\': th.sortable,\n' +
    '                                 \'data-table__sortable-cell--asc\': th.sortable && th.sort === \'asc\',\n' +
    '                                 \'data-table__sortable-cell--desc\': th.sortable && th.sort === \'desc\' }"\n' +
    '                    ng-click="lxDataTable.sort(th)"\n' +
    '                    ng-repeat="th in lxDataTable.thead track by $index"\n' +
    '                    ng-if="!lxDataTable.thumbnail || (lxDataTable.thumbnail && $index != 0)">\n' +
    '                    <lx-icon lx-id="{{ th.icon }}" ng-if="th.icon"></lx-icon>\n' +
    '                    <span>{{ th.label }}</span>\n' +
    '                </th>\n' +
    '            </tr>\n' +
    '        </thead>\n' +
    '\n' +
    '        <tbody>\n' +
    '            <tr ng-class="{ \'data-table__selectable-row\': lxDataTable.selectable,\n' +
    '                            \'data-table__selectable-row--is-disabled\': lxDataTable.selectable && tr.lxDataTableDisabled,\n' +
    '                            \'data-table__selectable-row--is-selected\': lxDataTable.selectable && tr.lxDataTableSelected,\n' +
    '                            \'data-table__activable-row\': lxDataTable.activable,\n' +
    '                            \'data-table__activable-row--is-activated\': lxDataTable.activable && tr.lxDataTableActivated }"\n' +
    '                ng-repeat="tr in lxDataTable.tbody"\n' +
    '                ng-click="lxDataTable.toggleActivation(tr)">\n' +
    '                <td align="center" ng-if="lxDataTable.thumbnail">\n' +
    '                    <div class="data-table__thumbnail" ng-if="lxDataTable.thead[0].format" ng-bind-html="lxDataTable.$sce.trustAsHtml(lxDataTable.thead[0].format(tr))"></div>\n' +
    '\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ tr.lxDataTableSelected ? \'accent\' : \'black\' }}"\n' +
    '                               ng-click="lxDataTable.toggleSelection(tr, undefined, $event)"\n' +
    '                               ng-if="lxDataTable.selectable && !tr.lxDataTableDisabled">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!tr.lxDataTableSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="tr.lxDataTableSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </td>\n' +
    '                <td align="center" ng-if="lxDataTable.selectable && !lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ tr.lxDataTableSelected ? \'accent\' : \'black\' }}"\n' +
    '                               ng-click="lxDataTable.toggleSelection(tr, undefined, $event)"\n' +
    '                               ng-disabled="tr.lxDataTableDisabled">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!tr.lxDataTableSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="tr.lxDataTableSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </td>\n' +
    '                <td align="left"\n' +
    '                    ng-repeat="th in lxDataTable.thead track by $index"\n' +
    '                    ng-if="!lxDataTable.thumbnail || (lxDataTable.thumbnail && $index != 0)">\n' +
    '                    <span ng-if="!th.format">{{ tr[th.name] }}</span>\n' +
    '                    <div ng-if="th.format" ng-bind-html="lxDataTable.$sce.trustAsHtml(th.format(tr))"></div>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '    </table>\n' +
    '</div>');
	 }]);
