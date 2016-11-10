import { NgModule } from '@angular/core';

import { CoreModule } from 'core/modules/core.module';
import { CoreModule as DemoCoreModule } from 'demo/core/core.module';

import { CSSRoutingModule } from './css.routing.module';

import { CSSComponent } from './css.component';

import { ColorComponent } from './color/color.component';
import { FlexboxComponent } from './flexbox/flexbox.component';
import { MixinComponent } from './mixin/mixin.component';
import { TypographyComponent } from './typography/typography.component';


@NgModule({
    declarations: [
        CSSComponent,
        ColorComponent,
        FlexboxComponent,
        MixinComponent,
        TypographyComponent,
    ],

    imports: [
        CoreModule,
        DemoCoreModule,
        CSSRoutingModule,
    ],
})
export class CSSModule {}
