import { ProfileModel } from '../../auth/models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserModel } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userSelected: UserModel;


  constructor(private httpClient: HttpClient) { }


  getUserList(): Observable<Array<UserModel>> {
    return this.httpClient.get<Array<UserModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_LIST_ENDPOINT}`)
      .pipe();
  }

  saveUser(request: UserModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_REGISTER_ENDPOINT}`, request).pipe();
  }

  deleteUser(usuario: UserModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_DELETE_ENDPOINT}`, usuario)
      .pipe();
  }

  getRoles(): Observable<Array<ProfileModel>> {
    return this.httpClient.get<Array<ProfileModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ROLES_ENDPOINT}`).pipe();
  }
  
}
