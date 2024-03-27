import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ClientManagerModel } from '../model/client.manager.model';

@Injectable({
  providedIn: 'root'
})
export class ClientManagerService {

  public elementSelected: ClientManagerModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<ClientManagerModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_LIST_ENDPOINT}`).pipe();
  }

  delete(id: number) {
    return this.httpClient.get<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_DELETE_ENDPOINT}${id}`).pipe();
  }

  save(item: ClientManagerModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_SAVE_ENDPOINT}`, item)
      .pipe();
  }
}
