import { CountryModel, ProvinceOrStateModel, RegionOrCityModel } from '../models/province.region.country.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  getCounties(): Observable<Array<CountryModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ADDRESS_LIST_COUNTRY_ENDPOINT}`).pipe();
  }

  getRegionOrCity(idCountry: number): Observable<Array<RegionOrCityModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ADDRESS_LIST_REGION_ENDPOINT}${idCountry}`).pipe();
  }

  getProvinceOrState(idRegion: number): Observable<Array<ProvinceOrStateModel>> {
    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ADDRESS_LIST_PROVIDENCE_ENDPOINT}${idRegion}`).pipe();
  }
}
