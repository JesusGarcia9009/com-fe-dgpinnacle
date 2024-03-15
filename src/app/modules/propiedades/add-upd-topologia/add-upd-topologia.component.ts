import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { TipologiaProyectoModel } from '../model/tipologia-proyecto.model';
import { PropiedadService } from '../services/propiedad.service';

@Component({
  selector: 'app-add-upd-topologia',
  templateUrl: './add-upd-topologia.component.html',
  styleUrls: ['./add-upd-topologia.component.css']
})
export class AddUpdTopologiaComponent implements OnInit {

  public isReadOnly: boolean;
  public formTitle: string = 'Agregar Tipología';
  public registerTipologiaForm: FormGroup;
  public subscriptions: Array<Subscription> = [];

  public tipologiaSel: TipologiaProyectoModel;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private propiedadService: PropiedadService,
    public dialog: MatDialog,
    // public dialogRef: MatDialogRef<AddUpdCesionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    const ver = this.data.ver;
    if (ver) {
      this.isReadOnly = true;
    }

    this.initForm();

    if (this.propiedadService.tipologiaSelected) {
      this.formTitle = 'Edición de la Tipología';
    }
  }

  async initForm() {
    if (this.isReadOnly) {
      this.registerTipologiaForm = this.fb.group({
        tipologiaId: [{ value: null, disabled: true }, []],
        proyectoId: [{ value: null, disabled: true }, []],
        tipo: [{ value: null, disabled: true }, [Validators.required]],
        gComun: [{ value: null, disabled: true }, []],
        m2Util: [{ value: null, disabled: true }, []],
        m2Terr: [{ value: null, disabled: true }, []],
        m2Total: [{ value: null, disabled: true }, []],
        maxAdulto: [{ value: null, disabled: true }, []],
        maxNino: [{ value: null, disabled: true }, []],
        observaciones: [{ value: null, disabled: true }, []],
        estado: [{ value: null, disabled: true }, []],
      }
      );
    } else {
      this.registerTipologiaForm = this.fb.group({
        tipologiaId: ['', []],
        proyectoId: [{ value: null, disabled: true }, []],
        tipo: ['', [Validators.required]],
        gComun: ['', []],
        m2Util: ['', []],
        m2Terr: ['', []],
        m2Total: [{ value: null, disabled: true }, []],
        maxAdulto: ['', []],
        maxNino: ['', []],
        observaciones: ['', []],
        estado: ['', []],
      }
      );
    }

    if (this.propiedadService.tipologiaSelected) {
      this.initLoad(this.propiedadService.tipologiaSelected);
    } else {
      this.initLoad();
    }


    this.subscriptions.push(this.formTipologiaControls.tipo.valueChanges.subscribe(val => {
      this.formTipologiaControls.tipo.patchValue(val.toUpperCase(), { emitEvent: false });
    }));


    this.subscriptions.push(this.formTipologiaControls.m2Util.valueChanges.subscribe(val => {
      const m2Terr = this.formTipologiaControls.m2Terr.value ? this.formTipologiaControls.m2Terr.value : 0;
      const m2Total = parseFloat(val) + parseFloat(m2Terr);
      this.formTipologiaControls.m2Total.setValue(m2Total);
      this.registerTipologiaForm.value.m2Total = m2Total;
      this.registerTipologiaForm.updateValueAndValidity();
    }));


    this.subscriptions.push(this.formTipologiaControls.m2Terr.valueChanges.subscribe(val => {
      const m2Util = this.formTipologiaControls.m2Util.value ? this.formTipologiaControls.m2Util.value : 0;
      const m2Total = parseFloat(val) + parseFloat(m2Util);
      this.formTipologiaControls.m2Total.setValue(m2Total);
      this.registerTipologiaForm.value.m2Total = m2Total;
      this.registerTipologiaForm.updateValueAndValidity();
    }));


  }

  get formTipologiaControls() { return this.registerTipologiaForm.controls; }

  initLoad(tipologiaSelected: TipologiaProyectoModel = null) {
    if (tipologiaSelected) {
      this.registerTipologiaForm.patchValue(tipologiaSelected);
    }
  }

  onRegisterSubmit() {
    const formValue = this.registerTipologiaForm.value;
    if (this.propiedadService.tipologiaSelected) {
      formValue.estado = this.propiedadService.tipologiaSelected.estado;
    } else {
      formValue.estado = 1;
    }

    formValue.proyectoId = this.propiedadService.proyectoSelected.proyectoId;

    const objRequest: any = {
      // ...this.registerTipologiaForm.value
      tipologiaId: formValue.tipologiaId,
      tipologiaUnidadDesc: formValue.tipo,
      proyecto: this.propiedadService.proyectoSelected.proyectoCorrelativoId,
      estadoTipologia: formValue.estado,
      tipologiaGastoComun: formValue.gComun,
      tipologiaM2Util: formValue.m2Util,
      tipologiaM2Terreno: formValue.m2Terr,
      tipologiaM2Total: this.formTipologiaControls.m2Total.value,
      tipologiaMaxAdulto: formValue.maxAdulto,
      tipologiaMaxNino: formValue.maxNino,
      tipologiaObs: formValue.observaciones,
    };

    this.loadingService.show();
    this.subscriptions.push(this.propiedadService.guardarTipologia(objRequest).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.propiedadService.tipologiaSelected ? 'editada' : 'registrada';

      await this.modalService.open(
        {
          titulo: `Tipología ${textRegistro}`,
          texto: `La tipologìa fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.registerTipologiaForm.reset();
      this.onCerrar(true);
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'MSG_REF_DUPL') {
        this.modalService.open({
          icono: 'error',
          texto: 'El tipo ya se encuentra ingresado en otra tipología.',
          titulo: 'Tipo duplicado',
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


  ngOnDestroy() {
    this.propiedadService.tipologiaSelected = null;
  }

  onCerrar(resp = false) {
    // this.dialogRef.close(resp);
  }

}
