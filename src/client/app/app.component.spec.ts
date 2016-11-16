import { ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TokenService } from 'core/services/token.service';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';


describe('Application startup', () => {
    const component: AppComponent;
    const fixture: ComponentFixture<AppComponent>;
    const tokenService: TokenService;
    const spy: any;

    const token: string = '5678';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],

            exports: [],

            imports: [
                AppModule,
            ],

            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                TokenService,
            ],
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        tokenService = fixture.debugElement.injector.get(TokenService);

        spy = spyOn(tokenService, 'getToken').and.returnValue(token);
    });

    it('should request a token', fakeAsync(() => {
        expect(spy.calls.any()).toBe(false);

        fixture.detectChanges();
        expect(spy.calls.any()).toBe(true);

        tick();

        expect(tokenService.getToken()).toBe(token);
    }));
});
