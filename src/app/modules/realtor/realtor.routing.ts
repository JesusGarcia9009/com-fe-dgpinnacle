import { Routes } from "@angular/router";
import { ListRealtorComponent } from "./list-realtor/list-realtor.component";
import { AddUpdateRealtorComponent } from "./add-update-realtor/add-update-realtor.component";

export const RealtorPagesRoutes: Routes = [

    {
        path: 'realtor',
        children: [
        {
            path: 'list',
            component: ListRealtorComponent
        },
        {
            path: 'add-upd-realtor',
            component: AddUpdateRealtorComponent
        },
        {
            path: 'add-upd-realtor/:ver',
            component: AddUpdateRealtorComponent
        }
        ]
    }
];
