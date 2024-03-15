import { BrandService } from './../../service/brand.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ModelModel } from '../../models/model.model';
import { MaintainerProperties } from '../../properties/maintainer.properties';
import { ModelService } from '../../service/model.service';
import { ItemModel } from '../../models/item.model';

@Component({
  selector: 'app-add-update-model',
  templateUrl: './add-update-model.component.html',
  styleUrls: ['./add-update-model.component.css']
})
export class AddUpdateModelComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public brandList: Array<ItemModel>;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: ModelModel;
  public formTitle: string = 'Registro de modelo';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elemntService: ModelService,
    private brandService: BrandService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.elemntService.elementSelected;
    sessionStorage.setItem('title', 'Modelo');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Modelo';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {

    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        code: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []],
        measure: [{ value: null, disabled: true }, []],
        vehicleType: [{ value: null, disabled: true }, []],
        approximateYear: [{ value: null, disabled: true }, []],
        engineDescription: [{ value: null, disabled: true }, []],
        typeOfMotor: [{ value: null, disabled: true }, []],
        notes: [{ value: null, disabled: true }, []],
        mast: [{ value: null, disabled: true }, []],
        brandId: ['', [Validators.required]]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        code: ['', [Validators.required]],
        description: ['', [Validators.required]],
        measure: ['', []],
        vehicleType: ['', [Validators.required]],
        approximateYear: ['', []],
        engineDescription: ['', []],
        typeOfMotor: ['', []],
        notes: ['', []],
        mast: ['', []],
        brandId: ['', [Validators.required]]
      });
    }
      
    if (this.elementSelected) {
      this.registerFormControls.id.setValue(this.elementSelected.id);
      this.registerFormControls.code.setValue(this.elementSelected.code);
      this.registerFormControls.description.setValue(this.elementSelected.description);
      this.registerFormControls.measure.setValue(this.elementSelected.measure);
      this.registerFormControls.vehicleType.setValue(this.elementSelected.vehicleType);
      this.registerFormControls.approximateYear.setValue(this.elementSelected.approximateYear);
      this.registerFormControls.engineDescription.setValue(this.elementSelected.engineDescription);
      this.registerFormControls.typeOfMotor.setValue(this.elementSelected.typeOfMotor);
      this.registerFormControls.notes.setValue(this.elementSelected.notes);
      this.registerFormControls.mast.setValue(this.elementSelected.mast);
      this.registerFormControls.brandId.setValue(this.elementSelected.brandId);
    }

    this.subscriptions.push(this.brandService.getAll().subscribe(result => {
      if(result){
        this.brandList = result;
      }
    }));
  }

  get registerFormControls() { return this.registerItemForm.controls; }

  onRegisterSubmit() {
    const formValue = this.registerItemForm.value;
    if (this.elementSelected) {
      formValue.id = this.elementSelected.id;
    }else{
      formValue.id = null;
    }
    this.subscriptions.push(this.elemntService.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editado' : 'registrado';
      await this.modalService.open(
        {
          titulo: `Modelo ${textRegistro}`,
          texto: `El modelo fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarUser'
        }
      );
      this.registerItemForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {

      if (err.error === MaintainerProperties.MODEL_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Modelo duplicado',
            texto: 'El código que desea agregar ya se encuentra registrado.',
            icono: 'info',
            mostrarBotonCancelar: false,
            textoAceptar: 'Aceptar',
            identificadorConfirmar: 'btn-GuardarUser'
          }
        );
      } else {
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    }));
  }

  volver() {
    this.router.navigate(['maintainer/index/2']);
  }

  ngOnDestroy() {
    this.elemntService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

