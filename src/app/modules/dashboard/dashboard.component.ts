import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';


import { InitService } from './services/init.service';
import { ModalService } from '../../modules/core/core/services/modal.service';
import { LoadingService } from '../../modules/core/core/services/loading.service';
import Chartist from 'chartist';
import { Subscription, zip } from 'rxjs';
import { DashboardWidgetModel } from './models/quotation.model';
import { SharedProperties } from '../shared/properties/shared.properties';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Init';
  public widget: DashboardWidgetModel = {
    letterConfigCount: 0,
    deletedLetterConfigCount: 0,
    topUser: '',
    operationCount: 0,
    clientCount: 0,
  };

  public showLetter = false;
  public pdfSrc = null;
  public pdfBlob = null;
  public date: Date;
  public subscriptions: Array<Subscription> = [];

  constructor(private initService: InitService, private loadingService: LoadingService, private modalService: ModalService) { }

  ngOnInit() {
    sessionStorage.setItem('title', this.formTitle);

    const sst = sessionStorage;
    const logedRol = sst.profile;
    if (logedRol === SharedProperties.ROL_VIEWVER || logedRol === SharedProperties.ROL_CLIENT) {
      this.showLetter = true;
      this.loadPdf();
    }else{
      this.showLetter = false;
      this.loadStatistics();
    }

    //this.iniciarSelects();
    this.date = new Date();


  }

  loadStatistics() {
    this.subscriptions.push(
      zip(
        this.initService.findAllDashboardWidgets()
      ).subscribe(result => {
        this.loadingService.hide();
        this.widget = result[0];
      })
    );
  }

  async loadPdf() {
    this.loadingService.show();
    await this.initService.download().toPromise()
      .then(blob => {
        this.loadingService.hide();
        this.pdfBlob = blob;

        const fileReader = new FileReader();
        fileReader.onload = () => {
          this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
        };
        fileReader.readAsArrayBuffer(blob);
      })
      .catch(async error => {
        this.loadingService.hide();
        this.handleError(error);
      });
  }

  private async handleError(error) {
    this.loadingService.hide();
    if (error.error === 'LETTER_NOT_EXIST') {
      this.modalService.open({
        icon: 'warning',
        text: 'The customer does not have a letter associated with it',
        title: 'Letter does not exist.',
        acceptText: 'Accept'
      });
    } else if (error.error === 'CLIENT_NOT_EXIST') {
      this.modalService.open({
        icon: 'warning',
        text: 'The client does not exist in our records',
        title: 'Client does not exist',
        acceptText: 'Accept'
      });
    } else {
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.loadPdf();
      }
    }
  }



  async ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
