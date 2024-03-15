import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { QuotationPagesRoutes } from './quotation.routing';
import { AddQuotationComponent } from './add-quotation/add-quotation.component';



@NgModule({
  declarations: [ListQuotationComponent, AddQuotationComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(QuotationPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class QuotationModule { }
