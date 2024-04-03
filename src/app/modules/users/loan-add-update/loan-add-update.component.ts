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
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { BrokerCompanyService } from '../services/broker-company.service';
import { SharedProperties } from '../../shared/properties/shared.properties';
import { LoanOfficerModel } from '../model/loan.model';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-loan-add-update',
  templateUrl: './loan-add-update.component.html',
  styleUrls: ['./loan-add-update.component.css']
})
export class LoanAddUpdateComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public userSel: UserModel;
  public selected: LoanOfficerModel;
  public formTitle: string = 'Add Realtor';

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loanService: LoanService,
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
  }

  initializeForm() {
    this.registerUserForm = this.fb.group({
      id: ['', []],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]],
      mailingAdd: [''],
      nmls: [''],
      profileId: ['', ],
      profileName: ['LOAN',],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      });

    if (this.userSel) {
      
      this.subscriptions.push(
        this.userService.getLoan(this.userSel).subscribe({
          next: (result) => {
            if (result) {
              this.selected = result;
              this.registerUserForm.patchValue(this.selected);
              this.registerFormControls.password.setValue('');
            }
          },
          error: async (err) => {
            const modalResult = await this.modalService.open({ genericType: 'error-gen' });
            if (modalResult) {
              this.initializeForm();
            }
          }
        })
      );
    }
  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue: LoanOfficerModel = this.registerUserForm.value;

    if (this.selected) {
      formValue.id = this.selected.id;
    }
    formValue.profileCode = SharedProperties.ROL_LOAN;
    this.subscriptions.push(this.loanService.save(formValue).subscribe(async value => {
      const textRegistro = this.userSel ? 'edited' : 'registered';
      await this.modalService.open(
        {
          title: `Loan Officer ${textRegistro}`,
          text: `The loan officer was ${textRegistro} successfully.`,
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
    this.router.navigate(['users/index/0']);
  }

  ngOnDestroy() {
    this.userService.userSelected = null;
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

