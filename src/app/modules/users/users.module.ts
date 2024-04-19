import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { SharedModule } from '../shared/shared.module';
import { usersPagesRoutes } from './users.routing';
import { UsersMainComponent } from './users-principal/users-main.component';
import { UsersAddUpdateComponent } from './users-add-update/users-add-update.component';
import { LoanAddUpdateComponent } from './loan-add-update/loan-add-update.component';
import { RealtorAddUpdateComponent } from './realtor-add-update/realtor-add-update.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ClientAddUpdateComponent } from './client-add-update/client-add-update.component';



@NgModule({
  declarations: [UsersMainComponent, UsersAddUpdateComponent, LoanAddUpdateComponent, RealtorAddUpdateComponent, ChangePasswordComponent, ClientAddUpdateComponent],
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
