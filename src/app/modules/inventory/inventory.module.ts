import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutes } from './inventory.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ListInventoryComponent } from './list-inventory/list-inventory.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';



@NgModule({
  declarations: [ListInventoryComponent, AddInventoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class InventoryModule { }
