import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { ClientManagerModel } from '../model/client.manager.model';
import { ClientManagerService } from '../services/client-manager.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public productListData: Array<ClientManagerModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: ClientManagerModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private clientService: ClientManagerService,
  ) { }

  ngOnInit() {
    this.initializeTable();
  }

  initializeTable() {


    this.dtOptions = this.getDtOptions();
    this.loadingService.show()
    this.subscriptions.push(this.clientService.getAll().subscribe(async data => {

      this.tblData = data;
      this.productListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
      this.loadingService.hide();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.initializeTable();
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
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(element: ClientManagerModel) {
    this.clientService.elementSelected = element;
    this.router.navigate(['/client/add-upd-client']);

  }

  redirectToView(element: ClientManagerModel) {
    this.clientService.elementSelected = element;
    this.router.navigate(['/client/add-upd-client/ver']);
  }

  async onDelete(element: ClientManagerModel) {
    const resultModal = await this.modalService.open({
      title: 'delete',
      text: `Are you sure you want to delete the client "${element.name + ' ' + element.lastName}"?`,
      icon: 'warning',
      showCancelButton: true,
      acceptText: 'Confirm',
      confirmIdentifier: 'btn-AcceptPropertyStateChange',
      cancelText: 'Cancel',
      cancelIdentifier: 'cancel',
    });
    if (resultModal) {
      this.loadingService.show();
      this.subscriptions.push(this.clientService.delete(element.id).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            title: 'Letter deletion',
            text: `The client "${element.name + ' ' + element.lastName}" has been successfully deleted.`,
            icon: 'success',
            showCancelButton: false,
            acceptText: 'Confirm',
            confirmIdentifier: 'btn-AcceptChangePropertyStatus',
          }
        );


        this.initializeTable();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onDelete(element);
        }
      }));
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
