import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListRecordComponent } from './list-record/list-record.component';
import { RouterModule } from '@angular/router';
import { RecordPagesRoutes } from './record.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { DetailRecordComponent } from './detail-record/detail-record.component';

@NgModule({
  declarations: [ListRecordComponent, DetailRecordComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(RecordPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class RecordModule { }
