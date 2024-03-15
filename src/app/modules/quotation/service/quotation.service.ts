import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { QuotationModel } from '../models/quotation.model';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  public quotationSelected: QuotationModel;

  constructor(private httpClient: HttpClient) { }

  findProductsByCode(code: string) {
    let params = new HttpParams();
    params = params.append("code", code);
    return this.httpClient.get<any>(
      `${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_AUTOCOMPLETE_ENDPOINT}`, { params: params }
    ).pipe();
  }

  findClientsByCode(code: string) {
    let params = new HttpParams();
    params = params.append("code", code);
    return this.httpClient.get<any>(
      `${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.CLIENT_AUTOCOMPLETE_ENDPOINT}`, { params: params }
    ).pipe();
  }

  findAll(): Observable<Array<QuotationModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_LIST_ENDPOINT}`).pipe();
  }

  findById(id: number): Observable<QuotationModel> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_FIND_ID_ENDPOINT}${id}`).pipe();
  }

  save(quotation: QuotationModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_SAVE_ENDPOINT}`, quotation).pipe();
  }

  delete(element: QuotationModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DELETE_ENDPOINT}`, element).pipe();
  }

  download(id: number) {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DOWNLOAD_ENDPOINT}${id}`, { responseType: 'blob' as 'json' });
  }

  complete(code: string) {
    let params = new HttpParams();
    params = params.append("code", code);
    return this.httpClient.get<any>(
      `${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_COMPLETE_ENDPOINT}`, { params: params }
    ).pipe();
  }

}
