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

@Component({
  selector: 'app-add-update-letter',
  templateUrl: './add-update-letter.component.html',
  styleUrls: ['./add-update-letter.component.css']
})
export class AddUpdateLetterComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Create new letter.';
  public isReadOnly: boolean;
  public element: LetterModel;

  public subscriptions: Array<Subscription> = [];
  public realtorList: Array<RealtorModel>;
  public clientList: Array<ClientModel>;

  public clientFormList: Array<ClientSelectModel> = [];
  public realtorFormList: Array<RealtorModel> = [];

  dtOptions: DataTables.Settings = {};
  public tblData: ClientSelectModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;



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

    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.element = this.letterService.elementSelected;
    this.initForm();

    if (this.element) {
      this.initLoad(this.element);
      this.formTitle = 'Edit letter';
    } else {
      this.initLoad();
      sessionStorage.setItem('title', this.formTitle);
    }
  }

  get registerFormControls() { return this.registerForm.controls; }

  initLoad(element = null) {
    this.loadingService.show();
    this.dtOptions = this.getDtOptions();
    this.subscriptions.push(
      zip(
        this.realtorService.getAll(),
        this.clientService.getAll()
      ).subscribe(async result => {
        this.loadingService.hide();
        this.realtorList = result[0];
        this.clientList = result[1];
        this.initClientList(element);
        if (element)
          this.registerForm.patchValue(element);
          this.registerFormControls.realtors.setValue(element.realtors);
          this.realtorFormList = element.realtors
      })
    );
  }

  async initForm() {

    if (this.isReadOnly) {
      this.registerForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        active: [{ value: null, disabled: true }, []],
        deleted: [{ value: null, disabled: true }, []],
        hoa: [{ value: null, disabled: true }, []],
        insurance: [{ value: null, disabled: true }, []],
        interest: [{ value: null, disabled: true }, []],
        loanAmount: [{ value: null, disabled: true }, []],
        loanTerm: [{ value: null, disabled: true }, []],
        loanType: [{ value: null, disabled: true }, []],
        location: [{ value: null, disabled: true }, []],
        ltv: [{ value: null, disabled: true }, []],
        maxPay: [{ value: null, disabled: true }, []],
        mi: [{ value: null, disabled: true }, []],
        price: [{ value: null, disabled: true }, []],
        taxes: [{ value: null, disabled: true }, []],
        uniqueKey: [{ value: null, disabled: true }, []],
        realtors: [{ value: null, disabled: true }, []]
      }
      );

    } else {
      this.registerForm = this.fb.group({
        id: ['', []],
        active: ['', []],
        deleted: ['', []],
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
        taxes: ['', [Validators.required]],
        uniqueKey: ['', []],
        realtors: ['', [Validators.required]]
      }
      );
    }
  }

  async initClientList(element: LetterModel) {
    this.clientList.forEach(item => {
      const found = element ? element.clients.find(x => x.id === item.id) : null;
      this.clientFormList.push(
        {
          selected: found ? true : false,
          id: item.id,
          cellphone: item.cellphone,
          email: item.email,
          lastName: item.lastName,
          mailingAdd: item.mailingAdd,
          name: item.name
        }
      )
    });
    this.renderedClientTable();
  }

  onCheckChangeSelected(id: number, isChecked: boolean) {
    let x = this.clientFormList.find((row) => row.id === id);

    let index = this.clientFormList.indexOf(x);

    x.selected = isChecked;
    this.clientFormList[index] = x;
  }

  onEventDropDownChanged(i: Array<RealtorModel>) {
    this.realtorFormList = [];
    i.forEach(item => {
      this.realtorFormList.push({
        id: item.id,
        cellphone: item.cellphone,
        email: item.email,
        lastName: item.lastName,
        licenseNumber: item.licenseNumber,
        mailingAdd: item.mailingAdd,
        name: item.name,
        notes: item.notes
      });
    });
  }

  goBack() {
    this.letterService.elementSelected = null;
    this.router.navigate(['letters/list']);
  }

  onRegisterSubmit() {
    const formValue: LetterModel = this.registerForm.value;
    if (this.element) {
      formValue.id = this.element.id;
      formValue.uniqueKey = this.element.uniqueKey;
      formValue.operationId = this.element.operationId;
      formValue.operationName = this.element.operationName;
    }

    formValue.clients = this.getSelected();
    formValue.realtors = this.realtorFormList;

    this.subscriptions.push(this.letterService.save(formValue).subscribe(async response => {
      const textRegistro = this.element ? 'edited' : 'registered';

      await this.modalService.open(
        {
          title: `Letter ${textRegistro}`,
          text: `The letter was ${textRegistro} successfully.`,
          icon: 'success',
          showCancelButton: false,
          acceptText: 'Accept',
          confirmIdentifier: 'btn-SaveProperty'
        }
      );
      this.registerForm.reset();
      this.formDirective.resetForm();
      this.goBack();
    }, async err => {
      if (err.error === 'OPERATION_DUPL') {
        this.modalService.open({
          icon: 'error',
          text: 'A transaction already exists with the same customer data as the realtor and loan ofi, test other data or edit the existing letter',
          title: 'Duplicate operation',
          acceptText: 'Accept'
        });
      } else if (err.error === 'MSG_MAX_PAYMENT_TO_HIGH') {
        this.modalService.open({
          icon: 'error',
          text: 'An error has occurred, Max Payment to high',
          title: 'Operation',
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

  getSelected(): Array<ClientModel> {
    let list: Array<ClientModel> = [];
    this.clientFormList.filter(x => x.selected).forEach(item => {
      list.push({
        id: item.id,
        cellphone: item.cellphone,
        email: item.email,
        lastName: item.lastName,
        mailingAdd: item.mailingAdd,
        name: item.name
      });
    });
    return list;
  }

  async renderedClientTable() {
    this.tblData = this.clientFormList;

    //inicializo la datatable de cliente
    const dtInstance = await this.dtElement?.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTrigger.next();
    this.loadingService.hide();
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
