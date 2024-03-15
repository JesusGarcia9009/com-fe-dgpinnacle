import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuotationDeliveryModel } from '../../models/quotation.delivery.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationdeliveryService } from '../../service/quotationdelivery.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { MaintainerProperties } from '../../properties/maintainer.properties';

@Component({
  selector: 'app-add-update-quotationdelivery',
  templateUrl: './add-update-quotationdelivery.component.html',
  styleUrls: ['./add-update-quotationdelivery.component.css']
})
export class AddUpdateQuotationdeliveryComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: QuotationDeliveryModel;
  public formTitle: string = 'Registro de entregas';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: QuotationdeliveryService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.service.elementSelected;
    sessionStorage.setItem('title', 'Entrega');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Entrega';
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
          titulo: `Entrega ${textRegistro}`,
          texto: `El registro de entrega fue ${textRegistro} correctamente.`,
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

      if (err.error === MaintainerProperties.QUOTATION_DELIVERY_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Entrega duplicada',
            texto: 'El registro de entrega que desea agregar ya se encuentra registrado.',
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
    this.router.navigate(['maintainer/index/7']);
  }

  ngOnDestroy() {
    this.service.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}


