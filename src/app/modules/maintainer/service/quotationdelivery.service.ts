import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuotationDeliveryModel } from '../models/quotation.delivery.model';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationdeliveryService {

  public elementSelected: QuotationDeliveryModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<QuotationDeliveryModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DELIVERY_LIST_ENDPOINT}`).pipe();
  }

  save(element: QuotationDeliveryModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DELIVERY_SAVE_ENDPOINT}`, element).pipe();
  }

  delete(element: QuotationDeliveryModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.QUOTATION_DELIVERY_DELETE_ENDPOINT}`, element).pipe();
  }
}
