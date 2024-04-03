import { Injectable } from '@angular/core';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtorManagerService {

  public elementSelected: RealtorManagerModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<RealtorManagerModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.REALTOR_LIST_ENDPOINT}`).pipe();
  }

  delete(id: number) {
    return this.httpClient.get<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.REALTOR_DELETE_ENDPOINT}${id}`).pipe();
  }

  save(item: RealtorManagerModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.REALTOR_SAVE_ENDPOINT}`, item)
      .pipe();
  }

}
