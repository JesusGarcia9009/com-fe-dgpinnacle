import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { RealtorModel } from '../models/realtor.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtorService {

  public elementSelected: RealtorModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<RealtorModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.REALTOR_LIST_OP_ENDPOINT}`).pipe();
  }

}
