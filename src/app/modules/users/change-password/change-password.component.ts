import { ProfileModel } from '../../auth/models/profile.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { MustMatch } from '../../shared/validators/must-match.validator';
import { ChangePasswordModel, UserModel } from '../model/user.model';
import { UsersProperties } from '../properties/users.properties';
import { UserService } from '../services/user.service';
import { SharedProperties } from '../../shared/properties/shared.properties';
import { LoginData } from '../model/login-data.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements  OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public selected: LoginData;
  public profile: string;
  public formTitle: string = 'Change password';

  @ViewChild('myInput') myInput: ElementRef; 

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    sessionStorage.setItem('title', "User profile");
    this.initializeForm();
    this.selected = this.getLoginData();

    if (this.selected) {
      this.registerFormControls.id.setValue(this.selected.idUser);
      this.registerFormControls.fullName.setValue(this.selected.fullName);
      this.registerFormControls.email.setValue(this.selected.email);
    }

  }

  public getLoginData(): LoginData {
    try {
      return this.parseJwt(sessionStorage.getItem('token'));
    } catch (err) {
      throw err;
    }
  }

  

  initializeForm() {
    this.registerUserForm = this.fb.group({
      id: ['', []],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue: ChangePasswordModel = this.registerUserForm.value;
    formValue.id = this.selected.idUser;
    this.subscriptions.push(this.userService.changePassword(formValue).subscribe(async value => {
      await this.modalService.open(
        {
          title: `User password`,
          text: `The user was updated successfully.`,
          icon: 'success',
          showCancelButton: false,
          acceptText: 'Accept',
          confirmIdentifier: 'btn-SaveUser'
        }
      );
      this.registerUserForm.reset();
      this.formDirective.resetForm();
      this.goBack();
    }, async err => {
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.onRegisterSubmit();
      }
    }));

  }

  goBack() {
    this.router.navigate(['start']);
  }

  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  ngOnDestroy() {
    this.userService.userSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());

  }

}

