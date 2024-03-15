import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { QuotationModel } from '../models/quotation.model';
import { QuotationService } from '../service/quotation.service';

@Component({
  selector: 'app-list-quotation',
  templateUrl: './list-quotation.component.html',
  styleUrls: ['./list-quotation.component.css']
})
export class ListQuotationComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public quotationListData: Array<QuotationModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: QuotationModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public tabIndex = 1;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private quotationService: QuotationService
  ) { }

  ngOnInit() {
    if (this.quotationService.quotationSelected) {
      this.tabIndex = 0;
    }
    this.iniciarTabla();
  }

  iniciarTabla() {

    this.dtOptions = this.getDtOptions();
    this.loadingService.show();
    this.subscriptions.push(this.quotationService.findAll().subscribe(async data => {
      this.loadingService.hide();
      this.tblData = data;
      this.quotationListData = data;

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
      order: [[0, 'desc']],
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
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(quotation: QuotationModel) {
    this.quotationService.quotationSelected = quotation;
    this.router.navigate(['/quotation/add-quotation']);
  }

  redirectToView(quotation: QuotationModel) {
    this.quotationService.quotationSelected = quotation;
    this.router.navigate(['/quotation/add-quotation/ver']);
  }

  async onDelete(quotationSelected: QuotationModel) {

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar Cotizacion',
        texto: `¿Esta seguro que desea eliminar la cotizacion "${quotationSelected.id}"?`,
        icono: 'warning',
        mostrarBotonCancelar: true,
        textoAceptar: 'Confirmar',
        identificadorConfirmar: 'btn-AceptarEliminarUQuotation',
        textoCancelar: 'Cancelar',
        identificadorCancelar: 'cancel',

      }
    );
    if (resultModal) {
      this.loadingService.show();

      this.subscriptions.push(this.quotationService.delete(quotationSelected).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Cotizacion Eliminada',
            texto: `La cotizacion "${quotationSelected.id}" fue eliminada con éxito.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarEliminarQuotation',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onDelete(quotationSelected);
        }
      }));
    }
  }

  async download(quotationSelected: QuotationModel) {
    this.loadingService.show();
    await this.quotationService.download(quotationSelected.id).toPromise()
      .then(response => {
        this.loadingService.hide();
        const dateNow = new Date();
        var downloadURL = window.URL.createObjectURL(<any>response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `Cotización_${this.zfill(quotationSelected.id, 5)}_${quotationSelected.clientFantasyName}_${moment(dateNow).format('DDMMYYYY')}.pdf`;
        link.click();
        this.iniciarTabla();
      })
      .catch(
        async error => {
          this.loadingService.hide();
          const result = await this.modalService.open({
            tipoGenerico: 'error-gen'
          });
          if (result) {
            this.download(quotationSelected);
          }
        });
  }

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return ("-" + numberOutput.toString());
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
      } else {
        return ((zero.repeat(width - length)) + numberOutput.toString());
      }
    }
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
