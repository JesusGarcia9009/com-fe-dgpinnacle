import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ClientManagerModel } from '../model/client.manager.model';
import { ClientManagerService } from '../services/client-manager.service';

@Component({
  selector: 'app-add-update-client',
  templateUrl: './add-update-client.component.html',
  styleUrls: ['./add-update-client.component.css']
})
export class AddUpdateClientComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Client Registration';
  public clientForm: FormGroup;
  public client: ClientManagerModel;
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
    private clientService: ClientManagerService,
  ) { }

  ngOnInit() {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.client = this.clientService.elementSelected;
    this.initForm();
    if (this.client) {
      this.formTitle = 'Client Edition';
      this.clientForm.patchValue(this.client);
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initForm() {
    if (this.isReadOnly) {
      this.clientForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        cellphone: [{ value: null, disabled: true }, []],
        email: [{ value: null, disabled: true }, []],
        lastName: [{ value: null, disabled: true }, []],
        mailingAdd: [{ value: null, disabled: true }, []],
        name: [{ value: null, disabled: true }, []],
      }
      );
    } else {
      this.clientForm = this.fb.group({
        id: ['', []],
        cellphone:  ['', []],
        email: ['', [Validators.required, Validators.email]],
        lastName: ['', [Validators.required]],
        mailingAdd: ['', []],
        name: ['', [Validators.required]],
      }
      );
    }
  }

  get clientFormControls() { return this.clientForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue = this.clientForm.value;

    if (this.client) {
      formValue.id = this.client.id;
    }else{
      formValue.id = null;
    }
    
    this.subscriptions.push(this.clientService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.client ? 'edited' : 'registered';

      await this.modalService.open(
        {
          title: `Client ${textRegistro}`,
          text: `The client was ${textRegistro} successfully.`,
          icon: 'success',
          showCancelButton: false,
          acceptText: 'Accept',
          confirmIdentifier: 'btn-SaveProperty'
        }
      );
      this.clientForm.reset();
      this.formDirective.resetForm();
      this.goBack();
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'MSG_CLIENT_DUPL') {
        this.modalService.open({
          icon: 'error',
          text: 'The email is already registered.',
          title: 'Duplicate client',
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
    this.clientService.elementSelected = null;
    this.router.navigate(['client/list']);
  }

  ngOnDestroy() {
    this.clientService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }


}
