import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListarPropiedadesComponent } from './listar-propiedades/listar-propiedades.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { propiedadesPagesRoutes } from './propiedades.routing';
import { DataTablesModule } from 'angular-datatables';
import { AddUpdPropiedadComponent } from './add-upd-propiedad/add-upd-propiedad.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ListarProyectosComponent } from './listar-proyectos/listar-proyectos.component';
import { AddUpdProyectosComponent } from './add-upd-proyectos/add-upd-proyectos.component';
import { ListaTopologiaComponent } from './lista-topologia/lista-topologia.component';
import { AddUpdTopologiaComponent } from './add-upd-topologia/add-upd-topologia.component';

@NgModule({
  declarations: [ListarPropiedadesComponent, AddUpdPropiedadComponent, ListarProyectosComponent, AddUpdProyectosComponent, ListaTopologiaComponent, AddUpdTopologiaComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(propiedadesPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class PropiedadesModule { }
