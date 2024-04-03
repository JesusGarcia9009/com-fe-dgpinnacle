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
        path: '/start',
        title: 'Home',
        type: 'link',
        icontype: 'home',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN, SharedProperties.ROL_REALTOR, SharedProperties.ROL_VIEWVER]
    },
    {
        path: '/letters/list',
        title: 'Letter Manager',
        type: 'link',
        icontype: 'data_usage',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN, , SharedProperties.ROL_REALTOR]
    },
    {
        path: '/letters/add-upd-letter',
        title: 'Create letter',
        type: 'link',
        icontype: 'build',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN, SharedProperties.ROL_REALTOR]
    },
    {
        path: '/letters/add-letter-enc',
        title: 'Create letter Encompass',
        type: 'link',
        icontype: 'create',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN]
    },
    {
        path: '/letters/calculator-letter',
        title: 'Calculator',
        type: 'link',
        icontype: 'attach_money',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN, SharedProperties.ROL_REALTOR, SharedProperties.ROL_VIEWVER]
    },
    {
        path: '/client/list',
        title: 'Client Manager',
        type: 'link',
        icontype: 'local_atm',
        roles: [SharedProperties.ROL_ADMIN, SharedProperties.ROL_LOAN]
    },
    {
        path: '/users/index/0',
        title: 'Users',
        type: 'link',
        icontype: 'supervised_user_circle',
        roles: [SharedProperties.ROL_ADMIN , SharedProperties.ROL_LOAN]
    }

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
