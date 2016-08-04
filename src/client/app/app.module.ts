import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from 'core/modules/core.module';

import { ToDoModule } from 'to-do/to-do.module';

import { AppComponent } from 'app.component';


/**
 * Our application module
 * Handles the bootstrapping and declaration of everything
 */
@NgModule({
    bootstrap: [
        AppComponent,
    ],

    declarations: [
        AppComponent,
    ],

    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ToDoModule,
    ],
})
export class AppModule {}
