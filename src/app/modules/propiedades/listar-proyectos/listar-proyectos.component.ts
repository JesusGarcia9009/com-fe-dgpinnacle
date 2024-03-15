import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
// import { DocumentosService } from '../../documentos/services/documentos.service';
import { SharedService } from '../../shared/shared.service';
import { ProyectoModel } from '../model/proyecto.model';
import { PropiedadService } from '../services/propiedad.service';
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: 'app-listar-proyectos',
  templateUrl: './listar-proyectos.component.html',
  styleUrls: ['./listar-proyectos.component.css']
})
export class ListarProyectosComponent implements OnInit {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public userListData: Array<ProyectoModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: ProyectoModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

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
    this.iniciarTabla();
  }

  iniciarTabla() {


    this.dtOptions = this.getDtOptions();

    this.subscriptions.push(this.propiedadService.getListaProyectos().subscribe(async data => {

      this.tblData = data;
      this.userListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {

      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.iniciarTabla();
      }
    }));
  }

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      order: [[0, 'asc']],
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
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(proyecto: ProyectoModel) {
    this.propiedadService.proyectoSelected = proyecto;
    this.router.navigate(['/propiedades/add-upd-proyecto']);
  }

  redirectToView(proyecto: ProyectoModel) {
    this.propiedadService.proyectoSelected = proyecto;
    this.router.navigate(['/propiedades/add-upd-proyecto/ver']);
  }


  async onCambioEstado(proyectoSelected: ProyectoModel) {

    const estadoPropiedadCondition = proyectoSelected.estadoProyecto === 1;

    const resultModal = await this.modalService.open(
      {
        titulo: 'Cambiar Estado',
        texto: `¿Esta seguro que desea ${estadoPropiedadCondition ? 'Desactivar' : 'Activar'} al proyecto "${proyectoSelected.proyectoCorrelativoId}"?`,
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
      proyectoSelected.estadoProyecto = estadoPropiedadCondition ? 0 : 1;

      this.subscriptions.push(this.propiedadService.cambiarEstadoProyecto(proyectoSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Cambio de estado realizado',
            texto: `El proyecto "${proyectoSelected.proyectoCorrelativoId}" cambió su estado a ${estadoPropiedadCondition ? 'Inactivo' : 'Activo'}.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onCambioEstado(proyectoSelected);
        }
      }));
    }
  }

  onVerDocumentos(row: ProyectoModel) {
    // this.documentosService.proyectoSel = row;
    // this.router.navigate([`/documentos/listar-documentos/${row.proyectoId}/proyectos`]);
  }

  onVerTipologia(row: ProyectoModel) {
    this.propiedadService.proyectoSelected = row;
    this.router.navigate([`/propiedades/proyecto/${row.proyectoId}/tipologia`]);

  }

  descargarReporteProyecto() {
    this.loadingService.show();
    this.subscriptions.push(this.propiedadService.descargarReporteProyecto().subscribe(blob => {
      this.loadingService.hide();
      const fullYear = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const padMonth = this.pad(month, 2);
      const day = this.pad(new Date().getDate(), 2);


      importedSaveAs(blob, 'PROYECTOS_' + fullYear + month + day + '.xlsx');
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.descargarReporteProyecto();
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
