import { AddUpdateModelComponent } from './model/add-update-model/add-update-model.component';
import { AddUpdateDeliverytypeComponent } from './deliverytype/add-update-deliverytype/add-update-deliverytype.component';
import { AddUpdateUniversalgroupsComponent } from './universalgroups/add-update-universalgroups/add-update-universalgroups.component';
import { AddUpdateSourceComponent } from './source/add-update-source/add-update-source.component';
import { AddUpdateBrandComponent } from './brand/add-update-brand/add-update-brand.component';
import { PrincipalComponent } from './principal/principal.component';
import { Routes } from "@angular/router";
import { AddUpdatePaymentmethodComponent } from './paymentmethod/add-update-paymentmethod/add-update-paymentmethod.component';
import { AddUpdateProductTypeComponent } from './productType/add-update-product-type/add-update-product-type.component';
import { AddUpdateQuotationdeliveryComponent } from './quotationdelivery/add-update-quotationdelivery/add-update-quotationdelivery.component';
import { AddUpdateInventoryreasonComponent } from './inventoryreason/add-update-inventoryreason/add-update-inventoryreason.component';

export const MaintainerPagesRoutes: Routes = [

    {
        path: 'maintainer',
        children: [{
            path: 'index/:tabIndex',
            component: PrincipalComponent
        },
        {
            path: 'add-upd-brand',
            component: AddUpdateBrandComponent
        }, {
            path: 'add-upd-brand/:ver',
            component: AddUpdateBrandComponent
        },
        {
            path: 'add-upd-source',
            component: AddUpdateSourceComponent
        }, {
            path: 'add-upd-source/:ver',
            component: AddUpdateSourceComponent
        },
        {
            path: 'add-upd-quotationdelivery',
            component: AddUpdateQuotationdeliveryComponent
        }, {
            path: 'add-upd-quotationdelivery/:ver',
            component: AddUpdateQuotationdeliveryComponent
        },
        {
            path: 'add-upd-inventoryreason',
            component: AddUpdateInventoryreasonComponent
        }, {
            path: 'add-upd-inventoryreason/:ver',
            component: AddUpdateInventoryreasonComponent
        },
        {
            path: 'add-upd-universalgroups',
            component: AddUpdateUniversalgroupsComponent
        }, {
            path: 'add-upd-universalgroups/:ver',
            component: AddUpdateUniversalgroupsComponent
        },
        {
            path: 'add-upd-deliverytype',
            component: AddUpdateDeliverytypeComponent
        }, {
            path: 'add-upd-deliverytype/:ver',
            component: AddUpdateDeliverytypeComponent
        },
        {
            path: 'add-upd-paymentmethod',
            component: AddUpdatePaymentmethodComponent
        }, {
            path: 'add-upd-paymentmethod/:ver',
            component: AddUpdatePaymentmethodComponent
        },
        {
            path: 'add-upd-model',
            component: AddUpdateModelComponent
        }, {
            path: 'add-upd-model/:ver',
            component: AddUpdateModelComponent
        },
        {
            path: 'add-upd-producttype',
            component: AddUpdateProductTypeComponent
        }, {
            path: 'add-upd-producttype/:ver',
            component: AddUpdateProductTypeComponent
        }
        ]

    }
];
