import { RealtorService } from './../services/realtor.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LetterModel } from '../models/letter.model';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { LetterService } from '../services/letter.service';
import { ClientService } from '../services/client.service';
import { Subject, Subscription, zip } from 'rxjs';
import { ClientModel, ClientSelectModel } from '../models/client.model';
import { RealtorModel } from '../models/realtor.model';
import { SharedService } from '../../shared/shared.service';
import { DataTableDirective } from 'angular-datatables';
import { ClientEncompassModel, LetterEncompassModel, LoanOfficerEncompassModel, RealtorEncompassModel } from '../models/encompass.letter.model';

@Component({
  selector: 'app-add-letter-encompass',
  templateUrl: './add-letter-encompass.component.html',
  styleUrls: ['./add-letter-encompass.component.css']
})
export class AddLetterEncompassComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Create new letter from Encompass.';
  public element: LetterEncompassModel;
  public loanOfficer: LoanOfficerEncompassModel;
  public clients: Array<ClientEncompassModel> = [];
  public realtors: Array<RealtorEncompassModel> = [];

  public subscriptions: Array<Subscription> = [];

  public searchForm: FormGroup;
  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private letterService: LetterService,
    private realtorService: RealtorService,
    private clientService: ClientService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {

    this.initForms();
    sessionStorage.setItem('title', this.formTitle);

  }

  get registerFormControls() { return this.registerForm.controls; }
  get searchFormControls() { return this.searchForm.controls; }

  async initForms() {

    this.searchForm = this.fb.group({
      idLoan: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      hoa: ['', [Validators.required]],
      insurance: ['', [Validators.required]],
      interest: ['', [Validators.required]],
      loanAmount: ['', [Validators.required]],
      loanTerm: ['', [Validators.required]],
      loanType: ['', [Validators.required]],
      location: ['', [Validators.required]],
      ltv: ['', [Validators.required]],
      maxPay: ['', [Validators.required]],
      mi: ['', [Validators.required]],
      price: ['', [Validators.required]],
      taxes: ['', [Validators.required]]
    });
  }

  goBack() {
    this.letterService.elementSelected = null;
    this.router.navigate(['letters/list']);
  }

  cancel() {
    this.element = null;
    this.loanOfficer = null;
    this.clients = [];
    this.realtors = [];
    this.searchForm.reset();
    this.registerForm.reset();
  }

  onRegisterSubmit() {
    const formValue: LetterEncompassModel = this.registerForm.value;
    formValue.clients = this.clients;
    formValue.realtors = this.realtors;
    formValue.loanOfficer = this.loanOfficer;

    this.subscriptions.push(this.letterService.saveEncompass(formValue).subscribe(async response => {
      if(response){
        await this.modalService.open(
          {
            title: `Letter`,
            text: `The letter was registered successfully.`,
            icon: 'success',
            showCancelButton: false,
            acceptText: 'Accept',
            confirmIdentifier: 'btn-SaveProperty'
          }
        );
        this.registerForm.reset();
        this.goBack();
      }else{
        await this.modalService.open({ genericType: 'error-gen' });
      }
    }, async err => {
      if (err.error === 'LOAN_NOT_EXIST') {
        this.modalService.open({
          icon: 'error',
          text: 'The LOAN OFFICER does not exist, please create before inserting the letter',
          title: 'Loan Officer',
          acceptText: 'Accept'
        });
      } else if (err.error === 'MSG_MAX_PAYMENT_TO_HIGH') {
        this.modalService.open({
          icon: 'error',
          text: 'An error has occurred, Max Payment to high',
          title: 'Letter Data',
          acceptText: 'Accept'
        });
      } else {
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    }));
  }

  onSearchSubmit() {
    this.loadingService.show();
    const loanId = this.searchFormControls.idLoan.value;
    this.subscriptions.push(this.letterService.findDetailsEncopass(loanId).subscribe(async response => {
      this.element = response;
      this.registerForm.patchValue(response);

      this.loanOfficer = response.loanOfficer;
      this.clients = response.clients;
      this.realtors = response.realtors;

      this.loadingService.hide();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.onSearchSubmit();
      }
    }));
  }

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      aoColumns: [
        { "bSortable": false },
        null,
        null,
        null
      ],
      responsive: false,
      ...defaultConf
    }
  }

  ngOnDestroy() {
    this.letterService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}
