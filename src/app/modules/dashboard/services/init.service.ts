import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { DashboardWidgetModel } from '../models/quotation.model';


@Injectable({
  providedIn: 'root'
})
export class InitService {


  constructor(private httpClient: HttpClient) { }

  findAllDashboardWidgets(): Observable<DashboardWidgetModel> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.DASHBOARD_ENDPOINT}`).pipe();
  }

  download(): Observable<Blob> {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.DASHBOARD_DOCUMENT_ENDPOINT}`,
      { responseType: 'blob' }).pipe();
  }


}
