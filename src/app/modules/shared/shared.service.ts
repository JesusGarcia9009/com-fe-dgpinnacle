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
        processing: "Processing...",
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        loadingRecords: "Loading...",
        zeroRecords: "No matching records found",
        emptyTable: "No data available in table",
        paginate: {
            first: "First",
            previous: "Previous",
            next: "Next",
            last: "Last"
        },
        aria: {
            sortAscending: ": activate to sort column ascending",
            sortDescending: ": activate to sort column descending"
        }
    }
    
    };

  }

}
