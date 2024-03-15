import { ProfileModel } from './../../auth/models/profile.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/core/services/modal.service';
import { ItemModel } from '../../shared/models/item.model';
import { SharedService } from '../../shared/shared.service';
import { MustMatch } from '../../shared/validators/must-match.validator';
import { ValidateRut } from '../../shared/validators/rut.validator';
import { UsuarioModel } from '../model/usuario.model';
import { UsuariosProperties } from '../properties/usuarios.properties';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios-add-update',
  templateUrl: './usuarios-add-update.component.html',
  styleUrls: ['./usuarios-add-update.component.css']
})
export class UsuariosAddUpdateComponent implements OnInit, OnDestroy {

  public registerUserForm: FormGroup;
  public profiles: Array<ProfileModel>;
  public subscriptions: Array<Subscription> = [];
  public userSel: UsuarioModel;
  public formTitle: string = 'Registro de Usuario';

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private modalService: ModalService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.userSel = this.usuarioService.userSelected;
    sessionStorage.setItem('title', 'Usuarios');

    if (this.userSel) {
      this.formTitle = 'Edición de Usuario';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {


    this.registerUserForm = this.fb.group({
      names: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      rut: ['', [Validators.required, ValidateRut]],
      mail: ['', [Validators.required, Validators.email]],
      businessPosition: ['', [Validators.required]],
      profileId: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
      
    if (this.userSel) {
      this.registerFormControls.names.setValue(this.userSel.names);
      this.registerFormControls.middleName.setValue(this.userSel.middleName);
      this.registerFormControls.lastName.setValue(this.userSel.lastName);
      this.registerFormControls.rut.setValue(this.sharedService.rutFormater(this.userSel.rut));
      this.registerFormControls.mail.setValue(this.userSel.mail);
      this.registerFormControls.businessPosition.setValue(this.userSel.businessPosition);
      this.registerFormControls.profileId.setValue(this.userSel.profileId);
    }

    this.subscriptions.push(this.usuarioService.getRoles().subscribe(result => {
      if(result){
        this.profiles = result;
      }
    }));
  }

  get registerFormControls() { return this.registerUserForm.controls; }

  onRegisterSubmit() {
    const formValue = this.registerUserForm.value;

    if (this.userSel) {
      formValue.id = this.userSel.id;
    }

    formValue.rut = this.sharedService.rutSetValidFormat(formValue.rut);

    this.subscriptions.push(this.usuarioService.guardarUsuario(formValue).subscribe(async value => {
      const textRegistro = this.userSel ? 'editado' : 'registrado';
      await this.modalService.open(
        {
          titulo: `Usuario ${textRegistro}`,
          texto: `El usuario fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarUser'
        }
      );
      this.registerUserForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {

      if (err.error === UsuariosProperties.MAIL_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Usuario duplicado',
            texto: 'El mail o el rut que desea agregar ya se encuentra registrado.',
            icono: 'info',
            mostrarBotonCancelar: false,
            textoAceptar: 'Aceptar',
            identificadorConfirmar: 'btn-GuardarUser'
          }
        );
      } else {
        const modalResult = await this.modalService.open({ tipoGenerico: 'error-gen' });
        if (modalResult) {
          this.onRegisterSubmit();
        }
      }
    }));

  }

  focusOutRut() {
    if (this.registerFormControls.rut.valid) {
      this.registerFormControls
        .rut
        .setValue(this.sharedService.rutFormater(this.registerFormControls.rut.value));
    }
  }

  volver() {
    this.router.navigate(['usuarios']);
  }

  ngOnDestroy() {
    this.usuarioService.userSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());

  }

}
