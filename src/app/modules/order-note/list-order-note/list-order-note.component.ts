import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { OrderNoteModel } from '../models/order-note.model';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { OrderService } from '../service/order.service';
import moment from 'moment';

@Component({
  selector: 'app-list-order-note',
  templateUrl: './list-order-note.component.html',
  styleUrls: ['./list-order-note.component.css']
})
export class ListOrderNoteComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public quotationListData: Array<OrderNoteModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: OrderNoteModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public tabIndex = 1;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private orderNoteService: OrderService
  ) { }

  ngOnInit() {
    if (this.orderNoteService.orderNoteSelected) {
      this.tabIndex = 0;
    }
    this.iniciarTabla();
  }

  iniciarTabla() {

    this.dtOptions = this.getDtOptions();
    this.loadingService.show();
    this.subscriptions.push(this.orderNoteService.findAll().subscribe(async data => {
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


  redirectToEdit(orderNote: OrderNoteModel) {
    this.orderNoteService.orderNoteSelected = orderNote;
    this.router.navigate(['/order/add-order']);
  }

  redirectToBill(orderNote: OrderNoteModel) {
    this.orderNoteService.orderNoteSelected = orderNote;
    this.router.navigate(['/order/bill-order']);
  }

  redirectToView(orderNote: OrderNoteModel) {
    this.orderNoteService.orderNoteSelected = orderNote;
    this.router.navigate(['/order/add-order/ver']);
  }

  async onDelete(orderNote: OrderNoteModel) {
    this.orderNoteService.orderNoteSelected = orderNote;
    this.router.navigate(['/order/reverse-order']);
  }

  async download(orderNoteSelected: OrderNoteModel) {
    this.loadingService.show();
    await this.orderNoteService.download(orderNoteSelected.id).toPromise()
      .then(response => {
        this.loadingService.hide();
        const dateNow = new Date();
        var downloadURL = window.URL.createObjectURL(<any>response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `Orden_Pedido_${this.zfill(orderNoteSelected.id, 5)}_${orderNoteSelected.clientFantasyName}_${moment(dateNow).format('DDMMYYYY')}.pdf`;
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
            this.download(orderNoteSelected);
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
