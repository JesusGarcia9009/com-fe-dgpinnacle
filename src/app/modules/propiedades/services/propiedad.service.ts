import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemModel } from '../../shared/models/item.model';
import { ComunaModel } from '../model/comuna.model';
import { PropiedadModel } from '../model/propiedad.model';
import { environment as env } from '../../../../environments/environment';
import { ProyectoModel } from '../model/proyecto.model';
import { TipologiaProyectoModel } from '../model/tipologia-proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {

  public propiedadSelected: PropiedadModel;
  public proyectoSelected: ProyectoModel;
  public tipologiaSelected: TipologiaProyectoModel;
  public fromProyecto: boolean;

  public orderFn = function (a, b) {
    if (a.referenciaPropiedad > b.referenciaPropiedad) {
      return 1;
    }
    if (a.referenciaPropiedad < b.referenciaPropiedad) {
      return -1;
    }
    // a must be equal to b
    return 0;
  };

  constructor(private httpClient: HttpClient) { }


  getPropiedades(): Observable<Array<PropiedadModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<PropiedadModel> = [];

          result.data.propiedades.sort(this.orderFn).forEach(element => {
            if(element.referenciaPropiedad)
              retorno.push(element as PropiedadModel);
          });
          return retorno;
        })
      );
  }

  getPropiedadByCodigoReferencia(codigoReferencia: string): Observable<PropiedadModel> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}/${codigoReferencia}`)
      .pipe(
        map(result => {
          return result.data.propiedadesFiltradas;
        })
      );
  }

  getListaTipoPropiedad(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.tipoPropiedades.forEach(element => {
            const obj: ItemModel = {
              key: element.tipoPropiedadId,
              value: element.tipoPropiedadDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  getListaClasePropiedad(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.clases.forEach(element => {
            const obj: ItemModel = {
              key: element.claseId,
              value: element.claseDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  getListaProyectos(): Observable<Array<ProyectoModel>> {


    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ProyectoModel> = result.data?.proyectos;
          return retorno;
        })
      );
  }

  getListaRegiones(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.regiones.forEach(element => {
            const obj: ItemModel = {
              key: element.regionId,
              value: element.regionDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  getComunasByRegionId(regionId: string): Observable<Array<ComunaModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}/${regionId}`)
      .pipe(
        map(result => {
          const retorno: Array<ComunaModel> = [];

          result.data.comunas.forEach(element => {
            const obj: ComunaModel = {
              key: element.comunaId,
              value: element.comunaDesc,
              regionId: regionId
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  getListaOrientaciones(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.orientaciones.forEach(element => {
            const obj: ItemModel = {
              key: element.orientacionId,
              value: element.orientacionDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  getlistaSiNo(): Observable<Array<ItemModel>> {

    const retornoTieneHip: Array<ItemModel> = [
      {
        key: '1',
        value: 'S'
      }, {
        key: '0',
        value: 'N'
      }
    ];

    return of(retornoTieneHip);
  }

  getListaStatus(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.status.forEach(element => {
            const obj: ItemModel = {
              key: element.statusId,
              value: element.statusDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }


  getListaBancos(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.bancos.forEach(element => {
            const obj: ItemModel = {
              key: element.bancoId,
              value: element.nombreBanco
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  eliminarPropiedad(propiedad: PropiedadModel) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      propiedad.propiedadesId
    )
      .pipe();
  }

  cambiarEstadoPropiedad(propiedad: PropiedadModel) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      propiedad
    )
      .pipe();
  }


  cambiarEstadoProyecto(proyecto: ProyectoModel) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      proyecto
    )
      .pipe();
  }


  guardarPropiedad(propiedadReq: PropiedadModel) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`, propiedadReq)
      .pipe();

  }

  getlistaTipoUnidad(proyectoIdValue): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}/${proyectoIdValue}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.unidades.forEach(element => {
            const obj: ItemModel = {
         
              key: element.tipoUnidadId,
              value: element.tipoUnidadDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }



  getListaInmobiliaria(): Observable<Array<ItemModel>> {

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`)
      .pipe(
        map(result => {
          const retorno: Array<ItemModel> = [];

          result.data.inmobiliarias.forEach(element => {
            const obj: ItemModel = {
              key: element.tipoPropiedadId,
              value: element.tipoPropiedadDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }


  guardarProyecto(proyectoReq: ProyectoModel) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`, proyectoReq)
      .pipe();

  }


  getTipologiaProyecto(contratoCorrelativo: string): Observable<Array<TipologiaProyectoModel>> {

    // return of(SharedMock.getLIstaTipologia());

    return this.httpClient.get<any>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}/${contratoCorrelativo}`)
      .pipe(
        map(result => {
          const retorno: Array<TipologiaProyectoModel> = [];

          result.data.tipologias.forEach(element => {
            const obj: TipologiaProyectoModel = {
              tipologiaId: element.tipologiaId,
              estado: element.estadoTipologia,
              gComun: element.tipologiaGastoComun,
              m2Terr: element.tipologiaM2Terreno,
              m2Total: element.tipologiaM2Total,
              m2Util: element.tipologiaM2Util,
              maxAdulto: element.tipologiaMaxAdulto,
              maxNino: element.tipologiaMaxNino,
              observaciones: element.tipologiaObs,
              tipo: element.tipologiaUnidadDesc
            }
            retorno.push(obj);
          });
          return retorno;
        })
      );
  }

  cambiarEstadoTipologia(tipologia: any) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      tipologia
    )
      .pipe();
  }


  guardarTipologia(proyectoReq: any) {

    return this.httpClient.post<boolean>(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`, proyectoReq)
      .pipe();

  }



  descargarReportePropiedad(): Observable<Blob> {


    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      {
        responseType: 'blob'
      })
      .pipe();
  }



  descargarReporteProyecto(): Observable<Blob> {


    return this.httpClient.get(`${env.url_ms_base}/${env.gestion_confg.DOMAIN_ROUTE}`,
      {
        responseType: 'blob'
      })
      .pipe();
  }

}
