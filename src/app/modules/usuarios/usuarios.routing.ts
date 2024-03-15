import { Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { UsuariosAddUpdateComponent } from "./usuarios-add-update/usuarios-add-update.component";
import { UsuariosMainComponent } from "./usuarios-main/usuarios-main.component";

export const usuarioPagesRoutes: Routes = [

    {
        path: 'usuarios',
        children: [ {
            path: '',
            component: UsuariosMainComponent,
            canActivate: [AuthGuardService],
            children: [
                
            ]
        },
        {
            path: 'add-upd-user',
            component: UsuariosAddUpdateComponent,
            canActivate: [AuthGuardService]
        }]
    }
];
