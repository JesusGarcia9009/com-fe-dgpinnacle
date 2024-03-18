import { Routes } from "@angular/router";
import { PrincipalComponent } from "./principal/principal.component";

export const MastersPagesRoutes: Routes = [

    {
        path: 'letters',
        children: [{
            path: 'index/:tabIndex',
            component: PrincipalComponent
        }]
    }
];
