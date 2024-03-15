import { Injectable } from '@angular/core';
import { BillOrderNoteModel, OrderNoteModel, ReverseOrderNoteModel } from '../models/order-note.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public orderNoteSelected: OrderNoteModel;

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Array<OrderNoteModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_LIST_ENDPOINT}`).pipe();
  }

  save(element: OrderNoteModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_SAVE_ENDPOINT}`, element).pipe();
  }

  reverse(element: ReverseOrderNoteModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_REVERSE_ENDPOINT}`, element).pipe();
  }

  delete(element: OrderNoteModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_DELETE_ENDPOINT}`, element).pipe();
  }

  download(id: number) {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_DOWNLOAD_ENDPOINT}${id}`, { responseType: 'blob' as 'json' });
  }

  bill(element: BillOrderNoteModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ORDER_BILL_ENDPOINT}`, element).pipe();
  }
}
