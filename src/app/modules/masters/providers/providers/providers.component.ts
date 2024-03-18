import { ProviderService } from './../../service/provider.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from '../../../core/core/services/loading.service';
import { ModalService } from '../../../core/core/services/modal.service';
import { SharedService } from '../../../shared/shared.service';
import { ProviderModel } from '../../models/provider.model';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public providerListData: Array<ProviderModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: ProviderModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private providerService: ProviderService
  ) { }

  ngOnInit() {
    this.iniciarTabla();
  }

  iniciarTabla() {
    this.dtOptions = this.getDtOptions();
    this.subscriptions.push(this.providerService.getAll().subscribe(async data => {

      this.tblData = data;
      this.providerListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {

      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
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
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(provider: ProviderModel) {
    this.providerService.providerSelected = provider;
    this.router.navigate(['/masters/add-upd-provider']);
  }

  redirectToView(provider: ProviderModel) {
    this.providerService.providerSelected = provider;
    this.router.navigate(['/masters/add-upd-provider/ver']);
  }


  async onDelete(itemSelected: ProviderModel) {

    const resultModal = await this.modalService.open(
      {
        title: 'Eliminar',
        text: `¿Esta seguro que desea eliminar el proveedor "${itemSelected.businessName}"?`,
        icon: 'warning',
        showCancelButton: true,
        acceptText: 'Confirmar',
        confirmIdentifier: 'btn-AceptarCambioEstadoPropiedad',
        cancelText: 'Cancelar',
        cancelIdentifier: 'cancel',
      }
    );
    if (resultModal) {
      this.loadingService.show();
      this.subscriptions.push(this.providerService.delete(itemSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            title: 'Proveedor eliminado',
            text: `El proveedor "${itemSelected.businessName}" se ha eliminado correctamente.`,
            icon: 'success',
            showCancelButton: false,
            acceptText: 'Confirmar',
            confirmIdentifier: 'btn-AceptarCambioEstadoPropiedad',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
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
    //   const modalResult = await this.modalService.open({ genericType: 'error-gen' });
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
