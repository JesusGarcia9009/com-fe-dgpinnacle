import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Router } from '@angular/router';
import { SharedProperties } from '../shared/properties/shared.properties';


declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
    roles?: string[];
    disabled?: boolean;
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/masters/index/0',
        title: 'Maestros',
        type: 'link',
        icontype: 'data_usage',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/maintainer/index/0',
        title: 'Tablas de apoyo',
        type: 'link',
        icontype: 'build',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/quotation/list-quotation',
        title: 'Cotizaciones',
        type: 'link',
        icontype: 'create',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/order/list-order',
        title: 'Notas de pedido',
        type: 'link',
        icontype: 'local_atm',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/bill/list-bills',
        title: 'Factura de compra',
        type: 'link',
        icontype: 'article',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/inventory/list-inventory',
        title: 'Ajustes de inventario',
        type: 'link',
        icontype: 'account_balance_wallet',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_SECRETARIA, 
            SharedProperties.ROL_VENDEDOR, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/record/list',
        title: 'Registro de operaciones',
        type: 'link',
        icontype: 'list_alt',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_GERENTE]
    },
    {
        path: '/usuarios',
        title: 'Usuarios',
        type: 'link',
        icontype: 'supervised_user_circle',
        roles: [SharedProperties.ROL_ADMIN, 
            SharedProperties.ROL_JEFE, 
            SharedProperties.ROL_GERENTE]
    }

    // {
    //     path: '/components',
    //     title: 'Components',
    //     type: 'sub',
    //     icontype: 'apps',
    //     collapse: 'components',
    //     children: [
    //         {path: 'buttons', title: 'Buttons', ab:'B'},
    //         {path: 'grid', title: 'Grid System', ab:'GS'},
    //         {path: 'panels', title: 'Panels', ab:'P'},
    //         {path: 'sweet-alert', title: 'Sweet Alert', ab:'SA'},
    //         {path: 'notifications', title: 'Notifications', ab:'N'},
    //         {path: 'icons', title: 'Icons', ab:'I'},
    //         {path: 'typography', title: 'Typography', ab:'T'}
    //     ]
    // },
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})


export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;
    userConected: string;

    constructor(private router: Router) {

    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        const sst = sessionStorage;
        this.userConected = `${sst.getItem('fullName')} `;
        this.menuItems = ROUTES.filter(menuItem => {
            const logedRol = sst.profile;
            if (menuItem.roles.includes(logedRol)) {
                return true;
            }
            return false;
        });


        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    onLogOut() {
        this.router.navigate(['/auth/login']);
    }
}
