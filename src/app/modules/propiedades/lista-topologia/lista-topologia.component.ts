import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subscription, Subject } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
// import { ListarDocumentosModalComponent } from '../../documentos/listar-documentos-modal/listar-documentos-modal.component';
// import { DocumentosService } from '../../documentos/services/documentos.service';
import { SharedService } from '../../shared/shared.service';
import { AddUpdTopologiaComponent } from '../add-upd-topologia/add-upd-topologia.component';
import { ProyectoModel } from '../model/proyecto.model';
import { TipologiaProyectoModel } from '../model/tipologia-proyecto.model';
import { PropiedadService } from '../services/propiedad.service';

@Component({
  selector: 'app-lista-topologia',
  templateUrl: './lista-topologia.component.html',
  styleUrls: ['./lista-topologia.component.css']
})
export class ListaTopologiaComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public tipologiaListData: Array<TipologiaProyectoModel> = [];

  dtOptions: DataTables.Settings = {};
  public tblData: TipologiaProyectoModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public contratoId: string;
  public proyectoSeleccionado: ProyectoModel;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private propiedadService: PropiedadService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    // private documentoService: DocumentosService
  ) { }

  ngOnInit(): void {
    sessionStorage.setItem('title', 'Tipología');
    this.contratoId = this.route.snapshot.paramMap.get('proyectoId');
    this.proyectoSeleccionado = this.propiedadService.proyectoSelected;
    this.dtOptions = this.getDtOptions();
  }

  ngAfterViewInit() {
    this.iniciarTabla();
  }

  iniciarTabla() {


    if (this.proyectoSeleccionado) {
      this.loadingService.show();
      this.subscriptions.push(this.propiedadService.getTipologiaProyecto(this.proyectoSeleccionado.proyectoCorrelativoId).subscribe(async tipologias => {
        this.loadingService.hide();
        this.tblData = tipologias;
        this.tipologiaListData = tipologias;

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
        null,
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }

  async onCambioEstado(tipologiaSelected: TipologiaProyectoModel) {

    const estadoTipologiaCondition = tipologiaSelected.estado === 1;

    const resultModal = await this.modalService.open(
      {
        titulo: 'Cambiar Estado',
        texto: `¿Esta seguro que desea ${estadoTipologiaCondition ? 'Desactivar' : 'Activar'} la tipología ?`,
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

      tipologiaSelected.estado = tipologiaSelected.estado === 1 ? 0 : 1;

      const objRequest: any = {
        // ...this.registerTipologiaForm.value
        tipologiaId: tipologiaSelected.tipologiaId,
        tipologiaUnidadDesc: tipologiaSelected.tipo,
        proyecto: this.propiedadService.proyectoSelected.proyectoCorrelativoId,
        estadoTipologia: tipologiaSelected.estado,
        tipologiaGastoComun: tipologiaSelected.gComun,
        tipologiaM2Util: tipologiaSelected.m2Util,
        tipologiaM2Terreno: tipologiaSelected.m2Terr,
        tipologiaM2Total: tipologiaSelected.m2Total,
        tipologiaMaxAdulto: tipologiaSelected.maxAdulto,
        tipologiaMaxNino: tipologiaSelected.maxNino,
        tipologiaObs: tipologiaSelected.observaciones,
      };



      this.subscriptions.push(this.propiedadService.cambiarEstadoTipologia(objRequest).subscribe(async result => {
        this.loadingService.hide();
        await this.modalService.open(
          {
            titulo: 'Cambio de estado realizado',
            texto: `La tipología  cambió su estado a ${tipologiaSelected.estado ? 'Activa' : 'Inactiva'}.`,
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
          this.onCambioEstado(tipologiaSelected);
        }
      }));
    }
  }

  modalDocumentos(row: TipologiaProyectoModel) {
    // this.documentoService.tipologiaSel = row;
    // const dialogRef = this.dialog.open(ListarDocumentosModalComponent, {
    //   data: {
    //     tipoRegistro: 'tipologia',
    //     idUsuario: sessionStorage.getItem('idUsuario'),
    //     idRegistro: row.tipologiaId
    //   }
    // });

  }

  addEditTipologia(tipologia: TipologiaProyectoModel = null, ver = false) {
    if (tipologia) {
      this.propiedadService.tipologiaSelected = tipologia;
    }

    const dialogRef = this.dialog.open(AddUpdTopologiaComponent, {
      data: {
        ver: ver ? true : false
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.iniciarTabla();
      }
    }));
  }

  onVolver() {
    this.router.navigate(['/propiedades/listar-propiedades']);

  }

}
