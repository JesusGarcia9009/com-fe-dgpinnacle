import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { InventoryModel } from '../models/inventory.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  public inventorySelected: InventoryModel;

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Array<InventoryModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_TWEAKS_LIST_ENDPOINT}`).pipe();
  }

  save(element: InventoryModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_TWEAKS_SAVE_ENDPOINT}`, element).pipe();
  }

  implement(element: InventoryModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_TWEAKS_IMPLEMENT_ENDPOINT}`, element).pipe();
  }

  delete(element: InventoryModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.INVENTORY_TWEAKS_DELETE_ENDPOINT}`, element).pipe();
  }


}
