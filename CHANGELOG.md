# Changelog

## v0.2.48:

#### Bug fixes:
 - search-filter: theme and placeholder
 - selects: floating label style
 - select: missing model to ngModel rename

#### Breaking changes:
 - User must switch light and dark theme.


## v0.2.47:

#### New features:
 - dialog: add onclose method


## v0.2.46:

#### New features:
 - list: add clickable row


## v0.2.45:

#### Bug fixes:
 - dialog: transcluded content share parent scope

#### Breaking changes:
 - Root element need classes (dialog dialog—l).
 - Remove sub-directives and come back to classic div.


## v0.2.44:

#### Bug fixes:
 - toolbar: add margin left to toolbar label
 - tabs: remove useless indicator checking

#### Breaking changes:
 - Use lx-dialog directive as an element.
 - Use lx-dialog-header, lx-dialog-content, lx-dialog-actions directives
 - as elements.


## v0.2.43:

#### Bug fixes:
 - dialog: remove stopPropagation


## v0.2.42:

#### Bug fixes:
 - icons: better sizes for icon buttons


## v0.2.41:

#### Bug fixes:
 - dialog: remove useless log


## v0.2.40:
 - fix css: bourbon path is updated according to v4


## v0.2.39:

#### Bug fixes:
 - dialog: check dialog height with interval
 - progress: add document global for linter


## v0.2.38:

#### Bug fixes:
 - progress: use svg instead of animating divs

#### Breaking changes:
 - LxProgressService.circular.show takes only to args: color and container


## v0.2.37:
*No major changes.*


## v0.2.36:

#### Bug fixes:
 - list: apply style only to direct children
 - notification: alert and confirm dialog DOM
 - notification: alert and confirm box style


## v0.2.35:

#### Bug fixes:
 - select: Empty multiple selects now updates the model


## v0.2.34:

#### Bug fixes:
 - select: set newSelection to false when user unselect an item


## v0.2.33:

#### Bug fixes:
 - select: set newSelection to false when user select an item


## v0.2.32:

#### Bug fixes:
 - dialog: watch dialog height at init


## v0.2.31:

#### Breaking changes:
 - Toolbar label font style is not set anymore. User needs to specify
 - typographic style (eg. fs-title).


## v0.2.30:

#### Bug fixes:
 - select: model-to-selection/selection-to-model


## v0.2.29:

#### New features:
 - dialog: add scrollable behavior

#### Breaking changes:
 - dialog__title class is removed in favor of dialog__header.
 - dialog__header should prepend dialog instead of being inside
 - dialog__content.


## v0.2.28:

#### Bug fixes:
 - select: use only $modelView from ng-model
 - dropdown: remove scope.$destroy
 - tooltip: remove scope.$destroy


## v0.2.27:

#### Bug fixes:
 - tabs: manage dynamic add/remove & ng-repeat
 - date-picker: improve security by removing scope binding
 - date-picker: move isDefined checking to controller
 - date-picker: watch the scope to handle async binding


## v0.2.26:

#### Bug fixes:
 - selects: add default scope values


## v0.2.25:

#### Bug fixes:
 - dropdown: remove element on scope destroy
 - tooltip: remove element on scope destroy
 - selects: use child scope inside the directive

#### Breaking changes:
 - selects now use "ng-model" instead of "model"


## v0.2.24:

#### Bug fixes:
 - select: better default value management


## v0.2.23:

#### New features:
 - scrollbar: Observe id to handle dynamics variables
 - scrollbar: Create getter & setter to watch scroll percentage

#### Bug fixes:
 - notification: show alert and confirm boxes


## v0.2.22:

#### New features:
 - date picker: add label attribute
 - date picker: add date picker component

#### Bug fixes:
 - date picker: use moment local locale
 - file-input: add a display block to filename


## v0.2.21:

#### Bug fixes:
 - transclude: add array injection
 - text fields: watch input $modelValue
 - search filter: cancel button line height
 - buttons: disabled style


## v0.2.20:

#### Bug fixes:
 - tabs: better scope management in transclude
 - tabs: update heading when scope changes
 - dialog: emergence animation is now stable


## v0.2.19:

#### Bug fixes:
 - select: move scope init data


## v0.2.18:

#### Bug fixes:
 - select: null pointer for non-multiple


## v0.2.17:

#### New features:
 - typography: line height and letter spacing
 - tabs: add responsive behavior
 - tabs: add layout attribute

#### Bug fixes:
 - tabs: set indicator position on window resize

#### Breaking changes:
 -  fs-display and fs-body variants now have a ‘-‘ to separate
 - number. For example, fs-display4 is now fs-display-4.


## v0.2.16:

#### Bug fixes:
 - dropdown: increment z-index for use in dialog
 - tabs: add timeout on tab links


## v0.2.15:

#### Bug fixes:
 - text-fields: $apply only for jquery events


## v0.2.14:

#### Bug fixes:
 - select: scope management after dropdown fix
 - dropdown: trasnclude to select toggle's scope
 - text-fields: workaround HTML5 validation model
 - text-fields: use ng-transclude again

#### Breaking changes:
 - text-fields must now have their own input or textarea with ng-model


## v0.2.13:

#### New features:
 - transclude: add iterative parent option

#### Bug fixes:
 - dropdown: "grand-parent" scope for transclude


## v0.2.12:

#### New features:
 - text-fields: fixing padding
 - text-fields: add textarea in text fields components

#### Bug fixes:
 - dropdown: stop click propagation
 - dialog: stop click propagation


## v0.2.11:

#### New features:
 - selects: converter model=>items & vice versa

#### Bug fixes:
 - selects: selected items init in the dropdown
 - selects: indexof between objects
 - selects: pointers between model & selected

#### Breaking changes:
 - selects "selected" is replaced by "model"


## v0.2.10:

#### Bug fixes:
 - text-fields: replace "name" by "field-name"


## v0.2.9:

#### Bug fixes:
 - text-fields: manage the html name parameter


## v0.2.8:

#### Bug fixes:
 - data-table: cell padding
 - scrollbar: use angular $window selector
 - search filter: reset model on clear
 - select: fix filter width

#### Breaking changes:
 - the text-field directive is totally changed


## v0.2.7:

#### New features:
 - search filter: add width and position attrs

#### Bug fixes:
 - search filter: use filter-width parameter


## v0.2.6:

#### New features:
 - tabs: tabs can have a shadow
 - tabs: remove padding on .tabs__panes
 - dialogs: add responsive behaviour for dialogs

#### Bug fixes:
 - text-field: move the label when init with a value
 - search-field: display the cleaning cross when reopening the field
 - data-table: fix cells paddings and add responsive behaviour
 - ripple: disable animation once finished


## v0.2.5:

#### Bug fixes:
 - tabs: use ng-if for hiding/showing tabs


## v0.2.4:

#### Bug fixes:
 - data table: rounded style for primary image


## v0.2.3:

#### Bug fixes:
 - scrollbar: use angular selecter instead of jQuery $
 - scrollbar: Add Scrollbar Service


## v0.2.2:

#### New features:
 - tabs: add links background color
 - tabs: custom colors for tabs
 - tabs: icons in tabs links
 - typography: replace headings by typography
 - data-table: add component
 - z-depth: add z-depth classes
 - headings: add sass vars and classes

#### Bug fixes:
 - search filter: pointer cursor on search icon


## v0.2.1:

#### New features:
 - colors: rename black and white classes


## v0.2.0:

#### New features:
 - search-filter: add model management
 - select: remove delete button from multiple tag
 - select: deselection on non-multiple selects
 - select: add hover delete for selected items in multiple
 - select: update demo
 - select: add loader and helpers
 - select: link filter to callback
 - fab: left and right direction for fab

#### Bug fixes:
 - dropdown: add focus on search filter
 - tabs: panes padding
 - toolbar: floating elements in left/right areas
 - fab: wrong animation with left direction
 - select: null pointer on filter if none selected
 - select: disable text selection on tag


## v0.1.15:

#### Bug fixes:
 - notification: missing method from injector object


## v0.1.14:

#### New features:
 - tabs: change default theme and parameter name
 - tabs: add scope variables and dark/light theme
 - tabs: add color themes
 - colors: add theme global colors and colors classes
 - text-fields: add default values for parameters
 - text-fields: dynamic value management for fixed label and valid state
 - text-fields: fixed label and valid input state

#### Bug fixes:
 - select: change width attribute
 - notification: remove circular dependency between $compile & ui-router
 - file-input: remove "change" in directive binding
 - file-input: fix jshint error
 - file-input: fix "change" parameter binding


## v0.1.13:

#### Bug fixes:
 - file-input: long filenames displayed on one line
 - search-filter: stop propagation with multiple search in the same page


## v0.1.12:

#### New features:
 - search-filter: better click handlers
 - search-filter: ergonomic improvements
 - search-filter: create search filter component

#### Bug fixes:
 - file-input: Fix indentation to the Allman style
 - file-input: remove transclude
 - toolbars: label margin and clearfix


## v0.1.11:

#### Bug fixes:
 - fab: action buttons position


## 0.1.10:

#### Bug fixes:
 - toolbars: fix toolbar label line height


## v0.1.9:

#### Bug fixes:
 - toolbars: padding according to buttons size


## v0.1.8:

#### New features:
 - toolbars: add toolbar component

#### Bug fixes:
 - buttons: change default sizes
 - buttons: increase font size for icon buttons


## v0.1.7:

#### New features:
 - colors: add new colors to default settings
 - colors: Material design color palette with Sass


## v0.1.6:
*No major changes.*


## v0.1.5:
*No major changes.*


## v0.1.4:

#### New features:
 - progress: create service to manage progress
 - progress: enhance existing circular progress

#### Bug fixes:
 - select: remove unselect method on elements
 - ripple: disable pointer events


## v0.1.3:
*No major changes.*


## v0.1.2:

#### Bug fixes:
 - switch: Manage fast rate for click
 - checkbox: Manage fast rate for click


## v0.1.1:

#### Bug fixes:
 - ripple: set z-index to put ripple under link
