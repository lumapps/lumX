import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { TokenActions } from 'core/constants/actions';
import { ITokenState } from 'core/reducers/token.reducer';


@Injectable()
/**
 * Responsible of managing our mobile navigation in our application.
 */
export class MobileNavService {
    /**
     * The status of the mobile navigation.
     *
     * @type {Boolean}
     * @public
     */
    public mobileNavIsOpen: boolean = false;


    closeMobileNav(): void {
        this.mobileNavIsOpen = false;
    }

    openMobileNav(): void {
        this.mobileNavIsOpen = true;
    }

    toggleMobileNav(): void {
        this.mobileNavIsOpen = !this.mobileNavIsOpen;
    }
}
