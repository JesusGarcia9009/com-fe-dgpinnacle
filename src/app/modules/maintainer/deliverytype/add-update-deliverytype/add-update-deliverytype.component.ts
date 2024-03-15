import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemModel } from '../../models/item.model';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { DeliverytypeService } from '../../service/deliverytype.service';
import { MaintainerProperties } from '../../properties/maintainer.properties';

@Component({
  selector: 'app-add-update-deliverytype',
  templateUrl: './add-update-deliverytype.component.html',
  styleUrls: ['./add-update-deliverytype.component.css']
})
export class AddUpdateDeliverytypeComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: ItemModel;
  public formTitle: string = 'Registro de via de despacho';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementService: DeliverytypeService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.elementService.elementSelected;
    sessionStorage.setItem('title', 'Formas de despacho');

    if (this.elementSelected) {
      this.formTitle = 'Edición de formas de despacho';
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
    this.subscriptions.push(this.elementService.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editada' : 'registrada';
      await this.modalService.open(
        {
          titulo: `Forma de despacho ${textRegistro}`,
          texto: `La forma de despacho fue ${textRegistro} correctamente.`,
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

      if (err.error === MaintainerProperties.DELIVERY_TYPE_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Forma de despacho duplicada',
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
    this.router.navigate(['maintainer/index/4']);
  }

  ngOnDestroy() {
    this.elementService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

