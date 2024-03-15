import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { saveAs as importedSaveAs } from "file-saver";
import { ClientModel } from '../../models/client.model';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';
import { PropiedadService } from 'src/app/modules/propiedades/services/propiedad.service';
import { ClientService } from '../../service/client.service';
import { ProyectoModel } from 'src/app/modules/propiedades/model/proyecto.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public userListData: Array<ClientModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: ClientModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.iniciarTabla();
  }

  iniciarTabla() {
    this.dtOptions = this.getDtOptions();
    this.subscriptions.push(this.clientService.getClients().subscribe(async data => {

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
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
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


  redirectToEdit(client: ClientModel) {
    this.clientService.clientSelected = client;
    this.router.navigate(['/masters/add-upd-client']);
  }

  redirectToView(client: ClientModel) {
    this.clientService.clientSelected = client;
    this.router.navigate(['/masters/add-upd-client/ver']);
  }


  async onDelete(itemSelected: ClientModel) {

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar',
        texto: `¿Esta seguro que desea eliminar al cliente "${itemSelected.businessName}"?`,
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
      this.subscriptions.push(this.clientService.delete(itemSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Cliente eliminado',
            texto: `El cliente "${itemSelected.businessName}" se ha eliminado correctamente.`,
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
          this.onDelete(itemSelected);
        }
      }));
    }
  }

  descargarReporteProyecto() {
    // this.loadingService.show();
    // this.subscriptions.push(this.propiedadService.descargarReporteProyecto().subscribe(blob => {
    //   this.loadingService.hide();
    //   const fullYear = new Date().getFullYear();
    //   const month = new Date().getMonth() + 1;
    //   const padMonth = this.pad(month, 2);
    //   const day = this.pad(new Date().getDate(), 2);


    //   importedSaveAs(blob, 'PROYECTOS_' + fullYear + month + day + '.xlsx');
    // }, async err => {
    //   this.loadingService.hide();
    //   const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
    //   if (modalResult) {
    //     this.descargarReporteProyecto();
    //   }
    // }));
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
