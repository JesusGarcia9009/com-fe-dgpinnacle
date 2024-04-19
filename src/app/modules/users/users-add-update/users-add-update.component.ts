import { ProfileModel } from '../../auth/models/profile.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { MustMatch } from '../../shared/validators/must-match.validator';
import { UserModel } from '../model/user.model';
import { UsersProperties } from '../properties/users.properties';
import { UserService } from '../services/user.service';
import { SharedProperties } from '../../shared/properties/shared.properties';

@Component({
  selector: 'app-users-add-update',
  templateUrl: './users-add-update.component.html',
  styleUrls: ['./users-add-update.component.css']
})
export class UsersAddUpdateComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public userSel: UserModel;
  public profile: string;
  public formTitle: string = 'Add user';

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
    const profileUrl = this.route.snapshot.paramMap.get('profile');
    this.profile = profileUrl;
    this.userSel = this.userService.userSelected;

    sessionStorage.setItem('title', this.profile === SharedProperties.ROL_VIEWVER ? 'Viewers': 'Administrator' );

    if (this.userSel) {
      this.formTitle = `Edit ${this.profile === SharedProperties.ROL_VIEWVER ? 'Viewers': 'Administrator'}`;
    }else{
      this.formTitle = `Add ${this.profile === SharedProperties.ROL_VIEWVER ? 'Viewers': 'Administrator'}`;
    }
    this.initializeForm();
  }

  initializeForm() {
    this.registerUserForm = this.fb.group({
      id: ['', []],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]],
      mailingAdd: [''],
      profileId: ['', ],
      profileName: [this.profile,],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    if (this.userSel) {
      this.registerUserForm.patchValue(this.userSel);
      this.registerFormControls.password.setValue('');
    }

  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue: UserModel = this.registerUserForm.value;

    if (this.userSel) {
      formValue.id = this.userSel.id;
    }
    formValue.profileCode = this.profile;
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
            text: 'The email or cellphone you are trying to add is already registered.',
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
    if(this.profile === SharedProperties.ROL_VIEWVER){
      this.router.navigate(['users/index/2']);
    }else{
      this.router.navigate(['users/index/3']);
    }
    
  }

  ngOnDestroy() {
    this.userService.userSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());

  }

}

