import { Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { UsersMainComponent } from "./users-principal/users-main.component";
import { UsersAddUpdateComponent } from "./users-add-update/users-add-update.component";
import { LoanAddUpdateComponent } from "./loan-add-update/loan-add-update.component";
import { RealtorAddUpdateComponent } from "./realtor-add-update/realtor-add-update.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ClientAddUpdateComponent } from "./client-add-update/client-add-update.component";


export const usersPagesRoutes: Routes = [

    {
        path: 'users',
        children: [{
            path: 'index/:tabIndex',
            component: UsersMainComponent,
            canActivate: [AuthGuardService]
        },
        {
            path: 'add-upd-user/:profile',
            component: UsersAddUpdateComponent,
            canActivate: [AuthGuardService]
        },
        {
            path: 'add-upd-loan',
            component: LoanAddUpdateComponent,
            canActivate: [AuthGuardService]
        },
        {
            path: 'add-upd-realtor',
            component: RealtorAddUpdateComponent,
            canActivate: [AuthGuardService]
        },
        {
            path: 'add-upd-client',
            component: ClientAddUpdateComponent,
            canActivate: [AuthGuardService]
        },
        {
            path: 'update/password',
            component: ChangePasswordComponent,
            canActivate: [AuthGuardService]
        }]

    }
];
