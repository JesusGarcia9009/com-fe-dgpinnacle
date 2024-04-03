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
import { RegisterModel } from '../../models/register.model';

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
    public registerForm: FormGroup;
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
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            cellphone: ['', [Validators.required]],
            mailingAdd: [''],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });

    }
    get loginFormControls() { return this.loginForm.controls; }
    get registerFormControls() { return this.registerForm.controls; }

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

            this.router.navigate(['/start']);
        }, async err => {
            this.loadingService.hide();
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

    onRegisterSubmit() {
        const formValue: RegisterModel = this.registerForm.value;

        this.subscriptions.push(this.authService.register(formValue).subscribe(async value => {
            await this.modalService.open(
                {
                    title: `User ${formValue.name + ' ' + formValue.lastName}`,
                    text: `The user was register successfully.`,
                    icon: 'success',
                    showCancelButton: false,
                    acceptText: 'Accept',
                    confirmIdentifier: 'btn-SaveUser'
                }
            );
            const loginReq: LoginRequestModel = {
                username: formValue.email,
                password: formValue.password
            };
            this.subscriptions.push(this.authService.login(loginReq).subscribe(resp => {
                this.loadingService.hide();
                this.isShowForm = false;
                this.authService.registerLoginInfo(resp);

                const sst = sessionStorage;
                const logedRol = sst.rolClave;

                this.router.navigate(['/start']);
            }));

        }, async err => {
            if (err.error === LoginProperties.CLIENT_NOT_EXIST) {
                this.modalService.open(
                    {
                        title: 'Client Error',
                        text: 'Client does not exist in our records.',
                        icon: 'warning',
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
