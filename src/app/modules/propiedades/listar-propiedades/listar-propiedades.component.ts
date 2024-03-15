import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
// import { DocumentosService } from '../../documentos/services/documentos.service';
import { SharedService } from '../../shared/shared.service';
import { PropiedadModel } from '../model/propiedad.model';
import { PropiedadService } from '../services/propiedad.service';
import { saveAs as importedSaveAs } from "file-saver";

declare const $: any;
@Component({
  selector: 'app-listar-propiedades',
  templateUrl: './listar-propiedades.component.html',
  styleUrls: ['./listar-propiedades.component.css']
})
export class ListarPropiedadesComponent implements OnInit {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public userListData: Array<PropiedadModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: PropiedadModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public tabIndex = 1;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private propiedadService: PropiedadService,
    // private documentosService: DocumentosService
  ) { }

  ngOnInit() {
    if(this.propiedadService.fromProyecto) {
      this.tabIndex = 0;
    }
    this.iniciarTabla();
  }

  iniciarTabla() {

    this.dtOptions = this.getDtOptions();
    this.loadingService.show();
    this.subscriptions.push(this.propiedadService.getPropiedades().subscribe(async data => {
    this.loadingService.hide();
      this.tblData = data;
      this.userListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.iniciarTabla();
      }
    }));
  }

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      order: [[8, 'asc']],
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "Todos"]
      ],
      aoColumns: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(propiedad: PropiedadModel) {
    this.propiedadService.propiedadSelected = propiedad;
    this.router.navigate(['/propiedades/add-upd-propiedad']);
  }

  redirectToView(propiedad: PropiedadModel) {
    this.propiedadService.propiedadSelected = propiedad;
    this.router.navigate(['/propiedades/add-upd-propiedad/ver']);
  }

  async onEliminar(propiedadSelected: PropiedadModel) {

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar Propiedad',
        texto: `¿Esta seguro que desea eliminar la propiedad "${propiedadSelected.propiedadesDesc}"?`,
        icono: 'warning',
        mostrarBotonCancelar: true,
        textoAceptar: 'Confirmar',
        identificadorConfirmar: 'btn-AceptarEliminarUPropiedad',
        textoCancelar: 'Cancelar',
        identificadorCancelar: 'cancel',

      }
    );
    if (resultModal) {
      this.loadingService.show();

      this.subscriptions.push(this.propiedadService.eliminarPropiedad(propiedadSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Propiedad Eliminada',
            texto: `La propiedad "${propiedadSelected.propiedadesDesc}" fue eliminada con éxito.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarEliminarPropiedad',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onEliminar(propiedadSelected);
        }
      }));
    }
  }


  async onCambioEstado(propiedadSelected: PropiedadModel) {

    const estadoPropiedadCondition = propiedadSelected.estadoPropiedad === 1;

    const resultModal = await this.modalService.open(
      {
        titulo: 'Cambiar Estado',
        texto: `¿Esta seguro que desea ${estadoPropiedadCondition ? 'Desactivar' : 'Activar'} la propiedad "${propiedadSelected.referenciaPropiedad}"?`,
        icono: 'warning',
        mostrarBotonCancelar: true,
        textoAceptar: 'Confirmar',
        identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
        textoCancelar: 'Cancelar',
        identificadorCancelar: 'cancel',
      }
    );
    if (resultModal) {
      this.loadingService.show();
      // se envia el contrario , si estadoActual es 1 "Activa" se envia a desactivar "Estado 0"
      propiedadSelected.estadoPropiedad = estadoPropiedadCondition ? 0 : 1;

      this.subscriptions.push(this.propiedadService.cambiarEstadoPropiedad(propiedadSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Cambio de estado realizado',
            texto: `La propiedad "${propiedadSelected.referenciaPropiedad}" cambió su estado a ${estadoPropiedadCondition ? 'Inactiva' : 'Activa'}.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
          }
        );

        // this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onCambioEstado(propiedadSelected);
        }
      }));
    }
  }

  onVerDocumentos(row: PropiedadModel) {
    // this.documentosService.propiedadSel = row;
    // this.router.navigate([`/documentos/listar-documentos/${row.propiedadesId}/propiedades`]);
  }

  descargarReportePropiedad() {
    this.loadingService.show();
    this.subscriptions.push(this.propiedadService.descargarReportePropiedad().subscribe(blob => {
      this.loadingService.hide();
      const fullYear = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const padMonth = this.pad(month, 2);
      const day = this.pad(new Date().getDate(), 2);


      importedSaveAs(blob, 'PROPIEDADES_' + fullYear + month + day + '.xlsx');
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.descargarReportePropiedad();
      }
    }));
  }

  pad(num, size) {
    let s = "000000000" + num;
    return s.substr(s.length - size);
  }

  async ngOnDestroy() {

    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}
