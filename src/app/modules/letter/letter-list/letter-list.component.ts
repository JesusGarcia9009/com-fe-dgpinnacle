import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LetterModel } from '../models/letter.model';
import { Subject, Subscription } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { LetterService } from '../services/letter.service';
import moment from 'moment';

@Component({
  selector: 'app-letter-list',
  templateUrl: './letter-list.component.html',
  styleUrls: ['./letter-list.component.css']
})
export class LetterListComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public productListData: Array<LetterModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: LetterModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private letterService: LetterService,
  ) { }

  ngOnInit() {
    this.initializeTable();
  }

  initializeTable() {


    this.dtOptions = this.getDtOptions();
    this.loadingService.show()
    this.subscriptions.push(this.letterService.getAll().subscribe(async data => {

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
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }


  redirectToEdit(element: LetterModel) {
    this.letterService.elementSelected = element;
    this.router.navigate(['/letters/add-upd-letter']);
  }

  redirectToCalculator(element: LetterModel) {
    this.letterService.elementSelected = element;
    this.router.navigate(['/letters/calculator-letter']);
  }

  redirectToView(element: LetterModel) {
    this.letterService.elementSelected = element;
    this.router.navigate(['/letters/add-upd-letter/ver']);
  }

  async onDelete(element: LetterModel) {
    const resultModal = await this.modalService.open({
      title: 'delete',
      text: `Are you sure you want to delete the letter "${element.id}"?`,
      icon: 'warning',
      showCancelButton: true,
      acceptText: 'Confirm',
      confirmIdentifier: 'btn-AcceptPropertyStateChange',
      cancelText: 'Cancel',
      cancelIdentifier: 'cancel',
    });
    if (resultModal) {
      this.loadingService.show();
      this.subscriptions.push(this.letterService.delete(element.id).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            title: 'Letter deletion',
            text: `The letter "${element.id}" has been successfully deleted.`,
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

  async download(selected: LetterModel) {
    this.loadingService.show();
    await this.letterService.download(selected.id).toPromise()
      .then(response => {
        this.loadingService.hide();
        const dateNow = new Date();
        var downloadURL = window.URL.createObjectURL(<any>response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `PREQUALIFICATION_LETTER_${this.zfill(selected.id, 5)}_${selected.location}_${moment(dateNow).format('DDMMYYYY')}.pdf`;
        link.click();
        this.initializeTable();
      })
      .catch(
        async error => {
          this.loadingService.hide();
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.download(selected);
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
