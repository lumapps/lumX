import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CSSComponent } from './css.component';

import { ColorComponent } from './color/color.component';
import { FlexboxComponent } from './flexbox/flexbox.component';
import { MixinComponent } from './mixin/mixin.component';
import { TypographyComponent } from './typography/typography.component';


@NgModule({
    exports: [
        RouterModule,
    ],

    imports: [
        RouterModule.forChild([
            {
                children: [
                    {
                        path: '',
                        redirectTo: 'color',
                    },
                    {
                        component: ColorComponent,
                        path: 'color',
                    },
                    {
                        component: FlexboxComponent,
                        path: 'flexbox',
                    },
                    {
                        component: MixinComponent,
                        path: 'mixin',
                    },
                    {
                        component: TypographyComponent,
                        path: 'typography',
                    },
                ],
                component: CSSComponent,
                path: '',
            },
        ]),
    ],
})
export class CSSRoutingModule {}
