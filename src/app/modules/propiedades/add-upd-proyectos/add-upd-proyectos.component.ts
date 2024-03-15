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
import { ProyectoModel } from '../model/proyecto.model';
import { PropiedadService } from '../services/propiedad.service';

@Component({
  selector: 'app-add-upd-proyectos',
  templateUrl: './add-upd-proyectos.component.html',
  styleUrls: ['./add-upd-proyectos.component.css']
})
export class AddUpdProyectosComponent implements OnInit {

  public registerProyectoForm: FormGroup;
  public listaInmobiliaria: Array<ItemModel>;
  public listaClasePropiedad: Array<ItemModel>;
  public listaProyectosPropiedad: Array<ItemModel>;
  public listaRegiones: Array<ItemModel>;
  public listaComunas: Array<ComunaModel> = [];
  public listaComunasFilter: Array<ComunaModel> = [];
  public listaOrientaciones: Array<ItemModel>;
  public listaTieneHip: Array<ItemModel>;
  public listaFsri: Array<ItemModel> = [];
  public listaBancos: Array<ItemModel>;
  public subscriptions: Array<Subscription> = [];
  public listaTipoUnidad: Array<ItemModel>;
  public proyectoSel: ProyectoModel;
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
    this.proyectoSel = this.propiedadService.proyectoSelected;
    this.initForm();


    if (this.proyectoSel) {
      this.formTitle = 'Edición de Proyecto';
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initLoad(proyectoSel = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        // this.propiedadService.getListaInmobiliaria(),
        this.propiedadService.getListaRegiones(),
      ).subscribe(result => {
        this.loadingService.hide();
        // this.listaInmobiliaria = result[0];
        this.listaRegiones = result[0];
        if (proyectoSel) {

          this.registerProyectoForm.patchValue(proyectoSel);
          this.onRegionSelectChange(this.proyectoSel.regionId, this.proyectoSel.comunaId);
        }
      })
    );
  }


  async initForm() {

    if (this.isReadOnly) {
      this.registerProyectoForm = this.fb.group({
        proyectoId: [{ value: null, disabled: true }, []],
        proyectoDesc: [{ value: null, disabled: true }, []],
        proyectoCorrelativoId: [{ value: null, disabled: true }, []],
        proyectoDireccion: [{ value: null, disabled: true }, [Validators.required]],
        proyectoInmobiliaria: [{ value: null, disabled: true }, []],
        comunaId: [{ value: null, disabled: true }, [Validators.required]],
        regionId: [{ value: null, disabled: true }, [Validators.required]],
        estadoProyecto: [{ value: null, disabled: true }, []],
        proyectoAtributo: [{ value: null, disabled: true }, []],
        proyectoRestricciones: [{ value: null, disabled: true }, []],
        proyectoObservaciones: [{ value: null, disabled: true }, []],
        proyectoContacto: [{ value: null, disabled: true }, []],
        comunaFilter: [{ value: null, disabled: true }, []],
      }
      );

    } else {
      this.registerProyectoForm = this.fb.group({
        proyectoId: ['', []],
        proyectoDesc: ['', []],
        proyectoCorrelativoId: ['', []],
        proyectoDireccion: ['', [Validators.required]],
        proyectoInmobiliaria: ['', []],
        comunaId: ['', [Validators.required]],
        regionId: ['', [Validators.required]],
        estadoProyecto: ['', []],
        proyectoAtributo: ['', []],
        proyectoRestricciones: ['', []],
        proyectoObservaciones: ['', []],
        proyectoContacto: ['', []],
        comunaFilter: ['', []],
      }
      );

    }

    this.subscriptions.push(this.proyectoFormControls.proyectoCorrelativoId.valueChanges.subscribe(val => {
      this.proyectoFormControls.proyectoCorrelativoId.patchValue(val.toUpperCase(), {emitEvent: false});
    }));


    this.subscriptions.push(this.proyectoFormControls.comunaFilter.valueChanges
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


    if (this.proyectoSel) {
      this.initLoad(this.proyectoSel);
    } else {
      this.initLoad();
    }
  }

  filtrarComunas(nombreComuna: string) {
    return this.listaComunas.filter(comuna =>
      comuna.value.toLowerCase().indexOf(nombreComuna.toLowerCase()) === 0);
  }

  get proyectoFormControls() { return this.registerProyectoForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue = this.registerProyectoForm.value;
    if (this.proyectoSel) {
      formValue.proyectoId = this.proyectoSel.proyectoId;
      formValue.estadoProyecto = this.proyectoSel.estadoProyecto;
    } else {
      formValue.estadoProyecto = 1;
    }

    this.subscriptions.push(this.propiedadService.guardarProyecto(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.proyectoSel ? 'editado' : 'registrado';

      await this.modalService.open(
        {
          titulo: `Proyecto ${textRegistro}`,
          texto: `El proyecto fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.registerProyectoForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {
      this.loadingService.hide();

      if (err.error === 'MSG_REF_DUPL') {
        this.modalService.open({
          icono: 'error',
          texto: 'El código ya se encuentra ingresado en otro proyecto.',
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

  onRegionSelectChange(regionId, comunaDefaultSelected = null) {
    this.isLoadingComuna = true;
    this.subscriptions.push(
      this.propiedadService.getComunasByRegionId(regionId).subscribe(comunas => {
        this.listaComunas = comunas;
        this.listaComunasFilter = comunas;
        this.isLoadingComuna = false;
        this.proyectoFormControls.comunaId.setValue(comunaDefaultSelected);
      })
    );
  }


  toUpperRef() {
    const formValue = this.registerProyectoForm.value;
    if (formValue.proyectoCorrelativoId) {
      this.proyectoFormControls.proyectoCorrelativoId.setValue(formValue.proyectoCorrelativoId.toUpperCase());
    }
  }

  volver() {
    this.propiedadService.fromProyecto = true;
    this.router.navigate(['propiedades/listar-propiedades']);
  }

  modalDocumento() {
    // this.documentosService.proyectoSel = this.proyectoSel;
    // const dialogRef = this.dialog.open(ListarDocumentosModalComponent, {
    //   data: {
    //     tipoRegistro: 'proyectos',
    //     idUsuario: sessionStorage.getItem('idUsuario'),
    //     idRegistro: this.proyectoSel.proyectoId
    //   }
    // });

  }

  ngOnDestroy() {
    this.propiedadService.proyectoSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }


}
