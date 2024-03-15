import { ModelModel } from './../models/model.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  public elementSelected: ModelModel;

  constructor(private httpClient: HttpClient) { }

  getListBy(idBrand: number): Observable<Array<ModelModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.MODEL_LIST_ENDPOINT}${idBrand}`).pipe();
  }

  save(element: ModelModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.MODEL_SAVE_ENDPOINT}`, element).pipe();
  }

  delete(element: ModelModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.MODEL_DELETE_ENDPOINT}`, element).pipe();
  }
}
