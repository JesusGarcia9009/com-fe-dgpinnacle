import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProviderModel } from '../models/provider.model';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  public providerSelected: ProviderModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<ProviderModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PROVIDER_LIST_ENDPOINT}`).pipe();
  }

  save(provider: ProviderModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PROVIDER_SAVE_ENDPOINT}`, provider)
      .pipe();
  }

  delete(element: ProviderModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PROVIDER_DELETE_ENDPOINT}`, element).pipe();
  }
}
