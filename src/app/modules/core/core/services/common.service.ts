import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getLoginInfo(): any {
    try {
      const token = sessionStorage.getItem('token');
      if(token) {
        return jwt_decode(token);
      }
    } catch (err) {
      console.log('error al traer la data de login');
    }
  }

  removeToken() {
    sessionStorage.clear();
  }
}
