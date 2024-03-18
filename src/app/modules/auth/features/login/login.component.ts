import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, AfterViewInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/modules/core/core/services/common.service';
import { LoginProperties } from '../../properties/login.properties';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LoginRequestModel } from '../../models/login.model';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { Router } from '@angular/router';
import { SharedProperties } from 'src/app/modules/shared/properties/shared.properties';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    public loginForm: FormGroup;
    public isShowPassword: boolean;
    public passwordType = LoginProperties.PASS_TYPE_PASSWORD;
    public subscriptions: Array<Subscription> = [];
    public isShowForm: boolean;

    constructor(
        private element: ElementRef,
        private fb: FormBuilder,
        private commonService: CommonService,
        private loadingService: LoadingService,
        private authService: AuthService,
        private modalService: ModalService,
        private router: Router,
        private renderer: Renderer2
    ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }


    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        this.commonService.removeToken();
        this.initForm();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.isShowForm = true;
        }, 500);
    }


    initForm() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
        });
    }
    get loginFormControls() { return this.loginForm.controls; }


    turnOffPassword() {

        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        this.isShowPassword = !this.isShowPassword;
    }


    onLoginSubmit() {

        this.loadingService.show();

        const loginReq: LoginRequestModel = {
            username: this.loginFormControls.username.value,
            password: this.loginFormControls.password.value
        };

        this.subscriptions.push(this.authService.login(loginReq).subscribe(resp => {
            this.loadingService.hide();
            this.isShowForm = false;
            this.authService.registerLoginInfo(resp);

            const sst = sessionStorage;
            const logedRol = sst.rolClave;

            this.router.navigate(['/inicio']);
            // if (logedRol === SharedProperties.ROL_INV) {
            //     this.router.navigate(['/inversionista/dashboard']);
            // } else {
                
            // }


        }, async err => {
            this.loadingService.hide();
            // if (
            //   err.error && err.error.message.toString().toUpperCase() === LoginProperties.NO_AUTH) {
            //   this.modalService.open(
            //     {
            //       title: 'Error de autenticación',
            //       text: 'Usuario o contraseña erroneo, vuelva a intentarlo',
            //       icon: 'error',
            //       showCancelButton: false,
            //       acceptText: 'Aceptar',
            //       confirmIdentifier: 'btn-AceptarBadUserOrPass'
            //     }
            //   );
            // } else {

            if (err.error === LoginProperties.LOGIN_ERRONEO) {
                this.modalService.open(
                    {
                        title: 'Error de autenticación',
                        text: 'Usuario o contraseña erroneo, vuelva a intentarlo',
                        icon: 'error',
                        showCancelButton: false,
                        acceptText: 'Aceptar',
                        confirmIdentifier: 'btn-AceptarBadUserOrPass'
                    });
            } else {
                const modalResult = await this.modalService.open({ genericType: 'error-gen' });
                if (modalResult) {
                    this.onLoginSubmit();
                }
            }
        }));

    }

    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            (subscription) => subscription.unsubscribe());

        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }
}
