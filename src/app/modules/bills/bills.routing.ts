import { Routes } from "@angular/router";
import { ListBillsComponent } from "./list-bills/list-bills.component";
import { AddBillsComponent } from "./add-bills/add-bills.component";
import { ReverseBillsComponent } from "./reverse-bills/reverse-bills.component";

export const BillsRoutes: Routes = [

    {
        path: 'bill',
        children: [{
            path: 'list-bills',
            component: ListBillsComponent
        },
        {
            path: 'add-bill',
            component: AddBillsComponent
        },
        {
            path: 'add-bill/:ver',
            component: AddBillsComponent
        },
        {
            path: 'reverse-bill',
            component: ReverseBillsComponent
        }
        ]
    }
];
