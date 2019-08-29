import { CSS_PREFIX, ESCAPE_KEY_CODE } from '@lumx/core/js/constants';

import template from '../views/dropdown.html';

/////////////////////////////

function DropdownController(
    $document,
    $rootScope,
    $scope,
    $timeout,
    $window,
    LxDepthService,
    LxDropdownService,
    LxEventSchedulerService,
    LxUtilsService,
) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Offset from the edge of the view port if dropdown is higher.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _OFFSET_FROM_EDGE = 16;

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    // eslint-disable-next-line one-var
    let _idEventScheduler;

    /**
     * The menu element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _menuEl;

    /**
     * The source element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _sourceEl;

    /**
     * The toggle element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _toggleEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has toggle slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasToggle = false;

    /**
     * Whether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lx.isOpen = false;

    /**
     * The dropdown uuid.
     *
     * @type {string}
     */
    lx.uuid = LxUtilsService.generateUUID();

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close dropdown on document click.
     */
    function _onDocumentClick() {
        LxDropdownService.closeActiveDropdown(true);
    }

    /**
     * Check if user has scrolled to the end of the dropdown.
     */
    function _checkScrollEnd() {
        if (_menuEl.scrollTop() + _menuEl.innerHeight() >= _menuEl[0].scrollHeight) {
            $rootScope.$broadcast('lx-dropdown__scroll-end', lx.uuid);
        }
    }

    /**
     * Close dropdown.
     */
    function _close() {
        lx.isOpen = false;

        LxDropdownService.unregisterDropdownId(lx.uuid);

        LxUtilsService.restoreBodyScroll();

        $timeout(() => {
            _menuEl
                .removeAttr('style')
                .hide()
                .insertAfter(_toggleEl);

            if (angular.isUndefined(lx.escapeClose) || lx.escapeClose) {
                LxEventSchedulerService.unregister(_idEventScheduler);
                _idEventScheduler = undefined;
            }

            _menuEl.off('scroll', _checkScrollEnd);
            $document.off('click keydown keypress', _onDocumentClick);

            if (angular.isDefined(_sourceEl)) {
                _sourceEl.focus();
            }
        });
    }

    /**
     * Get available height.
     *
     * @return {Object} Available height on top / bottom.
     */
    function _getAvailableHeight() {
        const availaibleHeight = {};
        const toggleProps = {
            height: _toggleEl.outerHeight(),
            top: _toggleEl.offset().top - angular.element($window).scrollTop(),
        };
        const windowProps = {
            height: $window.innerHeight,
        };

        if (lx.overToggle) {
            availaibleHeight.above = toggleProps.top;
            availaibleHeight.below = windowProps.height - toggleProps.top;
        } else {
            availaibleHeight.above = toggleProps.top;
            availaibleHeight.below = windowProps.height - (toggleProps.top + toggleProps.height);
        }

        return availaibleHeight;
    }

    /**
     * Initialize horizontal position.
     */
    function _initHorizontalPosition() {
        const menuProps = {};
        const toggleProps = {
            height: _toggleEl.outerHeight(),
            left: _toggleEl.offset().left,
            width: _toggleEl.outerWidth(),
        };
        const windowProps = {
            height: $window.innerHeight,
            width: $window.innerWidth,
        };

        if (angular.isDefined(lx.width)) {
            if (lx.width.indexOf('%') > -1) {
                // eslint-disable-next-line no-magic-numbers
                menuProps.minWidth = toggleProps.width * (lx.width.slice(0, -1) / 100);
            } else {
                menuProps.width = lx.width;
            }
        } else {
            menuProps.width = 'auto';
        }

        if (!lx.position || lx.position === 'left') {
            menuProps.left = toggleProps.left;
            menuProps.right = 'auto';
        } else if (lx.position === 'right') {
            menuProps.left = 'auto';
            menuProps.right = windowProps.width - toggleProps.width - toggleProps.left;
        }

        _menuEl.css({
            left: menuProps.left,
            right: menuProps.right,
        });

        if (angular.isDefined(menuProps.minWidth)) {
            _menuEl.css({
                minWidth: menuProps.minWidth,
            });
        } else {
            _menuEl.css({
                width: menuProps.width,
            });
        }
    }

    /**
     * Initialize vertical position.
     */
    function _initVerticalPosition() {
        const availaibleHeight = _getAvailableHeight();
        const menuProps = {};
        const windowProps = {
            height: $window.innerHeight,
        };

        if (availaibleHeight.below > availaibleHeight.above) {
            if (lx.overToggle) {
                menuProps.top = availaibleHeight.above;
                menuProps.maxHeight = availaibleHeight.below;
            } else {
                // eslint-disable-next-line no-bitwise
                menuProps.top = availaibleHeight.above + _toggleEl.outerHeight() + ~~lx.offset;
                menuProps.maxHeight = availaibleHeight.below;
            }
        } else if (lx.overToggle) {
            menuProps.bottom = windowProps.height - availaibleHeight.above - _toggleEl.outerHeight();
            menuProps.maxHeight = availaibleHeight.above + _toggleEl.outerHeight();
        } else {
            // eslint-disable-next-line no-bitwise
            menuProps.bottom = windowProps.height - availaibleHeight.above + ~~lx.offset;
            menuProps.maxHeight = availaibleHeight.above;
        }

        menuProps.maxHeight -= _OFFSET_FROM_EDGE;

        _menuEl.css(menuProps);
    }

    /**
     * Close dropdown on echap key up.
     *
     * @param {Event} evt The key up event.
     */
    function _onKeyUp(evt) {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            LxDropdownService.closeActiveDropdown();
        }

        evt.stopPropagation();
    }

    /**
     * Open dropdown.
     */
    function _open() {
        LxDropdownService.closeActiveDropdown(true);
        LxDropdownService.registerDropdownId(lx.uuid);

        if (angular.isUndefined(lx.escapeClose) || lx.escapeClose) {
            _idEventScheduler = LxEventSchedulerService.register('keyup', _onKeyUp);
        }

        LxDepthService.increase();

        _menuEl
            .appendTo('body')
            .show()
            .css({ position: 'fixed', zIndex: LxDepthService.get() });

        $timeout(() => {
            _initHorizontalPosition();
            _initVerticalPosition();

            lx.isOpen = true;
            LxUtilsService.disableBodyScroll();

            _menuEl.on('scroll', _checkScrollEnd);
            $document.on('click keydown keypress', _onDocumentClick);
        });
    }

    /**
     * Register the source element that triggered the dropdown.
     *
     * @param {element} sourceEl The source element that triggered the dropdown.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Register menu.
     *
     * @param {element} menuEl The menu element.
     */
    function registerMenu(menuEl) {
        _menuEl = menuEl;
        _menuEl.hide();
    }

    /**
     * Register toggle.
     *
     * @param {element} toggleEl The toggle element.
     */
    function registerToggle(toggleEl) {
        _toggleEl = toggleEl;
    }

    /**
     * Toggle the dropdown on toggle click.
     *
     * @param {Event} evt The click event.
     */
    function toggle(evt) {
        if (angular.isDefined(evt.target)) {
            _registerSource(angular.element(evt.target));
        }

        if (lx.isOpen) {
            LxDropdownService.closeActiveDropdown(true);
        } else {
            _open();
        }
    }

    /////////////////////////////

    lx.registerMenu = registerMenu;
    lx.registerToggle = registerToggle;
    lx.toggle = toggle;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given dropdown.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {string} dropdownId The dropdown identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    $scope.$on('lx-dropdown__open', (evt, dropdownId, params) => {
        if (dropdownId === lx.uuid && !lx.isOpen) {
            // Backward compatibility.
            if (angular.isString(params) || angular.isElement(params)) {
                const toggleEl = angular.isString(params) ? angular.element(params) : params;

                registerToggle(toggleEl);

                _open();

                return;
            }

            registerToggle(angular.element(params.target));

            if (angular.isDefined(params.source)) {
                _registerSource(angular.element(params.source));
            } else {
                _registerSource(angular.element(params.target));
            }

            _open();
        }
    });

    /**
     * Close a given dropdown.
     *
     * @param {Event}   evt             The dropdown open event.
     * @param {Object}  dropdownId      The dropdown identifier.
     * @param {boolean} isDocumentClick Whether the method has been called on document click or not.
     */
    $scope.$on('lx-dropdown__close', (evt, dropdownId, isDocumentClick) => {
        if (dropdownId === lx.uuid && lx.isOpen) {
            if (isDocumentClick && angular.isDefined(lx.closeOnClick) && !lx.closeOnClick) {
                return;
            }

            _close();
        }
    });

    /**
     * Update the active dropdown position.
     */
    $scope.$on('lx-dropdown__update', () => {
        if (LxDropdownService.isOpen(lx.uuid)) {
            _initHorizontalPosition();
            _initVerticalPosition();
        }
    });

    /**
     * Close on destroy.
     */
    $scope.$on('$destroy', () => {
        _close();
    });
}

/////////////////////////////

function DropdownDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        ctrl.registerToggle(el.find(`.${CSS_PREFIX}-dropdown__toggle`));
        ctrl.registerMenu(el.find(`.${CSS_PREFIX}-dropdown__menu`));

        if (transclude.isSlotFilled('toggle')) {
            ctrl.hasToggle = true;
        }

        attrs.$observe('id', (id) => {
            ctrl.uuid = id;
        });
    }

    return {
        bindToController: true,
        controller: DropdownController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeOnClick: '=?lxCloseOnClick',
            escapeClose: '=?lxEscapeClose',
            offset: '@?lxOffset',
            overToggle: '=?lxOverToggle',
            position: '@?lxPosition',
            width: '@?lxWidth',
        },
        template,
        transclude: {
            menu: 'lxDropdownMenu',
            toggle: '?lxDropdownToggle',
        },
    };
}

/////////////////////////////

angular.module('lumx.dropdown').directive('lxDropdown', DropdownDirective);

/////////////////////////////

export { DropdownDirective };
