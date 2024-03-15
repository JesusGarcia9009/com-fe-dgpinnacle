
export interface VncArrendatarioModel {
    nombreArrendatario: string;
    rutArrendatario: string;
    pasaporteArrendatario: string;
    arriendosTotales?: number;
    arriendosActivos?: number;
}


export interface VncPropiedadModel {
    cantidadEstac: string;
    direccion: string;
    numDepto: string;
    piso: string;
    referenciaPropiedad: string;
    torre: string;
    vncProyectos: VncProyectosModel;
    vncComuna: VncComunaModel;
    vncRegiones: VncRegionesModel;

}


export interface VncProyectosModel {
    proyectoCorrelativoId: string;
    proyectoDesc: string;
    proyectoDireccion: string;
}

export interface VncComunaModel {
    comunaDesc: string;
}

export interface VncRegionesModel {
    regionDesc: string;
}

export interface VncTipoPropiedadModel {
    tipoPropiedadDesc: string;
    tipoPropiedadEstado: string;
    tipoPropiedadId: number;
}