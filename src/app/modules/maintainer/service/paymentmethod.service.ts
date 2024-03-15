import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { PaymentMethodModel } from '../models/payment.method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentmethodService {

  public elementSelected: PaymentMethodModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<PaymentMethodModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PAYMENT_METHOD_LIST_ENDPOINT}`).pipe();
  }

  save(element: PaymentMethodModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PAYMENT_METHOD_SAVE_ENDPOINT}`, element).pipe();
  }

  delete(element: PaymentMethodModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PAYMENT_METHOD_DELETE_ENDPOINT}`, element).pipe();
  }
}
