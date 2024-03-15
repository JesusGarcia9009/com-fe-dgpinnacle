import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrincipalComponent } from './principal/principal.component';
import { RouterModule } from '@angular/router';
import { MaintainerPagesRoutes } from './maintainer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { BrandComponent } from './brand/brand/brand.component';
import { AddUpdateBrandComponent } from './brand/add-update-brand/add-update-brand.component';
import { SourceComponent } from './source/source/source.component';
import { AddUpdateSourceComponent } from './source/add-update-source/add-update-source.component';
import { UniversalgroupsComponent } from './universalgroups/universalgroups/universalgroups.component';
import { AddUpdateUniversalgroupsComponent } from './universalgroups/add-update-universalgroups/add-update-universalgroups.component';
import { DeliverytypeComponent } from './deliverytype/deliverytype/deliverytype.component';
import { AddUpdateDeliverytypeComponent } from './deliverytype/add-update-deliverytype/add-update-deliverytype.component';
import { PaymentmethodComponent } from './paymentmethod/paymentmethod/paymentmethod.component';
import { AddUpdatePaymentmethodComponent } from './paymentmethod/add-update-paymentmethod/add-update-paymentmethod.component';
import { ModelComponent } from './model/model/model.component';
import { AddUpdateModelComponent } from './model/add-update-model/add-update-model.component';
import { ProductTypeComponent } from './productType/product-type/product-type.component';
import { AddUpdateProductTypeComponent } from './productType/add-update-product-type/add-update-product-type.component';
import { QuotationdeliveryComponent } from './quotationdelivery/quotationdelivery/quotationdelivery.component';
import { AddUpdateQuotationdeliveryComponent } from './quotationdelivery/add-update-quotationdelivery/add-update-quotationdelivery.component';
import { InventoryreasonComponent } from './inventoryreason/inventoryreason/inventoryreason.component';
import { AddUpdateInventoryreasonComponent } from './inventoryreason/add-update-inventoryreason/add-update-inventoryreason.component';



@NgModule({
  declarations: [PrincipalComponent, BrandComponent, AddUpdateBrandComponent, SourceComponent, AddUpdateSourceComponent, UniversalgroupsComponent, AddUpdateUniversalgroupsComponent, DeliverytypeComponent, AddUpdateDeliverytypeComponent, PaymentmethodComponent, AddUpdatePaymentmethodComponent, ModelComponent, AddUpdateModelComponent, ProductTypeComponent, AddUpdateProductTypeComponent, QuotationdeliveryComponent, AddUpdateQuotationdeliveryComponent, InventoryreasonComponent, AddUpdateInventoryreasonComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(MaintainerPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class MaintainerModule { }
