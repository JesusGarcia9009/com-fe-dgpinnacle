import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { RealtorManagerService } from '../services/realtor-manager.service';
import { BrokerCompanyModel } from '../model/broker.company.model';
import { BrokerCompanyService } from '../services/broker-company.service';

@Component({
  selector: 'app-add-update-realtor',
  templateUrl: './add-update-realtor.component.html',
  styleUrls: ['./add-update-realtor.component.css']
})
export class AddUpdateRealtorComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Realtor Registration';
  public realtorForm: FormGroup;
  public realtor: RealtorManagerModel;
  public brockerCompanyList: Array<BrokerCompanyModel>;
  public subscriptions: Array<Subscription> = [];

  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private realtorService: RealtorManagerService,
    private brokerCompanyService: BrokerCompanyService
  ) { }

  ngOnInit() {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.realtor = this.realtorService.elementSelected;
    this.initForm();
    if (this.realtor) {
      this.formTitle = 'Realtor Edition';
      this.realtorForm.patchValue(this.realtor);
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initForm() {
    if (this.isReadOnly) {
      this.realtorForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        cellphone: [{ value: null, disabled: true }, []],
        email: [{ value: null, disabled: true }, []],
        lastName: [{ value: null, disabled: true }, []],
        mailingAdd: [{ value: null, disabled: true }, []],
        name: [{ value: null, disabled: true }, []],
        notes: [{ value: null, disabled: true }, []],
        licenseNumber: [{ value: null, disabled: true }, []],
        brokerCompanyId: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.realtorForm = this.fb.group({
        id: ['', []],
        cellphone: ['', []],
        email: ['', [Validators.required, Validators.email]],
        lastName: ['', [Validators.required]],
        mailingAdd: ['', []],
        name: ['', [Validators.required]],
        notes: ['', []],
        licenseNumber: ['', [Validators.required]],
        brokerCompanyId: ['', []]
      }
      );
    }

    this.subscriptions.push(this.brokerCompanyService.getAll().subscribe(result => {
      if(result){
        this.brockerCompanyList = result;
      }
    }));
  }

  get realtorFormControls() { return this.realtorForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue = this.realtorForm.value;

    if (this.realtor) {
      formValue.id = this.realtor.id;
    } else {
      formValue.id = null;
    }

    this.subscriptions.push(this.realtorService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.realtor ? 'edited' : 'registered';

      await this.modalService.open(
        {
          title: `Realtor ${textRegistro}`,
          text: `The realtor was ${textRegistro} successfully.`,
          icon: 'success',
          showCancelButton: false,
          acceptText: 'Accept',
          confirmIdentifier: 'btn-SaveProperty'
        }
      );
      this.realtorForm.reset();
      this.formDirective.resetForm();
      this.goBack();
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'MSG_CLIENT_DUPL') {
        this.modalService.open({
          icon: 'error',
          text: 'The email is already registered.',
          title: 'Duplicate realtor',
          acceptText: 'Accept'
        })
      } else {
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }

    }));
  }


  goBack() {
    this.realtorService.elementSelected = null;
    this.router.navigate(['realtor/list']);
  }

  ngOnDestroy() {
    this.realtorService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }


}
