import { Routes } from "@angular/router";
import { LoginComponent } from "./features/login/login.component";

export const PagesRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'login',
            component: LoginComponent
        }]
    }
];
