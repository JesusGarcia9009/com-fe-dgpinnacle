import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { MustMatch } from '../../shared/validators/must-match.validator';
import { UserModel } from '../model/user.model';
import { UsersProperties } from '../properties/users.properties';
import { UserService } from '../services/user.service';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { RealtorManagerService } from '../services/realtor-manager.service';
import { BrokerCompanyModel } from '../model/broker.company.model';
import { BrokerCompanyService } from '../services/broker-company.service';
import { ProfileModel } from '../../auth/models/profile.model';
import { SharedProperties } from '../../shared/properties/shared.properties';

@Component({
  selector: 'app-realtor-add-update',
  templateUrl: './realtor-add-update.component.html',
  styleUrls: ['./realtor-add-update.component.css']
})
export class RealtorAddUpdateComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public profiles: Array<ProfileModel>;
  public brockerCompanyList: Array<BrokerCompanyModel>;
  public subscriptions: Array<Subscription> = [];
  public userSel: UserModel;
  public selected: RealtorManagerModel;
  public formTitle: string = 'Add Realtor';

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private realtorService: RealtorManagerService,
    private modalService: ModalService,
    private router: Router,
    private sharedService: SharedService,
    private brokerCompanyService: BrokerCompanyService
  ) { }

  ngOnInit(): void {
    this.userSel = this.userService.userSelected;
    sessionStorage.setItem('title', 'Realtors');

    if (this.userSel) {
      this.formTitle = 'Edit realtor';


      
    }
    this.initializeForm();
    this.subscriptions.push(this.brokerCompanyService.getAll().subscribe(result => {
      if(result){
        this.brockerCompanyList = result;
      }
    }));
  }

  initializeForm() {
    this.registerUserForm = this.fb.group({
      id: ['', []],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]],
      mailingAdd: [''],
      licenseNumber: ['', Validators.required],
      notes: [''],
      brokerCompanyId: ['', Validators.required],
      brokerCompanyName: ['', ],
      brokerCompanyPhone: ['', ],
      brokerCompanyPhysicalAdd: ['', ],
      brokerCompanyWebSite: ['', ],
      profileId: ['', Validators.required],
      profileName: ['REALTOR', ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    });

    const roles$ = this.userService.getRoles();
    const realtor$ = this.userService.getRealtor(this.userSel);
  
    const combinedSub = forkJoin([roles$, realtor$]).subscribe(
      ([roles, realtor]) => {
        if (roles) {
          this.profiles = roles;
        }
        if (realtor) {
          this.selected = realtor;
          this.registerUserForm.patchValue(this.selected);
          this.registerFormControls.password.setValue('');
        }
      },
      async error => {
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    );
    this.subscriptions.push(combinedSub);
  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue: RealtorManagerModel = this.registerUserForm.value;

    if (this.selected) {
      formValue.id = this.selected.id;
    }
    formValue.profileCode = SharedProperties.ROL_REALTOR;    
    this.subscriptions.push(this.realtorService.save(formValue).subscribe(async value => {
      const textRegistro = this.userSel ? 'edited' : 'registered';
      await this.modalService.open(
        {
          title: `Realtor ${textRegistro}`,
          text: `The realtor was ${textRegistro} successfully.`,
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
            title: 'Duplicate Realtor',
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
    this.router.navigate(['users/index/1']);
  }

  ngOnDestroy() {
    this.userService.userSelected = null;
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

