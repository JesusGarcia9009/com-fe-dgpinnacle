import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemModel } from '../models/item.model';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  public elementSelected: ItemModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<ItemModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.SOURCE_LIST_ENDPOINT}`).pipe();
  }

  save(element: ItemModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.SOURCE_SAVE_ENDPOINT}`, element).pipe();
  }

  delete(element: ItemModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.SOURCE_DELETE_ENDPOINT}`, element).pipe();
  }
}
