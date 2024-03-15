import { PaymentmethodService } from 'src/app/modules/maintainer/service/paymentmethod.service';
import { PaymentMethodModel } from '../../models/payment.method.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { MaintainerProperties } from '../../properties/maintainer.properties';

@Component({
  selector: 'app-add-update-paymentmethod',
  templateUrl: './add-update-paymentmethod.component.html',
  styleUrls: ['./add-update-paymentmethod.component.css']
})
export class AddUpdatePaymentmethodComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: PaymentMethodModel;
  public formTitle: string = 'Registro de forma de pago';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementService: PaymentmethodService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.elementService.elementSelected;
    sessionStorage.setItem('title', 'Formas de pago');

    if (this.elementSelected) {
      this.formTitle = 'Edición de formas de pago';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {

    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        initials: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []],
        days: [{ value: null, disabled: true }, []]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        initials: ['', [Validators.required]],
        description: ['', [Validators.required]],
        days: ['', [Validators.required]]
      });
    }
    
      
    if (this.elementSelected) {
      this.registerFormControls.id.setValue(this.elementSelected.id);
      this.registerFormControls.initials.setValue(this.elementSelected.initials);
      this.registerFormControls.days.setValue(this.elementSelected.days);
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
          titulo: `Forma de pago ${textRegistro}`,
          texto: `La forma de pago fue ${textRegistro} correctamente.`,
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

      if (err.error === MaintainerProperties.PAYMENT_METHOD_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Forma de pago duplicada',
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
    this.router.navigate(['maintainer/index/5']);
  }

  ngOnDestroy() {
    this.elementService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

