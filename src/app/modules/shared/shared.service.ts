import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemModel } from './models/item.model';
import { environment as env } from '../../../environments/environment';
import { ComunaModel } from './models/comuna.model';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private httpClient: HttpClient) { }

  rutFormater(rut: string) {
    if (!rut) { return ''; }

    rut = rut.match(/[0-9Kk]+/g).join('');

    const rutFormated = rut.slice(0, -1).replace((/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g), '$&.') + '-' + rut.slice(-1).toLowerCase();

    return rutFormated;
  }

  rutCleaner(rutFormated: string) {

    const cleanedRut = rutFormated.replace(/\./g, '').split('-')[0];

    return cleanedRut;
  }

  rutSetValidFormat(rutFormated: string) {

    const cleanedRut = rutFormated.replace(/\./g, '');

    return cleanedRut;
  }

  getDefaultDataTableConfig() {

    return {
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No se encontraron resultados",
        emptyTable: "Ningún dato disponible en esta tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la columna de manera ascendente",
          sortDescending: ": Activar para ordenar la columna de manera descendente"
        }
      }
    };

  }

}
