import { Injectable } from '@angular/core';
import { LetterModel } from '../models/letter.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';
import { LetterEncompassModel } from '../models/encompass.letter.model';

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  public elementSelected: LetterModel;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<LetterModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_LIST_ENDPOINT}`).pipe();
  }

  findDetailsEncopass(loanId: string): Observable<LetterEncompassModel> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_ENCO_ENDPOINT}/${loanId}`).pipe();
  }

  delete(id: number) {
    return this.httpClient.get<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_DELETE_ENDPOINT}${id}`).pipe();
  }

  save(item: LetterModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_SAVE_ENDPOINT}`, item)
      .pipe();
  }

  saveEncompass(item: LetterEncompassModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_ENCO_SAVE_ENDPOINT}`, item)
      .pipe();
  }

  download(id: number) {
    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.LETTER_DOWNLOAD_ENDPOINT}${id}`, { responseType: 'blob' as 'json' });
  }

}
