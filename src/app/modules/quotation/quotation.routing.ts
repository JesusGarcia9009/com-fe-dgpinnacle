import { AddQuotationComponent } from './add-quotation/add-quotation.component';
import { Routes } from "@angular/router";
import { ListQuotationComponent } from "./list-quotation/list-quotation.component";

export const QuotationPagesRoutes: Routes = [

    {
        path: 'quotation',
        children: [{
            path: 'list-quotation',
            component: ListQuotationComponent
        },
        {
            path: 'add-quotation',
            component: AddQuotationComponent
        },
        {
            path: 'add-quotation/:ver',
            component: AddQuotationComponent
        }
        ]
    }
];
