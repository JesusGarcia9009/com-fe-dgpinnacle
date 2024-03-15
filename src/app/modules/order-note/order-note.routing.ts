import { Routes } from "@angular/router";
import { ListOrderNoteComponent } from './list-order-note/list-order-note.component';
import { AddOrderNoteComponent } from "./add-order-note/add-order-note.component";
import { ReverseOrderNoteComponent } from "./reverse-order-note/reverse-order-note.component";
import { BillOrderNoteComponent } from "./bill-order-note/bill-order-note.component";

export const OrderNoteRoutes: Routes = [

    {
        path: 'order',
        children: [{
            path: 'list-order',
            component: ListOrderNoteComponent
        },
        {
            path: 'add-order',
            component: AddOrderNoteComponent
        },
        {
            path: 'add-order/:ver',
            component: AddOrderNoteComponent
        },
        {
            path: 'reverse-order',
            component: ReverseOrderNoteComponent
        },
        {
            path: 'bill-order',
            component: BillOrderNoteComponent
        }
        ]
    }
];
