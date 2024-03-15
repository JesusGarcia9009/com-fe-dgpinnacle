import { ItemModel } from '../../../maintainer/models/item.model';
import { ClientService } from './../../service/client.service';
import { RegionOrCityModel, CountryModel } from '../../models/province.region.country.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ProvinceOrStateModel } from '../../models/province.region.country.model';
import { AddressService } from '../../service/address.service';
import { ClientModel } from '../../models/client.model';
import { PaymentMethodModel } from '../../../maintainer/models/payment.method.model';
import { DeliverytypeService } from 'src/app/modules/maintainer/service/deliverytype.service';
import { PaymentmethodService } from 'src/app/modules/maintainer/service/paymentmethod.service';

@Component({
  selector: 'app-add-update-client',
  templateUrl: './add-update-client.component.html',
  styleUrls: ['./add-update-client.component.css']
})
export class AddUpdateClientComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de clientes';
  public clientForm: FormGroup;
  public client: ClientModel;
  public subscriptions: Array<Subscription> = [];


  public deliveryType: Array<ItemModel>;
  public paymentMethod: Array<PaymentMethodModel>;
  public provinceOrState: Array<ProvinceOrStateModel>;
  public regionOrCity: Array<RegionOrCityModel>;
  public country: Array<CountryModel>;

  public isLoadingRegion: boolean;
  public isLoadingProvidence: boolean;
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private clientService: ClientService,
    private addressService: AddressService,
    private deliverytypeService: DeliverytypeService,
    private paymentmethodService: PaymentmethodService
  ) { }

  ngOnInit() {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.client = this.clientService.clientSelected;
    this.initForm();


    if (this.client) {
      this.formTitle = 'Edición de cliente';
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initLoad(client = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.addressService.getCounties(),
        this.addressService.getRegionOrCity(-1),
        this.addressService.getProvinceOrState(-1),
        this.deliverytypeService.getAll(),
        this.paymentmethodService.getAll()
      ).subscribe(result => {
        this.loadingService.hide();
        this.country = result[0];
        this.regionOrCity = result[1];
        this.provinceOrState = result[2];
        this.deliveryType = result[3];
        this.paymentMethod = result[4];
        if (client) {
          this.clientForm.patchValue(client);
        }
      })
    );
  }


  initForm() {
    if (this.isReadOnly) {
      this.clientForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        rutOrId: [{ value: null, disabled: true }, []],
        fantasyName: [{ value: null, disabled: true }, []],
        businessName: [{ value: null, disabled: true }, []],
        address: [{ value: null, disabled: true }, []],
        transport: [{ value: null, disabled: true }, []],
        deliveryObservation: [{ value: null, disabled: true }, []],
        attachedDocument: [{ value: null, disabled: true }, []],
        //CONTACT
        contactid: [{ value: null, disabled: true }, []],
        contactName: [{ value: null, disabled: true }, []],
        contactphone: [{ value: null, disabled: true }, []],
        contactcellPhone: [{ value: null, disabled: true }, []],
        contactbusinessMail: [{ value: null, disabled: true }, []],
        deliveryTypeId: [{ value: null, disabled: true }, []],
        paymentMethodId: [{ value: null, disabled: true }, []],
        provinceOrStateId: [{ value: null, disabled: true }, []],
        regionOrCityId: [{ value: null, disabled: true }, []],
        countryId: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.clientForm = this.fb.group({
        id: ['', []],
        rutOrId: ['', [Validators.required]],
        fantasyName: ['', [Validators.required]],
        businessName: ['', [Validators.required]],
        address: ['', [Validators.required]],
        transport: ['', []],
        deliveryObservation: ['', []],
        attachedDocument: ['', []],
        //CONTACT
        contactid: ['', []],
        contactName: ['', [Validators.required]],
        contactphone: ['', []],
        contactcellPhone: ['', []],
        contactbusinessMail: ['', []],
        deliveryTypeId: ['', [Validators.required]],
        paymentMethodId: ['', [Validators.required]],
        provinceOrStateId: ['', [Validators.required]],
        regionOrCityId: ['', [Validators.required]],
        countryId: ['', [Validators.required]]
      }
      );
    }

    if (this.client) {
      this.initLoad(this.client);
    } else {
      this.initLoad();
    }

    // this.subscriptions.push(this.clientFormControls.proyectoCorrelativoId.valueChanges.subscribe(val => {
    //   this.clientFormControls.proyectoCorrelativoId.patchValue(val.toUpperCase(), {emitEvent: false});
    // }));


    // this.subscriptions.push(this.clientFormControls.comunaFilter.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(nombreComuna => {
    //       if (nombreComuna) {
    //         return this.filtrarComunas(nombreComuna);
    //       }
    //       return this.listaComunas.slice();
    //     })
    //   ).subscribe(result => {
    //     this.listaComunasFilter = result;
    //   }));



  }

  // filtrarComunas(nombreComuna: string) {
  //   return this.listaComunas.filter(comuna =>
  //     comuna.value.toLowerCase().indexOf(nombreComuna.toLowerCase()) === 0);
  // }

  get clientFormControls() { return this.clientForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue = this.clientForm.value;
    if (this.client) {
      formValue.proyectoId = this.client.contactid;
    }

    this.subscriptions.push(this.clientService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.client ? 'editado' : 'registrado';

      await this.modalService.open(
        {
          titulo: `Cliente ${textRegistro}`,
          texto: `El cliente fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.clientForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'MSG_REF_DUPL') {
        this.modalService.open({
          icono: 'error',
          texto: 'El Id o rut ya se encuentra ingresado.',
          titulo: 'Código duplicado',
          textoAceptar: 'Aceptar'
        })
      } else {
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }

    }));
  }

  onCountrySelectChange(countryId, countryDefaultSelected = null) {
    this.isLoadingRegion = true;
    this.subscriptions.push(
      this.addressService.getRegionOrCity(countryId).subscribe(region => {
        this.regionOrCity = region;
        this.isLoadingRegion = false;
        this.clientFormControls.countryId.setValue(countryId);
      })
    );
  }
  onRegionSelectChange(regionId, regionDefaultSelected = null) {
    this.isLoadingProvidence = true;
    this.subscriptions.push(
      this.addressService.getProvinceOrState(regionId).subscribe(providence => {
        this.provinceOrState = providence;
        this.isLoadingProvidence = false;
        this.clientFormControls.regionOrCityId.setValue(regionId);
      })
    );
  }


  toUpperRef() {
    const formValue = this.clientForm.value;
    if (formValue.proyectoCorrelativoId) {
      this.clientFormControls.proyectoCorrelativoId.setValue(formValue.proyectoCorrelativoId.toUpperCase());
    }
  }

  volver() {
    this.clientService.clientSelected = null;
    this.router.navigate(['masters/index/1']);
  }

  ngOnDestroy() {
    this.clientService.clientSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }


}
