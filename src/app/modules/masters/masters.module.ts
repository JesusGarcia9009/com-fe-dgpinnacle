import { MastersPagesRoutes } from './masters.routing';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ClientsComponent } from './clients/clients/clients.component';
import { PrincipalComponent } from './principal/principal.component';
import { AddUpdateClientComponent } from './clients/add-update-client/add-update-client.component';
import { AddUpdateProductComponent } from './products/add-update-product/add-update-product.component';
import { ProductsComponent } from './products/products/products.component';
import { AddUpdateProviderComponent } from './providers/add-update-provider/add-update-provider.component';
import { ProvidersComponent } from './providers/providers/providers.component';



@NgModule({
  declarations: [ProductsComponent, ClientsComponent, ProvidersComponent, PrincipalComponent, AddUpdateClientComponent, AddUpdateProductComponent, AddUpdateProviderComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(MastersPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class MastersModule { }
