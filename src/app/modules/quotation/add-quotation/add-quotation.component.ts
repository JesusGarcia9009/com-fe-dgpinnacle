import { QuotationdeliveryService } from './../../maintainer/service/quotationdelivery.service';
import { InventoryreasonService } from './../../maintainer/service/inventoryreason.service';
import { ProductService } from './../../masters/service/product.service';
import { ProductModel } from './../../masters/models/product.model';
import { QuotationService } from './../service/quotation.service';
import { ClientService } from './../../masters/service/client.service';
import { ClientModel } from './../../masters/models/client.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, zip } from 'rxjs';
import { QuotationModel, QuotationProductModel } from '../models/quotation.model';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import moment from 'moment';
import { QuotationDeliveryModel } from '../../maintainer/models/quotation.delivery.model';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.css']
})
export class AddQuotationComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de Cotizaciones';
  public quotationForm: FormGroup;
  public quotation: QuotationModel;
  public subscriptions: Array<Subscription> = [];

  public clientList: Array<ClientModel>;
  public productList: Array<ProductModel>;
  public productListAll: Array<ProductModel> = [];
  public deliveryList: Array<QuotationDeliveryModel> = [];
  public clientSelected: ClientModel;
  public isReadOnly: boolean;
  public isValid: boolean = false;

  public totalExcludingIva: number = 0;
  public totalDiscount: number = 0;
  public totalNet: number = 0;
  public totalIVA: number = 0;
  public total: number = 0;

  ////test
  public productForm: FormGroup;
  public dtOptions: DataTables.Settings = {};
  public tblData: QuotationProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public quotationProductsList: Array<QuotationProductModel> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProductInput', { read: MatAutocompleteTrigger }) autoCompleteProduct: MatAutocompleteTrigger;

  filteredOptions: Observable<any[]>;
  filteredClientsOptions: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private quotationService: QuotationService,
    private clientService: ClientService,
    private productService: ProductService,
    private quotationdeliveryService: QuotationdeliveryService
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }

    this.quotation = this.quotationService.quotationSelected;
    this.initForm();


    if (this.quotation) {
      this.formTitle = 'Edición de Cotizaciones';
    }
    sessionStorage.setItem('title', this.formTitle);

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )

    this.filteredClientsOptions = this.quotationFormControls.clientFantasyName.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterClient(value))
    )
  }

  doFilterProduct(value) {
    return this.quotationService.findProductsByCode(value);
  }
  doFilterClient(value) {
    return this.quotationService.findClientsByCode(value);
  }


  initLoad(quotation: QuotationModel = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.clientService.getClients(),
        this.productService.getAll(),
        this.quotationdeliveryService.getAll()
      ).subscribe(result => {
        this.loadingService.hide();
        this.clientList = result[0];
        this.productList = result[1];
        this.deliveryList = result[2]
        this.productList.forEach(element => { this.productListAll.push(element); });
        if (quotation) {
          this.quotationForm.patchValue(quotation);
          this.onClientSelectChange(quotation.clientId);
          this.quotationProductsList = quotation.quotationProductList;
          this.loadingTable();
          this.loadingTotals(quotation.discount);
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
      this.quotationForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        updateName: [{ value: null, disabled: true }, []],
        updateDate: [{ value: null, disabled: true }, []],
        generationDate: [{ value: null, disabled: true }, []],
        discount: [{ value: null, disabled: true }, []],
        iva: [{ value: null, disabled: true }, []],
        attention: [{ value: null, disabled: true }, []],
        additionalInformation: [{ value: null, disabled: true }, []],
        clientId: [{ value: null, disabled: true }, []],
        clientRutOrId: [{ value: null, disabled: true }, []],
        clientFantasyName: [{ value: null, disabled: true }, []],
        quotationStateId: [{ value: null, disabled: true }, []],
        quotationStateName: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.quotationForm = this.fb.group({
        id: ['', []],
        discount: [0, []],
        attention: ['', []],
        additionalInformation: ['', []],
        clientId: ['', [Validators.required]],
        clientRutOrId: ['', [Validators.required]],
        clientFantasyName: ['', [Validators.required]],
        productId: ['', []],
      }
      );
    }

    this.productForm = this.fb.group({
      id: ['', []],
      amount: ['', [Validators.required, Validators.min(1)]],
      salePrice: ['', [Validators.required]],
      delivery: ['', []],
      productId: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      productGISCode: ['', [Validators.required]]
    });
    this.loadingTable();
    this.loadingTotals();

    if (this.quotation) {
      this.initLoad(this.quotation);
    } else {
      this.initLoad();
    }

  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  get quotationFormControls() { return this.quotationForm.controls; }
  get productFormControls() { return this.productForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: QuotationModel = this.quotationForm.value;
    if (this.quotation) {
      formValue.id = this.quotation.id;
    }
    formValue.quotationProductList = this.quotationProductsList;

    this.subscriptions.push(this.quotationService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = this.quotation ? 'editada' : 'registrada';

      await this.modalService.open(
        {
          titulo: `Cotización ${textRegistro}`,
          texto: `El Cotización fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.quotationForm.reset();
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
    let formValue: QuotationModel = this.quotationForm.value;
    if (this.quotation) {
      formValue.attention = this.quotation.attention;
    } else {
      formValue.clientId = this.clientSelected.id;
      formValue.clientRutOrId = this.clientSelected.rutOrId;
      formValue.clientFantasyName = this.clientSelected.fantasyName;
      formValue.attention = this.clientSelected.contactName;
    }
    this.quotationForm.patchValue(formValue);
  }

  onProductSelectChange(productId) {
    const productSelected = this.productList.find(t => t.id === productId);

    let formValue: QuotationProductModel = this.productForm.value;
    formValue.productId = productSelected.id;
    formValue.productDescription = productSelected.description;
    formValue.salePrice = productSelected.salePrice;
    formValue.amount = 1;
    formValue.delivery = 'DISPONIBLE';

    this.isValid = true;

    formValue.productGISCode = productSelected.brandCode + '-' + productSelected.universalGroupCode + '-' + productSelected.modelCode + '-' + productSelected.sourceCode;
    this.productForm.patchValue(formValue);
  }

  onProductUpdateChange(productSelected: QuotationProductModel) {
    let formValue: QuotationProductModel = this.productForm.value;
    formValue.productId = productSelected.productId;
    formValue.productDescription = productSelected.productDescription;
    formValue.salePrice = productSelected.salePrice;
    formValue.amount = productSelected.amount;
    formValue.delivery = productSelected.delivery;
    formValue.id = productSelected.id;
    formValue.productGISCode = productSelected.productGISCode;
    this.productForm.patchValue(formValue);

    const index = this.quotationProductsList.indexOf(productSelected);
    this.quotationProductsList.splice(index, 1);
    this.loadingTable();

    let formValueQuotation: QuotationModel = this.quotationForm.value;
    const inputValue = formValueQuotation.discount;
    this.loadingTotals(inputValue);

    // let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    // this.productList.push(product);
    this.isValid = true;
  }

  deleteProduct(productSelected: QuotationProductModel) {
    const index = this.quotationProductsList.indexOf(productSelected);
    this.quotationProductsList.splice(index, 1);
    this.loadingTable();

    let formValue: QuotationModel = this.quotationForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
    this.isValid = false;
  }

  onSubmitProduct() {
    const temp: QuotationProductModel = this.productForm.value;
    this.quotationProductsList.push(temp);
    this.productForm.reset();
    for (let name in this.productForm.controls) {
      this.productForm.controls[name].setErrors(null);
    }

    this.loadingTable();

    let formValue: QuotationModel = this.quotationForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);
    this.isValid = false;
    // let product: ProductModel = this.productList.find(t => t.id === temp.productId);
    // const index = this.productList.indexOf(product);
    // this.productList.splice(index, 1);

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )
  }

  volver() {
    this.quotationService.quotationSelected = null;
    this.router.navigate(['quotation/list-quotation']);
  }


  ////tabla
  async loadingTable() {
    this.dtOptions = this.getDtOptions();
    if (this.quotationProductsList) {
      this.tblData = this.quotationProductsList;
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
    if (this.quotationProductsList) {
      this.totalExcludingIva = 0;
      this.total = 0;
      for (let i = 0; i < this.quotationProductsList.length; i++) {
        this.totalExcludingIva += this.quotationProductsList[i].amount * this.quotationProductsList[i].salePrice;
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

  doMultiply(number1: number, number2: number) {
    return number1 * number2;
  }

  doFilter(filterKey) {
    let formValue: QuotationModel = this.quotationForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);
  }

  scrollEvent = (event: any): void => {
    if (this.autoComplete.panelOpen)
      // this.autoComplete.closePanel();
      this.autoComplete.updatePosition();
    if (this.autoCompleteProduct.panelOpen)
      // this.autoComplete.closePanel();
      this.autoCompleteProduct.updatePosition();  
  };

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.quotationService.quotationSelected = null;
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
