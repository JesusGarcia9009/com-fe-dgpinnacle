import { UniversalgroupsService } from './../../service/universalgroups.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/modules/core/core/services/modal.service';
import { ItemModel } from '../../models/item.model';
import { SourceService } from '../../service/source.service';
import { MaintainerProperties } from '../../properties/maintainer.properties';

@Component({
  selector: 'app-add-update-universalgroups',
  templateUrl: './add-update-universalgroups.component.html',
  styleUrls: ['./add-update-universalgroups.component.css']
})
export class AddUpdateUniversalgroupsComponent implements OnInit, OnDestroy {

  public registerItemForm: FormGroup;
  public subscriptions: Array<Subscription> = [];
  public elementSelected: ItemModel;
  public formTitle: string = 'Registro de grupos universales';
  public isReadOnly: boolean;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementService: UniversalgroupsService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.elementSelected = this.elementService.elementSelected;
    sessionStorage.setItem('title', 'Grupos');

    if (this.elementSelected) {
      this.formTitle = 'Edición de Grupos';
    }
    this.iniciarFormulario();
  }

  iniciarFormulario() {

    if (this.isReadOnly) {
      this.registerItemForm = this.fb.group({
        id: [{ value: null, disabled: true }, []],
        code: [{ value: null, disabled: true }, []],
        description: [{ value: null, disabled: true }, []]
      });
    } else {
      this.registerItemForm = this.fb.group({
        id: ['', []],
        code: ['', [Validators.required]],
        description: ['', [Validators.required]]
      });
    }
    
      
    if (this.elementSelected) {
      this.registerFormControls.id.setValue(this.elementSelected.id);
      this.registerFormControls.code.setValue(this.elementSelected.code);
      this.registerFormControls.description.setValue(this.elementSelected.description);
    }
  }

  get registerFormControls() { return this.registerItemForm.controls; }

  onRegisterSubmit() {
    const formValue = this.registerItemForm.value;
    if (this.elementSelected) {
      formValue.id = this.elementSelected.id;
    }else{
      formValue.id = null;
    }
    this.subscriptions.push(this.elementService.save(formValue).subscribe(async value => {
      const textRegistro = this.elementSelected ? 'editado' : 'registrado';
      await this.modalService.open(
        {
          titulo: `Grupo ${textRegistro}`,
          texto: `El grupo fue ${textRegistro} correctamente.`,
          icono: 'success',
          mostrarBotonCancelar: false,
          textoAceptar: 'Aceptar',
          identificadorConfirmar: 'btn-GuardarUser'
        }
      );
      this.registerItemForm.reset();
      this.formDirective.resetForm();
      this.volver();
    }, async err => {

      if (err.error === MaintainerProperties.GROUP_DUPL_MSG) {
        await this.modalService.open(
          {
            titulo: 'Grupo duplicado',
            texto: 'El código que desea agregar ya se encuentra registrado.',
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

  volver() {
    this.router.navigate(['maintainer/index/1']);
  }

  ngOnDestroy() {
    this.elementService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

}

