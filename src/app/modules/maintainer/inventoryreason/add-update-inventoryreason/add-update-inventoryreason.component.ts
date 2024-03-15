import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InventoryReasonModel } from '../../models/inventory.reason.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryreasonService } from '../../service/inventoryreason.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { MaintainerProperties } from '../../properties/maintainer.properties';

@Component({
  selector: 'app-add-update-inventoryreason',
  templateUrl: './add-update-inventoryreason.component.html',
  styleUrls: ['./add-update-inventoryreason.component.css']
})
export class AddUpdateInventoryreasonComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: InventoryReasonModel;
  public formTitle: string = 'Registro de entregas';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: InventoryreasonService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.service.elementSelected;
    sessionStorage.setItem('title', 'Motivo de inventario');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Motivo de inventario';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {

    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        description: ['', [Validators.required]]
      });
    }
    
      
    if (this.elementSelected) {
      this.registerFormControls.id.setValue(this.elementSelected.id);
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
    this.subscriptions.push(this.service.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editado' : 'registrado';
      await this.modalService.open(
        {
          titulo: `Motivo de inventario ${textRegistro}`,
          texto: `El motivo de inventario fue ${textRegistro} correctamente.`,
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

      if (err.error === MaintainerProperties.INVENTORY_REASON_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Motivo de inventario duplicado',
            texto: 'El registro de motivo de inventario que desea agregar ya se encuentra registrado.',
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
    this.service.elementSelected = null;
    this.router.navigate(['maintainer/index/8']);
  }

  ngOnDestroy() {
    this.service.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}


