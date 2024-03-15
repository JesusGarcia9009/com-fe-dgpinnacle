import { Routes } from "@angular/router";
import { ListInventoryComponent } from "./list-inventory/list-inventory.component";
import { AddInventoryComponent } from "./add-inventory/add-inventory.component";

export const InventoryRoutes: Routes = [

    {
        path: 'inventory',
        children: [{
            path: 'list-inventory',
            component: ListInventoryComponent
        },
        {
            path: 'add-inventory',
            component: AddInventoryComponent
        },
        {
            path: 'add-inventory/:ver',
            component: AddInventoryComponent
        }
        ]
    }
];
