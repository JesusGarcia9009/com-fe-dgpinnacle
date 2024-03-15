import { AddUpdateProviderComponent } from './providers/add-update-provider/add-update-provider.component';
import { AddUpdateClientComponent } from './clients/add-update-client/add-update-client.component';
import { PrincipalComponent } from './principal/principal.component';
import { Routes } from "@angular/router";
import { AddUpdateProductComponent } from './products/add-update-product/add-update-product.component';

export const MastersPagesRoutes: Routes = [

    {
        path: 'masters',
        children: [{
            path: 'index/:tabIndex',
            component: PrincipalComponent
        },
        {
            path: 'add-upd-client',
            component: AddUpdateClientComponent
        },
        {
            path: 'add-upd-client/:ver',
            component: AddUpdateClientComponent
        },
        {
            path: 'add-upd-product',
            component: AddUpdateProductComponent
        },
        {
            path: 'add-upd-product/:ver',
            component: AddUpdateProductComponent
        },
        {
            path: 'add-upd-provider',
            component: AddUpdateProviderComponent
        },
        {
            path: 'add-upd-provider/:ver',
            component: AddUpdateProviderComponent
        }
        ]
    }
];
