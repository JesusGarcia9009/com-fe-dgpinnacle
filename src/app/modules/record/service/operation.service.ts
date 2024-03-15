import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { OperationModel, OperationRequestModel, OperationTypeModel } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private httpClient: HttpClient) { }

  loadlistOperationsByDates(filters: OperationRequestModel): Observable<Array<OperationModel>> {
    return this.httpClient.post<Array<OperationModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.OPERATION_LIST_ENDPOINT}`, filters);
  }

  findAllUsers(): Observable<Array<string>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.OPERATION_LIST_USERS_ENDPOINT}`).pipe();
  }

  findAllStates(): Observable<Array<string>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.OPERATION_LIST_STATES_ENDPOINT}`).pipe();
  }

  findAllTypes(): Observable<Array<OperationTypeModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.OPERATION_LIST_TYPES_ENDPOINT}`).pipe();
  }

}
