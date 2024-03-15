import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BillOfBuyModel, BillOfBuyProductModel } from '../models/bills.model';
import { ProviderModel } from '../../masters/models/provider.model';
import { ProductModel } from '../../masters/models/product.model';
import { Observable, Subject, Subscription, zip } from 'rxjs';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { BillsService } from '../service/bills.service';
import { ProviderService } from '../../masters/service/provider.service';
import { ProductService } from '../../masters/service/product.service';
import moment from 'moment';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { QuotationService } from '../../quotation/service/quotation.service';

@Component({
  selector: 'app-add-bills',
  templateUrl: './add-bills.component.html',
  styleUrls: ['./add-bills.component.css']
})
export class AddBillsComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de facturas de compras';
  public billForm: FormGroup;
  public bill: BillOfBuyModel;
  public subscriptions: Array<Subscription> = [];

  public providerList: Array<ProviderModel>;
  public providerSelected: ProviderModel;

  public productList: Array<ProductModel>;
  public productListAll: Array<ProductModel> = [];
  public isReadOnly: boolean;

  public totalExcludingIva: number = 0;
  public totalDiscount: number = 0;
  public totalNet: number = 0;
  public totalIVA: number = 0;
  public total: number = 0;

  ////test
  public productForm: FormGroup;
  public dtOptions: DataTables.Settings = {};
  public tblData: BillOfBuyProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public billOfBuyProductsList: Array<BillOfBuyProductModel> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProductInput', { read: MatAutocompleteTrigger }) autoCompleteProduct: MatAutocompleteTrigger;

  filteredOptions: Observable<any[]>;
  filteredProvidersOptions: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private billOfBuyService: BillsService,
    private quotationService: QuotationService,
    private providerService: ProviderService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.bill = this.billOfBuyService.billSelected;
    this.initForm();

    if (this.bill) {
      this.formTitle = 'Edición de facturas de compras';
    }
    sessionStorage.setItem('title', this.formTitle);

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )

    this.filteredProvidersOptions = this.billFormControls.providerFantasyName.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProviders(value))
    )

  }

  doFilterProduct(value) {
    return this.quotationService.findProductsByCode(value);
  }
  doFilterProviders(value) {
    return this.billOfBuyService.findProvidersByCode(value);
  }

  initLoad(bill: BillOfBuyModel = null) {
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
        if (bill) {
          this.billForm.patchValue(bill);
          this.onProviderSelectChange(bill.providerId);
          this.billOfBuyProductsList = bill.billOfBuyProductsList;
          this.loadingTable();
          this.loadingTotals(bill.discount);
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
      this.billForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        username: [{ value: null, disabled: true }, []],
        generationDate: [{ value: null, disabled: true }, []],
        updateDate: [{ value: null, disabled: true }, []],
        discount: [{ value: null, disabled: true }, []],
        iva: [{ value: null, disabled: true }, []],
        additionalInformation: [{ value: null, disabled: true }, []],
        reverseAdditionalInformation: [{ value: null, disabled: true }, []],
        numberOfBill: [{ value: null, disabled: true }, []],
        dateOfBill: [{ value: null, disabled: true }, []],
        providerId: [{ value: null, disabled: true }, []],
        providerRutOrId: [{ value: null, disabled: true }, []],
        providerFantasyName: [{ value: null, disabled: true }, []],
        billOfBuyStateId: [{ value: null, disabled: true }, []],
        billOfBuyStateName: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.billForm = this.fb.group({
        id: ['', []],
        username: ['', []],
        generationDate: ['', []],
        updateDate: ['', []],
        discount: ['', []],
        iva: ['', []],
        additionalInformation: ['', []],
        reverseAdditionalInformation: ['', []],
        numberOfBill: ['', []],
        dateOfBill: ['', []],
        providerId: ['', [Validators.required]],
        providerRutOrId: ['', []],
        providerFantasyName: ['', []],
        billOfBuyStateId: ['', []],
        billOfBuyStateName: ['', []]
      }
      );
    }

    this.productForm = this.fb.group({
      id: ['', []],
      amount: ['', [Validators.required, Validators.min(1)]],
      salePrice: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      productGISCode: ['', [Validators.required]]
    });
    this.loadingTable();
    this.loadingTotals();

    if (this.bill) {
      this.initLoad(this.bill);
    } else {
      this.initLoad();
    }

  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  get billFormControls() { return this.billForm.controls; }
  get productFormControls() { return this.productForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: BillOfBuyModel = this.billForm.value;
    if (this.bill) {
      formValue.id = this.bill.id;
    }
    formValue.billOfBuyProductsList = this.billOfBuyProductsList;

    this.subscriptions.push(this.billOfBuyService.save(formValue).subscribe(async response => {

      this.loadingService.hide();
      if (response) {
        const textRegistro = this.bill ? 'editada' : 'registrada';

        await this.modalService.open(
          {
            titulo: `Factura ${textRegistro}`,
            texto: `La factura fue ${textRegistro} correctamente.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Aceptar',
            identificadorConfirmar: 'btn-GuardarPropiedad'
          }
        );
        this.billForm.reset();
        this.formDirective.resetForm();
        this.volver();
      } else {
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }

    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.onRegisterSubmit();
      }
    }));
  }

  onProviderSelectChange(providerId) {
    this.providerSelected = this.providerList.find(t => t.id === providerId);
    let formValue: BillOfBuyModel = this.billForm.value;

    formValue.providerId = this.providerSelected.id;
    formValue.providerRutOrId = this.providerSelected.rutOrId;
    formValue.providerFantasyName = this.providerSelected.fantasyName;

    this.billForm.patchValue(formValue);
  }

  onProductSelectChange(productId) {
    const productSelected = this.productList.find(t => t.id === productId);
    let formValue: BillOfBuyProductModel = this.productForm.value;
    formValue.productId = productSelected.id;
    formValue.productDescription = productSelected.description;
    formValue.salePrice = 0;
    formValue.amount = 1;

    formValue.productGISCode = productSelected.brandCode + '-' + productSelected.universalGroupCode + '-' + productSelected.modelCode + '-' + productSelected.sourceCode;
    this.productForm.patchValue(formValue);
  }

  onProductUpdateChange(productSelected: BillOfBuyProductModel) {
    let formValue: BillOfBuyProductModel = this.productForm.value;
    formValue.productId = productSelected.productId;
    formValue.productDescription = productSelected.productDescription;
    formValue.salePrice = productSelected.salePrice;
    formValue.amount = productSelected.amount;
    formValue.id = productSelected.id;
    formValue.productGISCode = productSelected.productGISCode;
    this.productForm.patchValue(formValue);

    const index = this.billOfBuyProductsList.indexOf(productSelected);
    this.billOfBuyProductsList.splice(index, 1);
    this.loadingTable();

    let formValueBill: BillOfBuyModel = this.billForm.value;
    const inputValue = formValueBill.discount;
    this.loadingTotals(inputValue);

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  deleteProduct(productSelected: BillOfBuyProductModel) {
    const index = this.billOfBuyProductsList.indexOf(productSelected);
    this.billOfBuyProductsList.splice(index, 1);
    this.loadingTable();

    let formValue: BillOfBuyModel = this.billForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  onSubmitProduct() {
    const temp: BillOfBuyProductModel = this.productForm.value;
    this.billOfBuyProductsList.push(temp);
    this.productForm.reset();
    for (let name in this.productForm.controls) {
      this.productForm.controls[name].setErrors(null);
    }

    this.loadingTable();

    let formValue: BillOfBuyModel = this.billForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )
  }

  volver() {
    this.billOfBuyService.billSelected = null;
    this.router.navigate(['bill/list-bills']);
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
    let formValue: BillOfBuyModel = this.billForm.value;
    const inputValue = formValue.discount;
    this.loadingTotals(inputValue);
  }

  scrollEvent = (event: any): void => {
    if (this.autoComplete.panelOpen)
      this.autoComplete.updatePosition();
    if (this.autoCompleteProduct.panelOpen)
      this.autoCompleteProduct.updatePosition();  
  };

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.billOfBuyService.billSelected = null;
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}
