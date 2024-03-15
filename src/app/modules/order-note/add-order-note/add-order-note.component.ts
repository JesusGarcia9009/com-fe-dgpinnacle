import { ClientModel } from './../../masters/models/client.model';
import { OrderNoteProductModel } from './../models/order-note.model';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { OrderNoteModel } from '../models/order-note.model';
import { Observable, Subject, Subscription, zip } from 'rxjs';
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
import moment from 'moment';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { QuotationService } from '../../quotation/service/quotation.service';
import { QuotationModel } from '../../quotation/models/quotation.model';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-order-note',
  templateUrl: './add-order-note.component.html',
  styleUrls: ['./add-order-note.component.css']
})
export class AddOrderNoteComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de nota de pedido';
  public orderNoteForm: FormGroup;
  public orderNote: OrderNoteModel;
  public subscriptions: Array<Subscription> = [];

  public clientList: Array<ClientModel>;
  public productList: Array<ProductModel>;
  public productListAll: Array<ProductModel> = [];
  public clientSelected: ClientModel;
  public isReadOnly: boolean;

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

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  @ViewChild('autoCompleteQuotationInput', { read: MatAutocompleteTrigger }) autoCompleteQuotation: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProductInput', { read: MatAutocompleteTrigger }) autoCompleteProduct: MatAutocompleteTrigger;

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  filteredClientsOptions: Observable<any[]>;
  filteredProdutsOptions: Observable<any[]>;


  //radio
  optionSelected: number ;
  optionsRadio: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private orderNoteService: OrderService,
    private clientService: ClientService,
    private productService: ProductService,
    private quotationService: QuotationService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);

    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.orderNote = this.orderNoteService.orderNoteSelected;
    this.initForm();


    if (this.orderNote) {
      this.formTitle = 'Edición de nota de pedido';
    }
    sessionStorage.setItem('title', this.formTitle);

    if (this.orderNote) {
      this.optionSelected = 2;
      this.optionsRadio = [{ id: 1, selected: false, name: 'Cargar de una cotización' }, { id: 2, selected: true, name: 'Crear nueva orden sin cotización' }]
    }else{
      this.optionSelected = 1;
      this.optionsRadio = [{ id: 1, selected: true, name: 'Cargar de una cotización' }, { id: 2, selected: false, name: 'Crear nueva orden sin cotización' }]
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterQuotation(value))
    )
    this.filteredClientsOptions = this.orderNoteFormControls.clientFantasyName.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterClient(value))
    )
    this.filteredProdutsOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )

  }

  doFilterQuotation(value) {
    return this.quotationService.complete(value);
  }
  doFilterProduct(value) {
    return this.quotationService.findProductsByCode(value);
  }
  doFilterClient(value) {
    return this.quotationService.findClientsByCode(value);
  }

  initLoad(orderNote: OrderNoteModel = null) {
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
          this.orderNoteForm.patchValue(orderNote);
          if (orderNote.deliveryDate)
            this.orderNoteFormControls.deliveryDate = new FormControl(new Date(orderNote.deliveryDate));
          if (orderNote.dateOfBill)
            this.orderNoteFormControls.dateOfBill = new FormControl(new Date(orderNote.dateOfBill));
          if (orderNote.dateOfPurchaseOrder)
            this.orderNoteFormControls.dateOfPurchaseOrder = new FormControl(new Date(orderNote.dateOfPurchaseOrder));
          if (orderNote.reverseDateOfCreditNote)
            this.orderNoteFormControls.reverseDateOfCreditNote = new FormControl(new Date(orderNote.reverseDateOfCreditNote));
          this.onClientSelectChange(orderNote.clientId);
          this.orderNoteProductsList = orderNote.orderNoteProductsList;
          this.loadingTable();
          this.loadingTotals(orderNote.discount);
        }
      })
    );
  }

  getDate(date: moment.Moment) {
    let result: any = new Date();
    if (date) {
      const fecha = moment(date);
      result = { year: parseInt(fecha.format('YYYY')), month: parseInt(fecha.format('M')), day: parseInt(fecha.format('D')), hour: parseInt(fecha.format('HH')), minute: parseInt(fecha.format('mm')) };
    }
    return result;
  }


  initForm() {
    if (this.isReadOnly) {
      this.orderNoteForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        updateName: [{ value: null, disabled: true }, []],
        updateDate: [{ value: null, disabled: true }, []],
        generationDate: [{ value: null, disabled: true }, []],
        deliveryDate: [{ value: null, disabled: true }, []],
        discount: [{ value: null, disabled: true }, []],
        iva: [{ value: null, disabled: true }, []],
        additionalInformation: [{ value: null, disabled: true }, []],
        clientId: [{ value: null, disabled: true }, []],
        clientRutOrId: [{ value: null, disabled: true }, []],
        clientFantasyName: [{ value: null, disabled: true }, []],
        orderNoteStateId: [{ value: null, disabled: true }, []],
        orderNoteStateName: [{ value: null, disabled: true }, []],
        numberOfPurchaseOrder: [{ value: null, disabled: true }, []],
        dateOfPurchaseOrder: [{ value: null, disabled: true }, []],
        reverseNumberOfCreditNote: [{ value: null, disabled: true }, []],
        reverseDateOfCreditNote: [{ value: null, disabled: true }, []],
        reverseAdditionalInformation: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.orderNoteForm = this.fb.group({
        id: ['', []],
        discount: [0, []],
        additionalInformation: ['', []],
        clientId: ['', [Validators.required]],
        clientRutOrId: ['', []],
        clientFantasyName: ['', []],
        productId: ['', []],
        deliveryDate: ['', []],
        numberOfPurchaseOrder: ['', []],
        dateOfPurchaseOrder: ['', []],
        reverseNumberOfCreditNote: ['', []],
        reverseDateOfCreditNote: ['', []],
        reverseAdditionalInformation: ['', []]
      }
      );
    }

    this.productForm = this.fb.group({
      id: ['', []],
      order: ['', []],
      amount: ['', [Validators.required, Validators.min(1)]],
      salePrice: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      productGISCode: ['', [Validators.required]]
    });
    this.loadingTable();
    this.loadingTotals();

    if (this.orderNote) {
      this.initLoad(this.orderNote);
    } else {
      this.initLoad();
    }

  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  get orderNoteFormControls() { return this.orderNoteForm.controls; }
  get productFormControls() { return this.productForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: OrderNoteModel = this.orderNoteForm.value;
    if (this.orderNote) {
      formValue.id = this.orderNote.id;
    }
    formValue.orderNoteProductsList = this.orderNoteProductsList;

    this.subscriptions.push(this.orderNoteService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = formValue.id ? 'editada' : 'registrada';

      await this.modalService.open(
        {
          titulo: `Nota de pedido ${textRegistro}`,
          texto: `La nota de pedido fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.orderNoteForm.reset();
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

  onClientSelectChange(clientId) {
    this.clientSelected = this.clientList.find(t => t.id === clientId);

    let formValue: OrderNoteModel = this.orderNoteForm.value;
    formValue.clientId = this.clientSelected.id;
    formValue.clientRutOrId = this.clientSelected.rutOrId;
    formValue.clientFantasyName = this.clientSelected.fantasyName;
    this.orderNoteForm.patchValue(formValue);
  }

  onProductSelectChange(productId) {
    const productSelected = this.productList.find(t => t.id === productId);
    let formValue: OrderNoteProductModel = this.productForm.value;
    formValue.productId = productSelected.id;
    formValue.productDescription = productSelected.description;
    formValue.salePrice = productSelected.salePrice;
    formValue.amount = 1;

    formValue.productGISCode = productSelected.brandCode + '-' + productSelected.universalGroupCode + '-' + productSelected.modelCode + '-' + productSelected.sourceCode;
    this.productForm.patchValue(formValue);
  }

  onProductUpdateChange(productSelected: OrderNoteProductModel) {
    let formValue: OrderNoteProductModel = this.productForm.value;
    formValue.productId = productSelected.productId;
    formValue.productDescription = productSelected.productDescription;
    formValue.salePrice = productSelected.salePrice;
    formValue.amount = productSelected.amount;
    formValue.id = productSelected.id;
    formValue.productGISCode = productSelected.productGISCode;
    this.productForm.patchValue(formValue);

    const index = this.orderNoteProductsList.indexOf(productSelected);
    this.orderNoteProductsList.splice(index, 1);
    this.loadingTable();

    let formValueOrderNote: OrderNoteModel = this.orderNoteForm.value;
    const inputValue = formValueOrderNote.discount;
    this.loadingTotals(inputValue);

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  deleteProduct(productSelected: OrderNoteProductModel) {
    const index = this.orderNoteProductsList.indexOf(productSelected);
    this.orderNoteProductsList.splice(index, 1);
    this.loadingTable();

    let formValue: OrderNoteModel = this.orderNoteForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  onSubmitProduct() {
    const temp: OrderNoteProductModel = this.productForm.value;

    this.orderNoteProductsList.push(temp);
    this.productForm.reset();
    for (let name in this.productForm.controls) {
      this.productForm.controls[name].setErrors(null);
    }

    this.loadingTable();

    let formValue: OrderNoteModel = this.orderNoteForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);

    this.filteredProdutsOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )
  }

  volver() {
    this.orderNoteService.orderNoteSelected = null;
    this.router.navigate(['order/list-order']);
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

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      order: [[1, 'desc']],
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

  onQuotationSelectChange(quotationId) {
    this.quotationService.findById(quotationId).subscribe(
      (response) => {
        let data: QuotationModel = response;
        this.myControl.setValue(data.id + ' - ' + data.clientFantasyName + ' (' + data.attention + ') ');
        let orderNoteProductsList: Array<OrderNoteProductModel> = [];
        const client: ClientModel = this.clientList.find(t => t.id === data.clientId);
        data.quotationProductList.forEach(element => {
          orderNoteProductsList.push({
            id: element.id,
            amount: element.amount,
            salePrice: element.salePrice,
            productId: element.productId,
            productDescription: element.productDescription,
            productGISCode: element.productGISCode
          });
        });

        this.orderNote = {
          id: this.orderNote && this.orderNote.id ? this.orderNote.id : null,
          updateName: data.updateName,
          generationDate: data.generationDate,
          updateDate: null,
          deliveryDate: data.deliveryDate,
          discount: data.discount,
          iva: data.iva,
          showAdditionalInformation: true,
          additionalInformation: '',
          numberOfBill: null,
          dateOfBill: null,
          numberOfPurchaseOrder: null,
          dateOfPurchaseOrder: null,
          deliveryType: client.deliveryTypeDescription,
          transport: client.transport,
          numberCreditNote: null,
          dateCreditNote: null,

          clientId: data.clientId,
          clientRutOrId: data.clientRutOrId,
          clientFantasyName: data.clientFantasyName,

          orderNoteStateId: data.quotationStateId,
          orderNoteStateName: null,

          reverseId: null,
          reverseUpdateName: null,
          reverseNumberOfCreditNote: null,
          reverseDateOfCreditNote: null,
          reverseAdditionalInformation: null,

          orderNoteProductsList: orderNoteProductsList
        };
        this.initLoad(this.orderNote);
      }
    );

  }

  radioChange(value: number) {

    this.optionSelected = value;
    //limpiar
    if (value === 1) {
      this.orderNoteService.orderNoteSelected = null;
    }
  }

  doMultiply(number1: number, number2: number) {
    return number1 * number2;
  }

  doFilter(filterKey) {
    let formValue: OrderNoteModel = this.orderNoteForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);
  }

  scrollEvent = (event: any): void => {
    if (this.autoComplete.panelOpen)
      this.autoComplete.updatePosition();
    if (this.autoCompleteProduct.panelOpen)
      this.autoCompleteProduct.updatePosition();
    if (this.autoCompleteQuotation.panelOpen)
      this.autoCompleteQuotation.updatePosition();
  };

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.orderNoteService.orderNoteSelected = null;
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}
