import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, zip } from 'rxjs';
import { OperationModel, OperationRequestModel, OperationTypeModel } from '../models/operation.model';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { OperationService } from '../service/operation.service';
import moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetailRecordComponent } from '../detail-record/detail-record.component';

@Component({
  selector: 'app-list-record',
  templateUrl: './list-record.component.html',
  styleUrls: ['./list-record.component.css']
})
export class ListRecordComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public operationListData: Array<OperationModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: OperationModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public tabIndex = 1;

  public operationTypes: Array<OperationTypeModel> = [];
  public operationUsers: Array<string> = [];
  public operationStates: Array<string> = [];

  public operationForm: FormGroup;
  get operationFormControls() { return this.operationForm.controls; }

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private operationService: OperationService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const now = new Date();
    var firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
    var lastDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    this.operationForm = this.fb.group({
      startDate: ['', []],
      endDate: ['', []],
      operationType: [null, []],
      operationFullName: [null, []],
      operationCurrentState: [null, []],
      operationIdObject: [null, []]
    });

    this.operationFormControls.startDate = new FormControl(firstDate);
    this.operationFormControls.endDate = new FormControl(lastDate);

    this.iniciarSelects();
    this.iniciarTabla();
  }

  iniciarTabla() {
    this.dtOptions = this.getDtOptions();
    this.loadingService.show();
    this.subscriptions.push(this.operationService.loadlistOperationsByDates(this.getRequest()).subscribe(async data => {
      this.loadingService.hide();
      this.tblData = data;
      this.operationListData = data;

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

  getRequest(): OperationRequestModel{
    const start = this.operationForm.controls.startDate.value;
    const end = this.operationForm.controls.endDate.value;
    const type = this.operationForm.controls.operationType.value;
    const id = this.operationForm.controls.operationIdObject.value;
    const user = this.operationForm.controls.operationFullName.value;
    const state = this.operationForm.controls.operationCurrentState.value;
    return { startDate: new Date(start), endDate: new Date(end), operationType: type, operationFullName: user, operationCurrentState: state,  operationIdObject: id }
  }

  onClean(){
    this.operationForm.reset();
    const now = new Date();
    this.operationFormControls.startDate = new FormControl(new Date(now.getFullYear(), now.getMonth(), 1));
    this.operationFormControls.endDate = new FormControl( new Date(now.getFullYear(), now.getMonth() + 2, 0));
  }

  iniciarSelects() {
    this.subscriptions.push(
      zip(
        this.operationService.findAllUsers(),
        this.operationService.findAllStates(),
        this.operationService.findAllTypes()
      ).subscribe(result => {
        this.operationUsers = result[0];
        this.operationStates = result[1];
        this.operationTypes = result[2];
      })
    );
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
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }

  onSearch() {
    this.iniciarTabla();
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

  openDialog(operation: OperationModel) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Detalle de ' + operation.operationType ,
      operation: operation
    };
    dialogConfig.width = '1050px';

    this.dialog.open(DetailRecordComponent, dialogConfig);
  }

  pad(num, size) {
    let s = "000000000" + num;
    return s.substr(s.length - size);
  }

  getTooltip(column, row) {
    return column + ' - ' + row[column];
  }

  async ngOnDestroy() {

    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}
