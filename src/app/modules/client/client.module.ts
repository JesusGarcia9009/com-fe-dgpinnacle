import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddUpdateClientComponent } from './add-update-client/add-update-client.component';
import { ListClientComponent } from './list-client/list-client.component';
import { ClientPagesRoutes } from './client.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [AddUpdateClientComponent, ListClientComponent],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(ClientPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class ClientModule { }
