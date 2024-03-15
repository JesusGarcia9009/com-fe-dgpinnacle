import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
import { ItemModel } from '../../shared/models/item.model';
import { ComunaModel } from '../model/comuna.model';
import { PropiedadModel } from '../model/propiedad.model';
import { PropiedadService } from '../services/propiedad.service';

@Component({
  selector: 'app-add-upd-propiedad',
  templateUrl: './add-upd-propiedad.component.html',
  styleUrls: ['./add-upd-propiedad.component.css']
})
export class AddUpdPropiedadComponent implements OnInit, OnDestroy {

  public registerPropiedadesForm: FormGroup;
  public listaTipoPropiedad: Array<ItemModel>;
  public listaClasePropiedad: Array<ItemModel>;
  public listaProyectosPropiedad: Array<any>;
  public listaRegiones: Array<ItemModel>;
  public listaComunas: Array<ComunaModel> = [];
  public listaComunasFilter: Array<ComunaModel> = [];
  public listaOrientaciones: Array<ItemModel>;
  public listaTieneHip: Array<ItemModel>;
  public listaFsri: Array<ItemModel> = [];
  public listaBancos: Array<ItemModel>;
  public subscriptions: Array<Subscription> = [];
  public listaTipoUnidad: Array<ItemModel>;
  public propiedadSel: any;
  public formTitle: string = 'Registro de Propiedades';
  public isLoadingComuna: boolean;
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private propiedadService: PropiedadService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.propiedadSel = this.propiedadService.propiedadSelected;
    this.initForm();


    if (this.propiedadSel) {
      this.formTitle = 'Edición de Propiedad';
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initLoad(propiedadSel = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.propiedadService.getListaTipoPropiedad(),
        this.propiedadService.getListaClasePropiedad(),
        this.propiedadService.getListaProyectos(),
        this.propiedadService.getListaRegiones(),
        this.propiedadService.getListaOrientaciones(),
        this.propiedadService.getlistaSiNo(),
        this.propiedadService.getListaBancos()
      ).subscribe(result => {
        this.loadingService.hide();
        this.listaTipoPropiedad = result[0];
        this.listaClasePropiedad = result[1];
        this.listaProyectosPropiedad = result[2];
        this.listaRegiones = result[3];
        this.listaOrientaciones = result[4];
        this.listaTieneHip = result[5];
        this.listaFsri = result[5];
        this.listaBancos = result[6];

        if (propiedadSel) {
          this.propiedadSel.tieneHipotecario = this.propiedadSel.tieneHipotecario.toString();
          this.propiedadSel.superficieTotal = this.propiedadSel.superficieTerraza + this.propiedadSel.superficieUtil;
          this.registerPropiedadesForm.patchValue(propiedadSel);
          this.onRegionSelectChange(this.propiedadSel.regionId, this.propiedadSel.comunaId);
          this.onProyectoSelectChange(this.propiedadSel.proyectoId);
        }
      })
    );
  }


  async initForm() {

    if (this.isReadOnly) {
      this.registerPropiedadesForm = this.fb.group({
        claseId: [{ value: null, disabled: true }, [Validators.required]],
        tipoPropiedadId: [{ value: null, disabled: true }, [Validators.required]],
        propiedadesDesc: [{ value: null, disabled: true }, []],
        proyectoId: [{ value: null, disabled: true }, [Validators.required]],
        torre: [{ value: null, disabled: true }, []],
        piso: [{ value: null, disabled: true }, []],
        numeroDepto: [{ value: null, disabled: true }, []],
        direccion: [{ value: null, disabled: true }, Validators.required],
        regionId: [{ value: null, disabled: true }, Validators.required],
        comunaId: [{ value: null, disabled: true }, Validators.required],
        rolSii: [{ value: null, disabled: true }, []],
        datosEscritura: [{ value: null, disabled: true }, []],
        valorCompraVenta: [{ value: null, disabled: true }, []],
        cantEstacionamiento: [{ value: null, disabled: true }, []],
        cantBodega: [{ value: null, disabled: true }, []],
        cantDormitorio: [{ value: null, disabled: true }, []],
        cantBannos: [{ value: null, disabled: true }, []],
        orientacionId: [{ value: null, disabled: true }, []],
        superficieUtil: [{ value: null, disabled: true }, []],
        superficieTerraza: [{ value: null, disabled: true }, []],
        superficieTotal: [{ value: null, disabled: true }, []],
        propiedadesId: [{ value: null, disabled: true }, []],
        restriccion: [{ value: null, disabled: true }, []],
        tieneHipotecario: [{ value: null, disabled: true }, []],
        bancoId: [{ value: null, disabled: true }, []],
        tasaHipotecario: [{ value: null, disabled: true }, []],
        plazoAnosHipotecario: [{ value: null, disabled: true }, []],
        diasVctoHipotecario: [{ value: null, disabled: true }, []],
        pjeFinanciaHipotecario: [{ value: null, disabled: true }, []],
        mesesGracia: [{ value: null, disabled: true }, []],
        referenciaPropiedad: [{ value: null, disabled: true }, []],
        proyectoCorrelativo: [{ value: null, disabled: true }, []],
        tipoUnidadId: [{ value: null, disabled: true }, Validators.required],
        comunaFilter: [{ value: null, disabled: true }, []],
        propiedadFsri: [{ value: null, disabled: true }, []],
      }
      );

    } else {
      this.registerPropiedadesForm = this.fb.group({
        claseId: ['', [Validators.required]],
        tipoPropiedadId: ['', [Validators.required]],
        propiedadesDesc: ['', []],
        proyectoId: ['', [Validators.required]],
        torre: ['', []],
        piso: ['', []],
        numeroDepto: ['', []],
        direccion: ['', Validators.required],
        regionId: ['', Validators.required],
        comunaId: ['', Validators.required],
        rolSii: ['', []],
        datosEscritura: ['', []],
        valorCompraVenta: ['', []],
        cantEstacionamiento: ['', []],
        cantBodega: ['', []],
        cantDormitorio: ['', []],
        cantBannos: ['', []],
        orientacionId: ['', []],
        superficieUtil: [null, []],
        superficieTerraza: [null, []],
        superficieTotal: [{ value: null, disabled: true }, []],
        propiedadesId: [{ value: null, disabled: true }, []],
        restriccion: [null, []],
        tieneHipotecario: [null, []],
        bancoId: [null, []],
        tasaHipotecario: [null, []],
        plazoAnosHipotecario: [null, []],
        diasVctoHipotecario: [null, []],
        pjeFinanciaHipotecario: [null, []],
        mesesGracia: [null, []],
        referenciaPropiedad: [null, []],
        proyectoCorrelativo: [{ value: null, disabled: true }, []],
        tipoUnidadId: ['', Validators.required],
        comunaFilter: ['', []],
        propiedadFsri: ['', []],
      }
      );

    }


    this.subscriptions.push(this.propiedadesFormControls.comunaFilter.valueChanges
      .pipe(
        startWith(''),
        map(nombreComuna => {
          if (nombreComuna) {
            return this.filtrarComunas(nombreComuna);
          }
          return this.listaComunas.slice();
        })
      ).subscribe(result => {
        this.listaComunasFilter = result;
      }));

    this.subscriptions.push(this.registerPropiedadesForm.get('torre').valueChanges.subscribe(val => {
      this.setDatoReferencia();
    }));

    this.subscriptions.push(this.registerPropiedadesForm.get('numeroDepto').valueChanges.subscribe(val => {
      this.setDatoReferencia();
    }));

    this.subscriptions.push(this.registerPropiedadesForm.get('cantEstacionamiento').valueChanges.subscribe(val => {
      this.setDatoReferencia();
    }));

    this.subscriptions.push(this.registerPropiedadesForm.get('cantBodega').valueChanges.subscribe(val => {
      this.setDatoReferencia();
    }));

    if (this.propiedadSel) {
      this.initLoad(this.propiedadSel);
    } else {
      this.initLoad();
    }
  }

  filtrarComunas(nombreComuna: string) {
    return this.listaComunas.filter(comuna =>
      comuna.value.toLowerCase().indexOf(nombreComuna.toLowerCase()) === 0);
  }

  get propiedadesFormControls() { return this.registerPropiedadesForm.controls; }

  onRegisterSubmit() {
    const formValue = this.registerPropiedadesForm.value;
    if (this.propiedadSel) {
      formValue.propiedadesId = this.propiedadSel.propiedadesId;
      formValue.estadoPropiedad = this.propiedadSel.estadoPropiedad;
    } else {
      formValue.estadoPropiedad = 1;
    }

    this.subscriptions.push(this.propiedadService.guardarPropiedad(formValue).subscribe(async response => {
      const textRegistro = this.propiedadSel ? 'editada' : 'registrada';

      await this.modalService.open(
        {
          titulo: `Propiedad ${textRegistro}`,
          texto: `La propiedad fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.registerPropiedadesForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {
      if (err.error === 'MSG_REF_DUPL') {
        this.modalService.open({
          icono: 'error',
          texto: 'El código de referencia ya se encuentra ingresado en otra propiedad.',
          titulo: 'Código de referencia duplicado',
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

  onRegionSelectChange(regionId, comunaDefaultSelected = null) {
    this.isLoadingComuna = true;
    this.subscriptions.push(
      this.propiedadService.getComunasByRegionId(regionId).subscribe(comunas => {
        this.listaComunas = comunas;
        this.listaComunasFilter = comunas;
        this.isLoadingComuna = false;
        this.propiedadesFormControls.comunaId.setValue(comunaDefaultSelected);
      })
    );
  }

  volver() {
    this.propiedadService.fromProyecto = false;
    this.router.navigate(['propiedades/listar-propiedades']);
  }

  updateM2Total() {
    const m2Util = parseFloat(this.propiedadesFormControls.superficieUtil.value);
    const m2Terraza = parseFloat(this.propiedadesFormControls.superficieTerraza.value);
    const m2Total = m2Util + m2Terraza;
    this.propiedadesFormControls.superficieTotal.setValue(m2Total);
  }

  toUpperRef() {
    const formValue = this.registerPropiedadesForm.value;
    if (formValue.referenciaPropiedad) {
      formValue.referenciaPropiedad = formValue.referenciaPropiedad.toUpperCase();
    }
  }

  setDatoReferencia() {
    const tipoPropiedad = this.listaTipoPropiedad.find(t => t.key === this.propiedadesFormControls.tipoPropiedadId.value);
    const numeroDepartamento = this.propiedadesFormControls.numeroDepto.value;
    const torre = this.propiedadesFormControls.torre.value;
    const proyecto = this.listaProyectosPropiedad.find(t => t.proyectoId === this.propiedadesFormControls.proyectoId.value);

    let estacionamiento = this.propiedadesFormControls.cantEstacionamiento.value;
    let bodega = this.propiedadesFormControls.cantBodega.value;

    if (estacionamiento) {
      estacionamiento = 'E' + estacionamiento.split(',')[0];
    }

    if (bodega) {
      bodega = 'B' + bodega.split(',')[0];
    }

    if (tipoPropiedad && numeroDepartamento && proyecto) {
      let concatenacion = tipoPropiedad.value.charAt(0) + numeroDepartamento + (torre ? torre : '-');

      if (estacionamiento) {
        concatenacion = concatenacion + '-' + estacionamiento + '-';
      }

      if (bodega) {
        if (!estacionamiento) {
          bodega = '-' + bodega;
        }
        concatenacion = concatenacion + bodega + '-';

      }

      if (!bodega && !estacionamiento) {
        concatenacion = concatenacion + '-';
      }



      concatenacion = concatenacion + proyecto.proyectoCorrelativoId;

      this.propiedadesFormControls.referenciaPropiedad.setValue(concatenacion);
    }
  }

  onProyectoSelectChange(proyectoIdValue) {

    const proyecto = this.listaProyectosPropiedad.find(t => t.proyectoId === proyectoIdValue);
    this.propiedadesFormControls.proyectoCorrelativo.setValue(proyecto.proyectoCorrelativoId);
    this.setDatoReferencia();
    this.subscriptions.push(
      this.propiedadService.getlistaTipoUnidad(proyecto.proyectoCorrelativoId).subscribe(listaTipoUnidad => {
        this.listaTipoUnidad = listaTipoUnidad;
        if (this.propiedadSel) {

          setTimeout(() => {
            this.propiedadesFormControls.tipoUnidadId.setValue(this.propiedadSel.tipoUnidadId);
            this.registerPropiedadesForm.updateValueAndValidity();
          },1);

        }

      })
    );

    if (!this.propiedadSel) {
      this.propiedadesFormControls.direccion.setValue(proyecto.proyectoDireccion);
      this.propiedadesFormControls.regionId.setValue(proyecto.regionId);
      this.onRegionSelectChange(proyecto.regionId, proyecto.comunaId);
    }
  }

  modalDocumento() {
    // this.documentosService.propiedadSel = this.propiedadSel;
    // const dialogRef = this.dialog.open(ListarDocumentosModalComponent, {
    //   data: {
    //     tipoRegistro: 'propiedades',
    //     idUsuario: sessionStorage.getItem('idUsuario'),
    //     idRegistro: this.propiedadSel.propiedadesId
    //   }
    // });

  }

  ngOnDestroy() {
    this.propiedadService.propiedadSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}
