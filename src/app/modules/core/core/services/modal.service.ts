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

      if (modalConfig.genericType === 'error-gen') {
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
          title: modalConfig.title,
          text: modalConfig.text,
          icon: modalConfig.icon,
          showCancelButton: modalConfig.showCancelButton,
          confirmButtonText: modalConfig.acceptText,
          cancelButtonText: modalConfig.cancelText,
          confirmButtonAriaLabel: modalConfig.confirmIdentifier,
          cancelButtonAriaLabel: modalConfig.cancelIdentifier
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
