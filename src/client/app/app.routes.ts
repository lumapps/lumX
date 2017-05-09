import { Routes } from '@angular/router';

// If you need any other component, import it here. For example:
// import { MyComponent } from 'my-component/my.component';
// import { MyModule } from 'my-component/my.module';

import { NotFoundComponent } from 'core/components/not-found/not-found.component';


/**
 * The main routes for the application.
 *
 * @type {Routes}
 * @readonly
 * @constant
 * @default
 */
export const routes: Routes = [
    /*
     * If you need any route global to the application, add it here.
     * Be sure to leave the "NotFoundComponent" route at the last position (as it will be the fallback route when no
     * other route will match.
     */
    // For example:
    // { component: MyComponent, path: 'my-component' },

    // You can also lazy-load some routes. For example:
    // { loadChildren: 'my-component/my.module#MyModule', path: 'lazy' };

    {
        component: NotFoundComponent,
        path: '**',
    },
];
