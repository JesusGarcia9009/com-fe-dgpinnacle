import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BillOrderNoteModel, OrderNoteModel, OrderNoteProductModel, ReverseOrderNoteModel } from '../models/order-note.model';
import { Subject, Subscription, zip } from 'rxjs';
import { ClientModel } from '../../masters/models/client.model';
import { ProductModel } from '../../masters/models/product.model';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../service/order.service';
import { ClientService } from '../../masters/service/client.service';
import { ProductService } from '../../masters/service/product.service';
import { QuotationService } from '../../quotation/service/quotation.service';

@Component({
  selector: 'app-bill-order-note',
  templateUrl: './bill-order-note.component.html',
  styleUrls: ['./bill-order-note.component.css']
})
export class BillOrderNoteComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Facturar de nota de pedido';
  public billOrderNoteForm: FormGroup;
  public orderNote: OrderNoteModel;
  public subscriptions: Array<Subscription> = [];

  public clientList: Array<ClientModel>;
  public productList: Array<ProductModel>;
  public productListAll: Array<ProductModel> = [];
  public clientSelected: ClientModel;

  public totalExcludingIva: number = 0;
  public totalDiscount: number = 0;
  public totalNet: number = 0;
  public totalIVA: number = 0;
  public total: number = 0;

  //tabla de productos
  public productForm: FormGroup;
  public dtOptions: DataTables.Settings = {};
  public tblData: OrderNoteProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public orderNoteProductsList: Array<OrderNoteProductModel> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private orderNoteService: OrderService,
    private clientService: ClientService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.orderNote = this.orderNoteService.orderNoteSelected;
    this.initForm();
  }

  initForm() {
    this.billOrderNoteForm = this.fb.group({
      id: ['', []],
      numberOfBill: ['', [Validators.required]],
      dateOfBill: ['', [Validators.required]],
    }
    );
    this.loadingTable();
    this.loadingTotals();

    if (this.orderNote) {
      this.initLoad(this.orderNote);
    } else {
      this.initLoad();
    }
    sessionStorage.setItem('title', this.formTitle);
  }

  initLoad(orderNote = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.clientService.getClients(),
        this.productService.getAll()
      ).subscribe(result => {
        this.loadingService.hide();
        this.clientList = result[0];
        this.productList = result[1];
        this.productList.forEach(element => {
          this.productListAll.push(element);
        });
        if (orderNote) {
          this.onClientSelectChange(orderNote.clientId);
          this.orderNoteProductsList = orderNote.orderNoteProductsList;
          this.loadingTable();
          this.loadingTotals(orderNote.discount);
          let formValue: OrderNoteModel = this.billOrderNoteForm.value;
          formValue.id = orderNote.id;
          this.billOrderNoteForm.patchValue(formValue);
        }
      })
    );
  }

  ////tabla
  async loadingTable() {
    this.dtOptions = this.getDtOptions();
    if (this.orderNoteProductsList) {
      this.tblData = this.orderNoteProductsList;
      if (this.dtElement) {
        const dtInstance = await this.dtElement.dtInstance;
        if (dtInstance) {
          dtInstance.destroy();
        }
        this.dtTrigger.next();
      }
    }
  }

  onClientSelectChange(clientId) {
    this.clientSelected = this.clientList.find(t => t.id === clientId);
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

  get billOrderNoteFormControls() { return this.billOrderNoteForm.controls; }

  loadingTotals(discount: number = 0) {
    if (this.orderNoteProductsList) {
      this.totalExcludingIva = 0;
      this.total = 0;
      for (let i = 0; i < this.orderNoteProductsList.length; i++) {
        this.totalExcludingIva += this.orderNoteProductsList[i].amount * this.orderNoteProductsList[i].salePrice;
      }
      this.totalDiscount = (this.totalExcludingIva * discount) / 100;
      this.totalNet = this.totalExcludingIva - this.totalDiscount
      this.totalIVA = (this.totalNet * 19) / 100;
      this.total = this.totalNet + this.totalIVA;
    }
  }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: BillOrderNoteModel = this.billOrderNoteForm.value;
    formValue.id = this.orderNote.id;

    this.subscriptions.push(this.orderNoteService.bill(formValue).subscribe(async response => {
      this.loadingService.hide();

      await this.modalService.open(
        {
          titulo: `Nota de pedido ${this.orderNote.id}`,
          texto: `La nota de pedido fue facturada correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.billOrderNoteForm.reset();
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
    this.orderNoteService.orderNoteSelected = null;
    this.router.navigate(['order/list-order']);
  }

  doMultiply(number1: number, number2: number) {
    return number1 * number2;
  }

  async ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

