import { MaintainerProperties } from './../../properties/maintainer.properties';
import { BrandService } from './../../service/brand.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemModel } from '../../models/item.model';

@Component({
  selector: 'app-add-update-brand',
  templateUrl: './add-update-brand.component.html',
  styleUrls: ['./add-update-brand.component.css']
})
export class AddUpdateBrandComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: ItemModel;
  public formTitle: string = 'Registro de marca';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private brandService: BrandService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.brandService.elementSelected;
    sessionStorage.setItem('title', 'Marca');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Marca';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {

    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        code: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        code: ['', [Validators.required]],
        description: ['', [Validators.required]]
      });
    }
    
      
    if (this.elementSelected) {
      this.registerFormControls.id.setValue(this.elementSelected.id);
      this.registerFormControls.code.setValue(this.elementSelected.code);
      this.registerFormControls.description.setValue(this.elementSelected.description);
    }
  }

  get registerFormControls() { return this.registerItemForm.controls; }

  onRegisterSubmit() {
    const formValue = this.registerItemForm.value;
    if (this.elementSelected) {
      formValue.id = this.elementSelected.id;
    }else{
      formValue.id = null;
    }
    this.subscriptions.push(this.brandService.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editada' : 'registrada';
      await this.modalService.open(
        {
          titulo: `Marca ${textRegistro}`,
          texto: `La marca fue ${textRegistro} correctamente.`,
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

      if (err.error === MaintainerProperties.BRAND_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Marca duplicada',
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
    this.router.navigate(['maintainer/index/0']);
  }

  ngOnDestroy() {
    this.brandService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

