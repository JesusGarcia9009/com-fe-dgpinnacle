import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { SharedModule } from '../shared/shared.module';
import { usersPagesRoutes } from './users.routing';
import { UsersMainComponent } from './usuarios-main/users-main.component';
import { UsersAddUpdateComponent } from './usuarios-add-update/users-add-update.component';



@NgModule({
  declarations: [UsersMainComponent, UsersAddUpdateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(usersPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule
  ]
})
export class UsersModule { }
