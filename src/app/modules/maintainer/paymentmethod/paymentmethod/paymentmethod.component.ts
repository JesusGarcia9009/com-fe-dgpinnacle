import { PaymentmethodService } from 'src/app/modules/maintainer/service/paymentmethod.service';
import { PaymentMethodModel } from '../../models/payment.method.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { LoadingService } from 'src/app/modules/core/core/services/loading.service';

@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public elementListData: Array<PaymentMethodModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: PaymentMethodModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private elementService: PaymentmethodService
  ) { }

  ngOnInit() {
    this.initTable();
  }

  initTable() {


    this.dtOptions = this.getDtOptions();

    this.subscriptions.push(this.elementService.getAll().subscribe(async data => {

      this.tblData = data;
      this.elementListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {

      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.initTable();
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
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(element: PaymentMethodModel) {
    this.elementService.elementSelected = element;
    this.router.navigate(['/maintainer/add-upd-paymentmethod']);
  }

  redirectToView(element: PaymentMethodModel) {
    this.elementService.elementSelected = element;
    this.router.navigate(['/maintainer/add-upd-paymentmethod/ver']);
  }


  async onDelete(elementSelected: PaymentMethodModel) {

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar la forma de pago',
        texto: `¿Esta seguro que desea eliminar la forma de pago "${elementSelected.description}"?`,
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

      this.subscriptions.push(this.elementService.delete(elementSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Eliminada',
            texto: `La forma de pago "${elementSelected.description}" se ha eliminado correctamente.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarCambioEstadoPropiedad',
          }
        );
        this.initTable();
      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onDelete(elementSelected);
        }
      }));
    }
  }

  downloadData() {
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
