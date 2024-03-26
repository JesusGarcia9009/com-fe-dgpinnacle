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
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.REALTOR_LIST_ENDPOINT}`).pipe();
  }

  // delete(item: LetterModel) {
  //   return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_DELETE_ENDPOINT}`, item).pipe();
  // }

  // save(item: LetterModel) {
  //   return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.PRODUCT_SAVE_ENDPOINT}`, item)
  //     .pipe();
  // }
}
