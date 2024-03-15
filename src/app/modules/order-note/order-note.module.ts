import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListOrderNoteComponent } from './list-order-note/list-order-note.component';
import { AddOrderNoteComponent } from './add-order-note/add-order-note.component';
import { OrderNoteRoutes } from './order-note.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ReverseOrderNoteComponent } from './reverse-order-note/reverse-order-note.component';
import { BillOrderNoteComponent } from './bill-order-note/bill-order-note.component';



@NgModule({
  declarations: [ListOrderNoteComponent, AddOrderNoteComponent, ReverseOrderNoteComponent, BillOrderNoteComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(OrderNoteRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class OrderNoteModule { }
