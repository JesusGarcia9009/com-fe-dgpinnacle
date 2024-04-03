import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponseModel, LoginRequestModel } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../core/core/services/common.service';
import { environment as env } from '../../../../environments/environment';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  login(req: LoginRequestModel): Observable<LoginResponseModel> {

    this.commonService.removeToken();

    return this.httpClient.post<LoginResponseModel>(`${env.url_ms_base}/${env.login_conf.DOMAIN_ROUTE}${env.login_conf.LOGIN_ENDPOINT}`, req)
      .pipe();
  }

  register(req: RegisterModel): Observable<boolean> {
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.login_conf.DOMAIN_ROUTE}${env.login_conf.REGISTER_ENDPOINT}`, req).pipe();
  }

  registerLoginInfo(loginValue: LoginResponseModel) {
    Object.entries(loginValue).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
  }



}
