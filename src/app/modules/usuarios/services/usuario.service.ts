import { ProfileModel } from './../../auth/models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemModel } from '../../shared/models/item.model';
import { UsuarioRequestModel } from '../model/usuario-request.model';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public userSelected: UsuarioModel;


  constructor(private httpClient: HttpClient) { }


  getUsuarioList(): Observable<Array<UsuarioModel>> {

    return this.httpClient.get<Array<UsuarioModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_LIST_ENDPOINT}`)
      .pipe();
    // return of(this.userArr)

  }

  guardarUsuario(usuarioFormValue: any) {
    const cleanedRutPre = this.rutCleaner(this.rutFormater(usuarioFormValue.rut));
    const rutDv = usuarioFormValue.rut.slice(-1);
    const request: UsuarioRequestModel = {
      names: usuarioFormValue.names,
      middleName: usuarioFormValue.middleName,
      lastName: usuarioFormValue.lastName,
      rut: cleanedRutPre + '-' + rutDv,
      mail: usuarioFormValue.mail,
      businessPosition: usuarioFormValue.businessPosition,
      profileId: usuarioFormValue.profileId,
      id: usuarioFormValue.id ? usuarioFormValue.id : null,
      pass: usuarioFormValue.password
    }
    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_REGISTER_ENDPOINT}`, request).pipe();
  }


  eliminarUsuario(usuario: UsuarioModel) {


    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.USER_DELETE_ENDPOINT}`, usuario)
      .pipe();

  }

  getRoles(): Observable<Array<ProfileModel>> {
    return this.httpClient.get<Array<ProfileModel>>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}${env.gestion_confg.ROLES_ENDPOINT}`).pipe();
  }

  rutFormater(rut: string) {
    if (!rut) { return ''; }

    rut = rut.match(/[0-9Kk]+/g).join('');

    const rutFormated = rut.slice(0, -1).replace((/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g), '$&.') + '-' + rut.slice(-1).toLowerCase();

    return rutFormated;
  }

  rutCleaner(rutFormated: string) {

    const cleanedRut = rutFormated.replace(/\./g, '').split('-')[0];

    return cleanedRut;
  }
}
