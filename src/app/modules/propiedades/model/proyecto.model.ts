export interface ProyectoModel {
    proyectoId: number;
    proyectoDesc: string;
    proyectoCorrelativoId: string;
    proyectoDireccion: string;
    proyectoFechaCreacion: Date;
    proyectoFechaModificacion: Date;
    comunaId: number;
    regionId: number;
    proyectoInmobiliaria: string;
    estadoProyecto: number;
    proyectoAtributo: string;
}