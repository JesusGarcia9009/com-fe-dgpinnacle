import { Injectable } from '@angular/core';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LoanOfficerModel } from '../model/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  public elementSelected: LoanOfficerModel;

  constructor(private httpClient: HttpClient) { }

  save(item: LoanOfficerModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LOAN_SAVE_ENDPOINT}`, item)
      .pipe();
  }
}
