import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { Subject, Subscription } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { RealtorManagerService } from '../services/realtor-manager.service';

@Component({
  selector: 'app-list-realtor',
  templateUrl: './list-realtor.component.html',
  styleUrls: ['./list-realtor.component.css']
})
export class ListRealtorComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public productListData: Array<RealtorManagerModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: RealtorManagerModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private realtorService: RealtorManagerService,
  ) { }

  ngOnInit() {
    this.initializeTable();
  }

  initializeTable() {


    this.dtOptions = this.getDtOptions();
    this.loadingService.show()
    this.subscriptions.push(this.realtorService.getAll().subscribe(async data => {

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
        null,
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(element: RealtorManagerModel) {
    this.realtorService.elementSelected = element;
    this.router.navigate(['/realtor/add-upd-realtor']);

  }

  redirectToView(element: RealtorManagerModel) {
    this.realtorService.elementSelected = element;
    this.router.navigate(['/realtor/add-upd-realtor/ver']);
  }

  async onDelete(element: RealtorManagerModel) {
    const resultModal = await this.modalService.open({
      title: 'delete',
      text: `Are you sure you want to delete the realtor "${element.name + ' ' + element.lastName}"?`,
      icon: 'warning',
      showCancelButton: true,
      acceptText: 'Confirm',
      confirmIdentifier: 'btn-AcceptPropertyStateChange',
      cancelText: 'Cancel',
      cancelIdentifier: 'cancel',
    });
    if (resultModal) {
      this.loadingService.show();
      this.subscriptions.push(this.realtorService.delete(element.id).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            title: 'Letter deletion',
            text: `The realtor "${element.name + ' ' + element.lastName}" has been successfully deleted.`,
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
