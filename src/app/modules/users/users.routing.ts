import { Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { UsersMainComponent } from "./usuarios-main/users-main.component";
import { UsersAddUpdateComponent } from "./usuarios-add-update/users-add-update.component";


export const usersPagesRoutes: Routes = [

    {
        path: 'users',
        children: [ {
            path: '',
            component: UsersMainComponent,
            canActivate: [AuthGuardService],
            children: [
                
            ]
        },
        {
            path: 'add-upd-user',
            component: UsersAddUpdateComponent,
            canActivate: [AuthGuardService]
        }]
    }
];
