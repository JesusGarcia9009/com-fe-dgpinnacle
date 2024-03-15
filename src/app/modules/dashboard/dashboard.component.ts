import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';


import { InitService } from './services/init.service';
import { ModalService } from '../../modules/core/core/services/modal.service';
import { LoadingService } from '../../modules/core/core/services/loading.service';
import Chartist from 'chartist';
import { Subscription,  zip } from 'rxjs';
import { DashboardWidgetModel } from './models/quotation.model';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Inicio';
  public widget: DashboardWidgetModel = {
    productsGreater: 0,
    productsLess: 0,
    orderNoteNumber: 0,
    billOfBuyNumber: 0,
    quotationNumber: 0,
    quotationAmount: 0,
	  orderNoteAmount: 0,
    quotationList: [],
    orderNoteList: [],
    moreSellersProduct: [],
    lessSellersProduct: []
  };
  public higherValueQ = 0;
  public higherValueOn = 0;
  public higherValueProductMore = 0;
  public labelQ: Array<string>= [];
  public labelOn: Array<string>= [];
  public labelProductMore: Array<string>= ['No hay ventas registradas'];
  public seriesQuotation: Array<number>= [];
  public seriesOrderNote: Array<number>= [];
  public seriesProductMore: Array<number>= [0];
  public date: Date;
  public subscriptions: Array<Subscription> = [];

  constructor(private initService: InitService) { }

  ngOnInit() {
    sessionStorage.setItem('title', this.formTitle);
    this.iniciarSelects();
    this.date = new Date();

   
  }

  iniciarSelects() {
    this.subscriptions.push(
      zip(
        this.initService.findAllDashboardWidgets()
      ).subscribe(result => {
        this.widget = result[0];
        for(let i = 0; i < this.widget.quotationList.length; i++){
          this.labelQ.push(this.widget.quotationList[i].weekDay);
          this.seriesQuotation.push(this.widget.quotationList[i].numberQuotation);
    
          if(this.widget.quotationList[i].numberQuotation > this.higherValueQ)
            this.higherValueQ = this.widget.quotationList[i].numberQuotation;
        }
        for(let i = 0; i < this.widget.orderNoteList.length; i++){
          this.labelOn.push(this.widget.orderNoteList[i].weekDay);
          this.seriesOrderNote.push(this.widget.orderNoteList[i].numberOrderNote);
    
          if(this.widget.orderNoteList[i].numberOrderNote > this.higherValueOn)
            this.higherValueOn = this.widget.orderNoteList[i].numberOrderNote;
        }
        if(this.widget.moreSellersProduct.length > 0){
          this.seriesProductMore = [];
          this.labelProductMore = [];
        }
        for(let i = 0; i < this.widget.moreSellersProduct.length; i++){
          
          this.labelProductMore.push(this.widget.moreSellersProduct[i].productGis);
          this.seriesProductMore.push(this.widget.moreSellersProduct[i].amount);
    
          if(this.widget.moreSellersProduct[i].amount > this.higherValueProductMore)
            this.higherValueProductMore = this.widget.moreSellersProduct[i].amount;
        }
        this.getQuotationChart();
        this.getOrderNoteChart();
        this.getProductBestSerlersChart();
      })
    );
  }

  getQuotationChart(){
    const dataDailySalesChart: any = {
      labels: this.labelQ,
      series: [
        this.seriesQuotation
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: this.higherValueQ + 2, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }

  getOrderNoteChart(){
    
    const dataCompletedTasksChart: any = {
      labels: this.labelOn,
      series: [
        this.seriesOrderNote
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: this.higherValueOn + 2,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
  }

  getProductBestSerlersChart(){
    
     /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

     var datawebsiteViewsChart = {
      labels: this.labelProductMore,
      series: [
        this.seriesProductMore
      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: this.higherValueProductMore,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  async ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
