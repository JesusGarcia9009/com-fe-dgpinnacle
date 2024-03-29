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
                loadChildren: './modules/letter/letter.module#LetterModule'
            },
            {
                path: '',
                loadChildren: './modules/users/users.module#UsersModule'
            },
	                   {
                path: '',
                loadChildren: './modules/client/client.module#ClientModule'
            },
	        {
                path: '',
                loadChildren: './modules/realtor/realtor.module#RealtorModule'
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
