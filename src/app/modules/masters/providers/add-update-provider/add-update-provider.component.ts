import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ProviderModel } from '../../models/provider.model';
import { CountryModel, ProvinceOrStateModel, RegionOrCityModel } from '../../models/province.region.country.model';
import { AddressService } from '../../service/address.service';
import { ProviderService } from '../../service/provider.service';

@Component({
  selector: 'app-add-update-provider',
  templateUrl: './add-update-provider.component.html',
  styleUrls: ['./add-update-provider.component.css']
})
export class AddUpdateProviderComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de proveedores';
  public providerForm: FormGroup;
  public provider: ProviderModel;
  public subscriptions: Array<Subscription> = [];

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
    public  dialog: MatDialog,
    private providerService: ProviderService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.provider = this.providerService.providerSelected;
    this.initForm();


    if (this.provider) {
      this.formTitle = 'Edición de proveedores';
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initLoad(provider = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.addressService.getCounties(),
        this.addressService.getRegionOrCity(-1),
        this.addressService.getProvinceOrState(-1),
      ).subscribe(result => {
        this.loadingService.hide();
        this.country = result[0];
        this.regionOrCity = result[1];
        this.provinceOrState = result[2];
        if (provider) {
          this.providerForm.patchValue(provider);
        }
      })
    );
  }


  initForm() {
    if (this.isReadOnly) {
      this.providerForm = this.fb.group({
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
        provinceOrStateId: [{ value: null, disabled: true }, []],
        regionOrCityId: [{ value: null, disabled: true }, []],
        countryId: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.providerForm = this.fb.group({
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
        provinceOrStateId: ['', [Validators.required]],
        regionOrCityId: ['', [Validators.required]],
        countryId: ['', [Validators.required]]
      }
      );
    }

    if (this.provider) {
      this.initLoad(this.provider);
    } else {
      this.initLoad();
    }

  }

  get providerFormControls() { return this.providerForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue = this.providerForm.value;
    if (this.provider) {
      formValue.proyectoId = this.provider.contactid;
    }

    this.subscriptions.push(this.providerService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.provider ? 'editado' : 'registrado';

      await this.modalService.open(
        {
          titulo: `Proveedor ${textRegistro}`,
          texto: `El proveedor fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.providerForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'PROVIDER_DUPL') {
        this.modalService.open({
          icono: 'error',
          texto: 'El rut o id ya se encuentra ingresado en otro proveedor.',
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
        this.providerFormControls.countryId.setValue(countryId);
      })
    );
  }
  onRegionSelectChange(regionId, regionDefaultSelected = null) {
    this.isLoadingProvidence = true;
    this.subscriptions.push(
      this.addressService.getProvinceOrState(regionId).subscribe(providence => {
        this.provinceOrState = providence;
        this.isLoadingProvidence = false;
        this.providerFormControls.regionOrCityId.setValue(regionId);
      })
    );
  }


  toUpperRef() {
    const formValue = this.providerForm.value;
    if (formValue.proyectoCorrelativoId) {
      this.providerFormControls.proyectoCorrelativoId.setValue(formValue.proyectoCorrelativoId.toUpperCase());
    }
  }

  volver() {
    this.providerService.providerSelected = null;
    this.router.navigate(['masters/index/2']);
  }

  ngOnDestroy() {
    this.providerService.providerSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }


}
