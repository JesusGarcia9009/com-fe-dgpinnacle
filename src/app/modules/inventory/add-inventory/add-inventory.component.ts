import { InventoryReasonModel } from './../../maintainer/models/inventory.reason.model';
import { InventoryreasonService } from './../../maintainer/service/inventoryreason.service';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { InventoryModel, InventoryProductModel } from '../models/inventory.model';
import { Observable, Subject, Subscription, zip } from 'rxjs';
import { ProductModel } from '../../masters/models/product.model';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../service/inventory.service';
import { ProductService } from '../../masters/service/product.service';
import moment from 'moment';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { QuotationService } from '../../quotation/service/quotation.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Registro de ajuste de inventario';
  public inventoryForm: FormGroup;
  public inventory: InventoryModel;
  public subscriptions: Array<Subscription> = [];

  public productList: Array<ProductModel>;
  public inventoryReasonList: Array<InventoryReasonModel>;
  public productListAll: Array<ProductModel> = [];
  public isReadOnly: boolean;

  public totalExcludingIva: number = 0;
  public totalDiscount: number = 0;
  public totalNet: number = 0;
  public totalIVA: number = 0;
  public total: number = 0;

  //tabla de productos
  public productForm: FormGroup;
  public dtOptions: DataTables.Settings = {};
  public tblData: InventoryProductModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public inventoryProductsList: Array<InventoryProductModel> = [];

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  filteredOptions: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private inventoryService: InventoryService,
    private productService: ProductService,
    private inventoryreasonService: InventoryreasonService,
    private quotationService: QuotationService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit() {

    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.inventory = this.inventoryService.inventorySelected;
    this.initForm();


    if (this.inventory) {
      this.formTitle = 'Edición de ajuste de inventario';
    }
    sessionStorage.setItem('title', this.formTitle);

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )
  }

  doFilterProduct(value) {
    return this.quotationService.findProductsByCode(value);
  }

  initLoad(inventory: InventoryModel = null) {
    this.loadingService.show();
    this.subscriptions.push(
      zip(
        this.inventoryreasonService.getAll(),
        this.productService.getAll()
      ).subscribe(result => {
        this.loadingService.hide();
        this.inventoryReasonList = result[0];
        this.productList = result[1];
        this.productList.forEach(element => {
          this.productListAll.push(element);
        });
        if (inventory) {
          this.inventoryForm.patchValue(inventory);
          if(inventory.dateInventoryTweaks)
            this.inventoryFormControls.dateInventoryTweaks = new FormControl(new Date(inventory.dateInventoryTweaks));
          this.inventoryProductsList = inventory.inventoryTweaksProductsList;
          this.loadingTable();
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
      this.inventoryForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        username: [{ value: null, disabled: true }, []],
        dateInventoryTweaks: [{ value: null, disabled: true }, []],
        reason: [{ value: null, disabled: true }, []],
        additionalInformation: [{ value: null, disabled: true }, []]
      }
      );
    } else {
      this.inventoryForm = this.fb.group({
        id: ['', []],
        username: [0, []],
        dateInventoryTweaks: ['', []],
        reason: ['', [Validators.required]],
        additionalInformation: ['', []]
      }
      );
    }

    this.productForm = this.fb.group({
      id: ['', []],
      amount: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      productGISCode: ['', [Validators.required]]
    });
    this.loadingTable();
    if (this.inventory) {
      this.initLoad(this.inventory);
    } else {
      this.initLoad();
    }

  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  get inventoryFormControls() { return this.inventoryForm.controls; }
  get productFormControls() { return this.productForm.controls; }

  onRegisterSubmit() {
    this.loadingService.show();
    const formValue: InventoryModel = this.inventoryForm.value;
    if (this.inventory) {
      formValue.id = this.inventory.id;
    }
    formValue.inventoryTweaksProductsList = this.inventoryProductsList;

    this.subscriptions.push(this.inventoryService.save(formValue).subscribe(async response => {
      this.loadingService.hide();
      const textRegistro = formValue.id ? 'editado' : 'registrado';

      await this.modalService.open(
        {
          titulo: `El ajuste de inventario ${textRegistro}`,
          texto: `El ajuste fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.inventoryForm.reset();
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

  onProductSelectChange(productId) {
    const productSelected = this.productList.find(t => t.id === productId);
    let formValue: InventoryProductModel = this.productForm.value;
    formValue.productId = productSelected.id;
    formValue.productDescription = productSelected.description;
    formValue.amount = 1;

    formValue.productGISCode = productSelected.brandCode + '-' + productSelected.modelCode + '-' + productSelected.universalGroupCode + '-' + productSelected.sourceCode;
    this.productForm.patchValue(formValue);
  }

  onProductUpdateChange(productSelected: InventoryProductModel) {
    let formValue: InventoryProductModel = this.productForm.value;
    formValue.productId = productSelected.productId;
    formValue.productDescription = productSelected.productDescription;
    formValue.amount = productSelected.amount;
    formValue.id = productSelected.id;
    formValue.productGISCode = productSelected.productGISCode;
    this.productForm.patchValue(formValue);

    const index = this.inventoryProductsList.indexOf(productSelected);
    this.inventoryProductsList.splice(index, 1);
    this.loadingTable();

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  deleteProduct(productSelected: InventoryProductModel) {
    const index = this.inventoryProductsList.indexOf(productSelected);
    this.inventoryProductsList.splice(index, 1);
    this.loadingTable();

    let product: ProductModel = this.productListAll.find(t => t.id === productSelected.productId);
    this.productList.push(product);
  }

  onSubmitProduct() {
    const temp: InventoryProductModel = this.productForm.value;
    this.inventoryProductsList.push(temp);
    this.productForm.reset();
    for (let name in this.productForm.controls) {
      this.productForm.controls[name].setErrors(null);
    }

    this.loadingTable();

    this.filteredOptions = this.productFormControls.productDescription.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilterProduct(value))
    )
  }

  volver() {
    this.inventoryService.inventorySelected = null;
    this.router.navigate(['inventory/list-inventory']);
  }


  ////tabla
  async loadingTable() {
    this.dtOptions = this.getDtOptions();
    if (this.inventoryProductsList) {
      this.tblData = this.inventoryProductsList;
      if(this.dtElement){
        const dtInstance = await this.dtElement.dtInstance;
        if (dtInstance) {
          dtInstance.destroy();
        }
        this.dtTrigger.next();
      }
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

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.inventoryService.inventorySelected = null;
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}
