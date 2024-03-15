import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './features/login/login.component';
import { RouterModule } from '@angular/router';
import { PagesRoutes } from './auth.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule
  ]
})
export class AuthModule { }
