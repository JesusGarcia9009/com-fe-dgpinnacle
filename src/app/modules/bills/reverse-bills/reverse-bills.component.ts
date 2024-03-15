import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BillOfBuyModel, BillOfBuyProductModel, ReverseBillOfBuyModel } from '../models/bills.model';
import { Subject, Subscription, zip } from 'rxjs';
import { ProviderModel } from '../../masters/models/provider.model';
import { ProductModel } from '../../masters/models/product.model';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../masters/service/product.service';
import { ProviderService } from '../../masters/service/provider.service';
import { BillsService } from '../service/bills.service';

@Component({
  selector: 'app-reverse-bills',
  templateUrl: './reverse-bills.component.html',
  styleUrls: ['./reverse-bills.component.css']
})
export class ReverseBillsComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de reversa de factura de compra';
  public reverseBillOfBuyForm: FormGroup;
  public billOfBuy: BillOfBuyModel;
  public subscriptions: Array<Subscription> = [];

  public providerList: Array<ProviderModel>;
  public productList: Array<ProductModel>;
  public productListAll: Array<ProductModel> = [];
  public providerSelected: ProviderModel;

  public totalExcludingIva: number = 0;
  public totalDiscount: number = 0;
  public totalNet: number = 0;
  public totalIVA: number = 0;
  public total: number = 0;

  //tabla de productos
  public productForm: FormGroup;
  public dtOptions: DataTables.Settings = {};
  public tblData: BillOfBuyProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public billOfBuyProductsList: Array<BillOfBuyProductModel> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    public  dialog: MatDialog,
    private billOfBuyService: BillsService,
    private providerService: ProviderService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.billOfBuy = this.billOfBuyService.billSelected;
    this.initForm();

    sessionStorage.setItem('title', this.formTitle);
  }

  initForm() {
    this.reverseBillOfBuyForm = this.fb.group({
      id: ['', []],
      idBillOfBuy: [0, []],
      additionalInformation: ['', []]
    }
    );
    this.loadingTable();
    this.loadingTotals();

    if (this.billOfBuy) {
      this.initLoad(this.billOfBuy);
    } else {
      this.initLoad();
    }

  }

  initLoad(billOfBuy = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.providerService.getAll(),
        this.productService.getAll()
      ).subscribe(result => {
        this.loadingService.hide();
        this.providerList = result[0];
        this.productList = result[1];
        this.productList.forEach(element => {
          this.productListAll.push(element);
        });
        if (billOfBuy) {
          this.onProviderSelectChange(billOfBuy.providerId);
          this.billOfBuyProductsList = billOfBuy.billOfBuyProductsList;
          this.loadingTable();
          this.loadingTotals(billOfBuy.discount);
          let formValue: ReverseBillOfBuyModel = this.reverseBillOfBuyForm.value;
          formValue.idBillOfBuy = billOfBuy.id;
          this.reverseBillOfBuyForm.patchValue(formValue);
        }
      })
    );
  }

  ////tabla
  async loadingTable() {
    this.dtOptions = this.getDtOptions();
    if (this.billOfBuyProductsList) {
      this.tblData = this.billOfBuyProductsList;
      if (this.dtElement) {
        const dtInstance = await this.dtElement.dtInstance;
        if (dtInstance) {
          dtInstance.destroy();
        }
        this.dtTrigger.next();
      }
    }
  }

  onProviderSelectChange(providerId) {
    this.providerSelected = this.providerList.find(t => t.id === providerId);
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

  get reverseBillOfBuyFormControls() { return this.reverseBillOfBuyForm.controls; }

  loadingTotals(discount: number = 0) {
    if (this.billOfBuyProductsList) {
      this.totalExcludingIva = 0;
      this.total = 0;
      for (let i = 0; i < this.billOfBuyProductsList.length; i++) {
        this.totalExcludingIva += this.billOfBuyProductsList[i].amount * this.billOfBuyProductsList[i].salePrice;
      }
      this.totalDiscount = (this.totalExcludingIva * discount) / 100;
      this.totalNet = this.totalExcludingIva - this.totalDiscount
      this.totalIVA = (this.totalNet * 19) / 100;
      this.total = this.totalNet + this.totalIVA;
    }
  }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: ReverseBillOfBuyModel = this.reverseBillOfBuyForm.value;
    formValue.idBillOfBuy = this.billOfBuy.id;

    this.subscriptions.push(this.billOfBuyService.reverse(formValue).subscribe(async response => {
      this.loadingService.hide();

      await this.modalService.open(
        {
          titulo: `Factura de compra ${this.billOfBuy.id}`,
          texto: `La factura de compra fue reversada correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.reverseBillOfBuyForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.onRegisterSubmit();
      }
    }));
  }

  volver() {
    this.billOfBuyService.billSelected = null;
    this.router.navigate(['bill/list-bills']);
  }

  doMultiply(number1: number, number2: number) {
    return number1 * number2;
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}
