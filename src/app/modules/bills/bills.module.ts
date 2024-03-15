import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBillsComponent } from './add-bills/add-bills.component';
import { ListBillsComponent } from './list-bills/list-bills.component';
import { ReverseBillsComponent } from './reverse-bills/reverse-bills.component';
import { RouterModule } from '@angular/router';
import { BillsRoutes } from './bills.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [AddBillsComponent, ListBillsComponent, ReverseBillsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(BillsRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class BillsModule { }
