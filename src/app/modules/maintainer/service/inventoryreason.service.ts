import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { InventoryReasonModel } from '../models/inventory.reason.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryreasonService {

  public elementSelected: InventoryReasonModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<InventoryReasonModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_REASON_LIST_ENDPOINT}`).pipe();
  }

  save(element: InventoryReasonModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_REASON_SAVE_ENDPOINT}`, element).pipe();
  }

  delete(element: InventoryReasonModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_REASON_DELETE_ENDPOINT}`, element).pipe();
  }
}
