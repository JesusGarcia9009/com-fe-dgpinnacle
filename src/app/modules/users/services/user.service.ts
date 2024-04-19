import { ProfileModel } from '../../auth/models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { ChangePasswordModel, UserModel } from '../model/user.model';
import { RealtorManagerModel } from '../model/realtor.manager.model';
import { LoanOfficerModel } from '../model/loan.model';
import { ClientManagerModel } from '../model/client.manager.model';

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

  changePassword(request: ChangePasswordModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_CHANGE_PASSWORD_ENDPOINT}`, request).pipe();
  }

  deleteUser(usuario: UserModel) {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_DELETE_ENDPOINT}`, usuario)
      .pipe();
  }

  getRoles(): Observable<Array<ProfileModel>> {
    return this.httpClient.get<Array<ProfileModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ROLES_ENDPOINT}`).pipe();
  }

  getRealtor(user: UserModel): Observable<RealtorManagerModel>{
    if(user){
      return this.httpClient.get<RealtorManagerModel>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_FIND_REALTOR_ENDPOINT}/${user.id}`).pipe();
    }else{
      return of(null);
    }
  }

  getClient(user: UserModel): Observable<ClientManagerModel>{
    if(user){
      return this.httpClient.get<ClientManagerModel>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_FIND_CLIENT_ENDPOINT}/${user.id}`).pipe();
    }else{
      return of(null);
    }
  }

  getLoan(user: UserModel): Observable<LoanOfficerModel>{
    return this.httpClient.get<LoanOfficerModel>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_FIND_LOAN_ENDPOINT}/${user.id}`).pipe();
  }

}
