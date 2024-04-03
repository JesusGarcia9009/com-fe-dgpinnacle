import { Injectable } from '@angular/core';
import { BrokerCompanyModel } from '../model/broker.company.model';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrokerCompanyService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<BrokerCompanyModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.BROKER_LIST_ENDPOINT}`).pipe();
  }


}
