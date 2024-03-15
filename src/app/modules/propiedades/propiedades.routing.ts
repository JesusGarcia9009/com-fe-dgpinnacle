import { Routes } from "@angular/router";
import { AddUpdPropiedadComponent } from "./add-upd-propiedad/add-upd-propiedad.component";
import { AddUpdProyectosComponent } from "./add-upd-proyectos/add-upd-proyectos.component";
import { AddUpdTopologiaComponent } from "./add-upd-topologia/add-upd-topologia.component";
import { ListaTopologiaComponent } from "./lista-topologia/lista-topologia.component";
import { ListarPropiedadesComponent } from "./listar-propiedades/listar-propiedades.component";

export const propiedadesPagesRoutes: Routes = [

    {
        path: 'propiedades',
        children: [{
            path: 'listar-propiedades',
            component: ListarPropiedadesComponent
        }, {
            path: 'add-upd-propiedad/:ver',
            component: AddUpdPropiedadComponent
        },
        {
            path: 'add-upd-propiedad',
            component: AddUpdPropiedadComponent
        }, {
            path: 'add-upd-proyecto',
            component: AddUpdProyectosComponent
        }, {
            path: 'add-upd-proyecto/:ver',
            component: AddUpdProyectosComponent
        }, {
            path: 'proyecto/:proyectoId/tipologia',
            component: ListaTopologiaComponent
        }]
    }
];
