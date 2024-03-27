import { ProfileModel } from '../../auth/models/profile.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { MustMatch } from '../../shared/validators/must-match.validator';
import { UserModel } from '../model/user.model';
import { UsersProperties } from '../properties/users.properties';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-add-update',
  templateUrl: './users-add-update.component.html',
  styleUrls: ['./users-add-update.component.css']
})
export class UsersAddUpdateComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public profiles: Array<ProfileModel>;
  public subscriptions: Array<Subscription> = [];
  public userSel: UserModel;
  public formTitle: string = 'Add user';

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.userSel = this.userService.userSelected;
    sessionStorage.setItem('title', 'Users');

    if (this.userSel) {
      this.formTitle = 'Edit user';
    }
    this.initializeForm();
  }

  initializeForm() {
    this.registerUserForm = this.fb.group({
      fullName: ['', [Validators.required]],
      socialSecurityNumber: ['', []],
      mail: ['', [Validators.required, Validators.email]],
      businessPosition: ['', []],
      profileId: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    if (this.userSel) {
      this.registerUserForm.patchValue(this.userSel);
    }

    this.subscriptions.push(this.userService.getRoles().subscribe(result => {
      if(result){
        this.profiles = result;
      }
    }));
  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue: UserModel = this.registerUserForm.value;

    if (this.userSel) {
      formValue.id = this.userSel.id;
    }

    this.subscriptions.push(this.userService.saveUser(formValue).subscribe(async value => {
      const textRegistro = this.userSel ? 'edited' : 'registered';
      await this.modalService.open(
        {
          title: `User ${textRegistro}`,
          text: `The user was ${textRegistro} successfully.`,
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

      if (err.error === UsersProperties.MAIL_DUPL_MSG) {
        await this.modalService.open(
          {
            title: 'Duplicate User',
            text: 'The email or RUT you are trying to add is already registered.',
            icon: 'info',
            showCancelButton: false,
            acceptText: 'Accept',
            confirmIdentifier: 'btn-SaveUser'
          }
        );
      } else {
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    }));

  }

  goBack() {
    this.router.navigate(['users']);
  }

  ngOnDestroy() {
    this.userService.userSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());

  }

}

