import { Component, OnInit } from '@angular/core';
// If you need anything else from Angular, import it here. For example:
// import { Response } from '@angular/http';

// If you need any other lib, import it here. For example:
// import 'rxjs/add/operator/map';

import { APP_SELECTOR as SELECTOR } from 'core/settings/selectors.settings';
import { SELECTOR_PREFIX, SELECTOR_SEPARATOR } from 'core/settings/selectors.settings';

// If you need anything else from the core, import it here. For example:
// import { MyService } from 'core/services/my.service';

// If you need anything else, import it here. For example:
// import { MyModule } from 'my-component/my.module';
// import { MyComponent } from 'my-component/my.component';


/*
 * Global styles.
 */
import 'core/styles/app.scss';


/**
 * "App" component.
 * [Component description].
 */
@Component({
    selector: SELECTOR_PREFIX + SELECTOR_SEPARATOR + SELECTOR,
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    /**
     * Add any attributes you need here.
     * First private ones, then protected and finally public.
     * In each visibility declare statics first, then constants and finally variables.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each attributes.
     */


    /**
     * Add any method you will need.
     * First private ones, then protected.
     * In each visibility declare statics first.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each method.
     */

    /**
     * Called when the component is initialized.
     *
     * @todo Write "App" component 'ngOnInit' lifecycle hook.
     */
    public ngOnInit(): void {
        // TODO: write ngOnInit's code here.
    }

    /**
     * Add any public method you will need.
     * Declare statics first.
     * Remember to use alphabetical order.
     * Don't forget to add complete JSDocs for each method.
     */
}
