import { Routes } from "@angular/router";
import { ListClientComponent } from "./list-client/list-client.component";
import { AddUpdateClientComponent } from "./add-update-client/add-update-client.component";

export const ClientPagesRoutes: Routes = [

    {
        path: 'client',
        children: [
        {
            path: 'list',
            component: ListClientComponent
        },
        {
            path: 'add-upd-client',
            component: AddUpdateClientComponent
        },
        {
            path: 'add-upd-client/:ver',
            component: AddUpdateClientComponent
        }
        ]
    }
];
