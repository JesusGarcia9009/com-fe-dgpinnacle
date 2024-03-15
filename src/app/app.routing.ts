import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ClienteExternoComponent } from './layouts/cliente-externo/cliente-externo.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: '',
                loadChildren: './modules/usuarios/usuarios.module#UsuariosModule'
            },
	        {
                path: '',
                loadChildren: './modules/propiedades/propiedades.module#PropiedadesModule'
            },
	        {
                path: '',
                loadChildren: './modules/masters/masters.module#MastersModule'
            },
            {
                path: '',
                loadChildren: './modules/quotation/quotation.module#QuotationModule'
            },
            {
                path: '',
                loadChildren: './modules/order-note/order-note.module#OrderNoteModule'
            },
            {
                path: '',
                loadChildren: './modules/maintainer/maintainer.module#MaintainerModule'
            },
            {
                path: '',
                loadChildren: './modules/bills/bills.module#BillsModule'
            },
            {
                path: '',
                loadChildren: './modules/inventory/inventory.module#InventoryModule'
            },
            {
                path: '',
                loadChildren: './modules/record/record.module#RecordModule'
            }
        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'auth',
            loadChildren: './modules/auth/auth.module#AuthModule'
        }]
    },
    {
        path: 'pagos',
        component: ClienteExternoComponent,
        children: [{
            path: '',
            loadChildren: './modules/pagos/pagos.module#PagosModule'
        }]
    },
];
