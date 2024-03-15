import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalModel } from '../model/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  async open(modalConfig: ModalModel): Promise<boolean> {
    try {
      let internalModalConfig = null;

      if (modalConfig.tipoGenerico === 'error-gen') {
        internalModalConfig = {
          title: 'Ha ocurrido un error',
          text: "¿Desea reintentar esta operación?",
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Reintentar',
          cancelButtonText: 'Cancelar',
          confirmButtonAriaLabel: 'confirmGenericErrorBtn',
          cancelButtonAriaLabel: 'cancelGenericErrorBtn'
        };
      } else {
        internalModalConfig = {
          title: modalConfig.titulo,
          text: modalConfig.texto,
          icon: modalConfig.icono,
          showCancelButton: modalConfig.mostrarBotonCancelar,
          confirmButtonText: modalConfig.textoAceptar,
          cancelButtonText: modalConfig.textoCancelar,
          confirmButtonAriaLabel: modalConfig.identificadorConfirmar,
          cancelButtonAriaLabel: modalConfig.identificadorCancelar
        };
      }

      const result = await Swal.fire(internalModalConfig);

      if (result.value) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error('error al levantar modal');
    }
  }
}
