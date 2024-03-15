import { ClientModel } from '../models/client.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public clientSelected: ClientModel;

  public orderFn = function (a, b) {
    if (a.referenciaPropiedad > b.referenciaPropiedad) {
      return 1;
    }
    if (a.referenciaPropiedad < b.referenciaPropiedad) {
      return -1;
    }
    return 0;
  };

  constructor(private httpClient: HttpClient) { }

  getClients(): Observable<Array<ClientModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_LIST_ENDPOINT}`).pipe();
  }

  save(client: ClientModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_SAVE_ENDPOINT}`, client)
      .pipe();
  }

  delete(element: ClientModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_DELETE_ENDPOINT}`, element).pipe();
  }

}
