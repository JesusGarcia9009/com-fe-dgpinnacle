import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { InventoryModel } from '../models/inventory.model';
import { FormGroupDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/core/services/modal.service';
import { LoadingService } from '../../core/core/services/loading.service';
import { InventoryService } from '../service/inventory.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public inventoryListData: Array<InventoryModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: InventoryModel[] = [];
  public dtTrigger: Subject<any> = new Subject();
  public tabIndex = 1;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    if (this.inventoryService.inventorySelected) {
      this.tabIndex = 0;
    }
    this.iniciarTabla();
  }

  iniciarTabla() {

    this.dtOptions = this.getDtOptions();
    this.loadingService.show();
    this.subscriptions.push(this.inventoryService.findAll().subscribe(async data => {
      this.loadingService.hide();
      this.tblData = data;
      this.inventoryListData = data;

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
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }

  implement(inventory: InventoryModel) {
    this.loadingService.show();
    this.inventoryService.implement(inventory).toPromise()
      .then(response => {
        this.loadingService.hide();
        if (response) {
          this.modalService.open(
            {
              titulo: `El ajuste de inventario ${inventory.id}`,
              texto: `fue aplicado correctamente.`,
              icono: 'success',
              mostrarBotonCancelar: false,
              textoAceptar: 'Aceptar',
              identificadorConfirmar: 'btn-GuardarPropiedad'
            }
          );
        } else {
          const result = this.modalService.open({
            tipoGenerico: 'error-gen'
          });
        }
        this.iniciarTabla();
      })
      .catch(
        async error => {
          this.loadingService.hide();
          const result = await this.modalService.open({
            tipoGenerico: 'error-gen'
          });
          if (result) {
            this.implement(inventory);
          }
        });
  }

  redirectToEdit(inventory: InventoryModel) {
    this.inventoryService.inventorySelected = inventory;
    this.router.navigate(['/inventory/add-inventory']);
  }

  redirectToView(inventory: InventoryModel) {
    this.inventoryService.inventorySelected = inventory;
    this.router.navigate(['/inventory/add-inventory/ver']);
  }

  async onDelete(inventory: InventoryModel) {
    this.loadingService.show();

    this.subscriptions.push(this.inventoryService.delete(inventory).subscribe(async response => {
      this.loadingService.hide();

      await this.modalService.open(
        {
          titulo: `El ajuste de inventario ${inventory.id}`,
          texto: `fue reversado correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarPropiedad'
        }
      );
      this.iniciarTabla();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
      if (modalResult) {
        this.onDelete(inventory);
      }
    }));
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

