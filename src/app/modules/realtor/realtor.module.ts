import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddUpdateRealtorComponent } from './add-update-realtor/add-update-realtor.component';
import { ListRealtorComponent } from './list-realtor/list-realtor.component';
import { RealtorPagesRoutes } from './realtor.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [AddUpdateRealtorComponent, ListRealtorComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(RealtorPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class RealtorModule { }
