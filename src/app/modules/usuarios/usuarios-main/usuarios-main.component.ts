import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subscription, Subject } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios-main',
  templateUrl: './usuarios-main.component.html',
  styleUrls: ['./usuarios-main.component.css']
})
export class UsuariosMainComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public userListData: Array<UsuarioModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: UsuarioModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;


  constructor(
    private usuarioService: UsuarioService,
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    sessionStorage.setItem('title', 'Usuarios');
    this.iniciarTabla();
  }

  iniciarTabla() {
    this.loadingService.show();
    this.dtOptions = this.getDtOptions();

    this.subscriptions.push(this.usuarioService.getUsuarioList().subscribe(async data => {
      this.loadingService.hide();
      this.tblData = data;
      this.userListData = data;

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


  redirectToEdit(user: UsuarioModel) {
    this.usuarioService.userSelected = user;
    this.router.navigate(['/usuarios/add-upd-user']);
  }

  async onEliminar(userSel: UsuarioModel) {

    const resultModal = await this.modalService.open(
      {
        titulo: 'Eliminar Usuario',
        texto: `¿Esta seguro que desea eliminar al usuario "${userSel.names} ${userSel.middleName} ${userSel.lastName}"?`,
        icono: 'warning',
        mostrarBotonCancelar: true,
        textoAceptar: 'Confirmar',
        identificadorConfirmar: 'btn-AceptarEliminarUser',
        textoCancelar: 'Cancelar',
        identificadorCancelar: 'cancel',

      }
    );
    if (resultModal) {
      this.loadingService.show();

      this.subscriptions.push(this.usuarioService.eliminarUsuario(userSel).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            titulo: 'Usuario Eliminado',
            texto: `El usuario "${userSel.names} ${userSel.middleName} ${userSel.lastName}" fue eliminado con éxito.`,
            icono: 'success',
            mostrarBotonCancelar: false,
            textoAceptar: 'Confirmar',
            identificadorConfirmar: 'btn-AceptarEliminarUser',
          }
        );

        this.iniciarTabla();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onEliminar(userSel);
        }
      }));

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
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}