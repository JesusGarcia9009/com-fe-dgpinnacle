import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosMainComponent } from './usuarios-main/usuarios-main.component';
import { UsuariosAddUpdateComponent } from './usuarios-add-update/usuarios-add-update.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { SharedModule } from '../shared/shared.module';
import { usuarioPagesRoutes } from './usuarios.routing';



@NgModule({
  declarations: [UsuariosMainComponent, UsuariosAddUpdateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(usuarioPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule
  ]
})
export class UsuariosModule { }
