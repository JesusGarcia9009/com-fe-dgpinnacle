import { Routes } from "@angular/router";
import { ListRecordComponent } from "./list-record/list-record.component";

export const RecordPagesRoutes: Routes = [

    {
        path: 'record',
        children: [{
            path: 'list',
            component: ListRecordComponent
        }
        ]
    }
];
