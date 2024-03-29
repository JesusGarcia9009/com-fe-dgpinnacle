import { Routes } from "@angular/router";
import { LetterListComponent } from "./letter-list/letter-list.component";
import { AddUpdateLetterComponent } from "./add-update-letter/add-update-letter.component";
import { AddLetterEncompassComponent } from "./add-letter-encompass/add-letter-encompass.component";
import { CalculatorLetterComponent } from "./calculator-letter/calculator-letter.component";

export const MastersPagesRoutes: Routes = [

    {
        path: 'letters',
        children: [{
            path: 'list',
            component: LetterListComponent
        },
        {
            path: 'add-upd-letter',
            component: AddUpdateLetterComponent
        },
        {
            path: 'add-upd-letter/:ver',
            component: AddUpdateLetterComponent
        },
        {
            path: 'add-letter-enc',
            component: AddLetterEncompassComponent
        },
        {
            path: 'calculator-letter',
            component: CalculatorLetterComponent
        }]
    }
];
